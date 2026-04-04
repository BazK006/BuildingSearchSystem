from flask import Blueprint, render_template, url_for, jsonify, request
from models.building import Building
from models.category import Category
from models.viewlog import ViewLog
from database import SessionLocal
from datetime import datetime
import traceback

bp = Blueprint("build_search", __name__, template_folder="../templates")


@bp.route("/")
def search():
    db = SessionLocal()
    try:
        categories = db.query(Category).all()
        select_cat = request.args.get("select_cat")

        query = db.query(Building)
        if select_cat:
            query = query.filter(Building.category_id == select_cat)

        buildings = query.order_by(Building.id).all()
        building_data = []
        for b in buildings:
            img_url = (
                url_for("static", filename="uploads/" + b.image_file)
                if b.image_file
                else url_for("static", filename="images/default_building.jpg")
            )

            building_data.append(
                {
                    "id": b.id,
                    "name": b.name,
                    "desc": b.description,
                    "img": img_url,
                    "mapsLink": b.maps_link,
                    "viewCount": b.view_count or 0,
                    "categoryId": b.category_id,
                    "category": b.category.name if b.category else "ไม่มีหมวดหมู่",
                }
            )
    finally:
        db.close()
    return render_template(
        "BuildingFindSystem.html",
        buildings=buildings,
        building_data=building_data,
        categories=categories,
        select_cat=select_cat,
    )


@bp.route("/increment_view/<int:id>", methods=["POST"])
def increment_view(id):
    db = SessionLocal()
    try:
        building = db.query(Building).filter(Building.id == id).first()
        if building:
            building.view_count = (building.view_count or 0) + 1

            new_log = ViewLog(
                building_id=id,
                viewed_at=datetime.now(),
                ip_address=request.remote_addr,
                user_agent=request.user_agent.string,
            )
            db.add(new_log)

            db.commit()
            print(f"Success: Building {id} view updated!")
            return jsonify({"success": True, "new_count": building.view_count})

    except Exception as e:
        db.rollback()
        print(f"Error Database: {e}")
        traceback.print_exc()
    finally:
        db.close()
    return jsonify({"success": False})
