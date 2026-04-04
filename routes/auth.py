from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from werkzeug.security import check_password_hash
from sqlalchemy import or_
from models.user import User
from models.teachers import Teacher
from models.staffs import Staff
from database import SessionLocal
from datetime import datetime
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

bp = Blueprint("auth", __name__, url_prefix="/auth")
limiter = Limiter(key_func=get_remote_address)


@bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        login_input = request.form["username"]
        password = request.form["password"]

        db = SessionLocal()
        user_obj = None
        role = None

        # 1. ค้นหา User (โค้ดเดิมของคุณ)
        student = (
            db.query(User)
            .filter(
                or_(User.student_id.ilike(login_input), User.email.ilike(login_input))
            )
            .first()
        )
        if student:
            user_obj, role = student, "student"

        if not user_obj:
            teacher = (
                db.query(Teacher)
                .filter(
                    or_(
                        Teacher.teacher_id.ilike(login_input),
                        Teacher.email.ilike(login_input),
                    )
                )
                .first()
            )
            if teacher:
                user_obj, role = teacher, "teacher"

        if not user_obj:
            staff = (
                db.query(Staff)
                .filter(
                    or_(
                        Staff.staff_id.ilike(login_input),
                        Staff.email.ilike(login_input),
                    )
                )
                .first()
            )
            if staff:
                user_obj, role = staff, "staff"

        if not user_obj:
            from models.admin import Admin

            admin_user = (
                db.query(Admin).filter(Admin.admin_id.ilike(login_input)).first()
            )
            if admin_user:
                user_obj, role = admin_user, "admin"

        # 2. ตรวจสอบรหัสผ่าน
        if user_obj and check_password_hash(user_obj.password, password):
            session.clear()
            session["user_id"] = user_obj.id
            session["role"] = role
            session["full_name"] = user_obj.full_name

            id_map = {
                "student": "student_id",
                "teacher": "teacher_id",
                "staff": "staff_id",
                "admin": "admin_id",
            }
            session["identifier"] = getattr(user_obj, id_map[role])

            user_obj.last_login = datetime.now()
            db.commit()
            db.close()

            if role == "admin":
                return redirect(url_for("home.index"))
            else:
                flash("login_success")
                return redirect(url_for("auth.login"))

        else:
            db.close()
            limiter.limit("3 per minute")(lambda: None)()

            flash("login_error")
            return redirect(url_for("auth.login"))

    return render_template("login.html")


@bp.route("/logout")
def logout():
    session.clear()
    flash("logout_success")
    return redirect(url_for("auth.login"))


# แถม: ตัวจัดการเมื่อโดนแบน (Rate Limit Exceeded) ไม่ให้หน้าเว็บพัง
@bp.app_errorhandler(429)
def handle_ratelimit_error(e):
    flash("too_many_requests")
    return redirect(url_for("auth.login"))
