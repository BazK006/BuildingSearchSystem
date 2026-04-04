from flask import Blueprint, render_template, session, abort, jsonify, request
from models.building import Building
from models.viewlog import ViewLog
from database import SessionLocal
from sqlalchemy import func, extract
from datetime import datetime

admin_stats_bp = Blueprint("admin_stats", __name__)


@admin_stats_bp.route("/admin/statistics")
def show_statistics():
    if session.get("role") != "admin":
        abort(403)

    db = SessionLocal()
    try:
        now = datetime.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        buildings_list = db.query(Building).all()
        building_data = []

        for b in buildings_list:

            count_today = (
                db.query(func.count(ViewLog.id))
                .filter(ViewLog.building_id == b.id, ViewLog.viewed_at >= today_start)
                .scalar()
                or 0
            )

            count_month = (
                db.query(func.count(ViewLog.id))
                .filter(ViewLog.building_id == b.id, ViewLog.viewed_at >= month_start)
                .scalar()
                or 0
            )

            count_year = (
                db.query(func.count(ViewLog.id))
                .filter(
                    ViewLog.building_id == b.id,
                    extract("year", ViewLog.viewed_at) == now.year,
                )
                .scalar()
                or 0
            )

            building_data.append(
                {
                    "id": b.id,
                    "name": b.name,
                    "viewCount": b.view_count or 0,
                    "viewCountToday": count_today,
                    "viewCountMonth": count_month,
                    "viewCountYear": count_year,
                    "category": b.category.name if b.category else "ทั่วไป",
                }
            )
    finally:
        db.close()

    return render_template("admin_stats.html", buildings=building_data, year=now.year)


# =========================================================
# ฟังก์ชันใหม่! สร้าง API เพื่อให้ JavaScript มาขอดึงข้อมูลแบบ Custom
# =========================================================
@admin_stats_bp.route("/api/custom_stats")
def custom_stats():
    if session.get("role") != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    start_date_str = request.args.get("start")
    end_date_str = request.args.get("end")

    if not start_date_str or not end_date_str:
        return jsonify({"error": "กรุณาส่งวันที่มาให้ครบ"}), 400

    db = SessionLocal()
    try:
        # แปลงข้อความจากหน้าเว็บให้เป็นรูปแบบ วัน-เวลา (ให้จบที่เวลา 23:59:59 ของวันสุดท้าย)
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").replace(
            hour=23, minute=59, second=59
        )

        buildings_list = db.query(Building).all()
        result_data = []

        for b in buildings_list:
            # ค้นหาใน ViewLog เฉพาะช่วงเวลาที่เราต้องการ!
            count_custom = (
                db.query(func.count(ViewLog.id))
                .filter(
                    ViewLog.building_id == b.id,
                    ViewLog.viewed_at >= start_date,
                    ViewLog.viewed_at <= end_date,
                )
                .scalar()
                or 0
            )


            result_data.append(
                {
                    "id": b.id,
                    "name": b.name,
                    "viewCount": count_custom,
                    "category": b.category.name if b.category else "ทั่วไป",
                }
            )

        return jsonify(result_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
