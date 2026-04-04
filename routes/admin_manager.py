from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash
from functools import wraps
from models.user import User
from models.teachers import Teacher
from models.staffs import Staff
from models.admin import Admin
from database import SessionLocal

bp = Blueprint("admin_manager", __name__, url_prefix="/admin")


# ฟังก์ชันยามเฝ้าประตู (อัปเกรดการเช็ค Session)
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("user_id") or session.get("role") != "admin":
            return redirect(url_for("home.index"))
        return f(*args, **kwargs)

    return decorated_function


# Dashboard
@bp.route("/dashboard")
@admin_required
def dashboard():
    db = SessionLocal()
    try:
        students = db.query(User).order_by(User.id.desc()).all()
        teachers = db.query(Teacher).order_by(Teacher.id.desc()).all()
        staffs = db.query(Staff).order_by(Staff.id.desc()).all()
        return render_template(
            "admin_manager.html", students=students, teachers=teachers, staffs=staffs
        )
    finally:
        db.close()


# ระบบเพิ่มข้อมูล (อัปเกรด Validation)
@bp.route("/add/<role>", methods=["POST"])
@admin_required
def add_user(role):
    db = SessionLocal()
    try:
        full_name = request.form.get("full_name")
        password = request.form.get("password")

        if not full_name or not password or len(password.strip()) < 4:
            flash("กรุณากรอกชื่อและรหัสผ่านให้ถูกต้อง (อย่างน้อย 4 ตัวอักษร)", "error")
            return redirect(url_for("admin_manager.dashboard"))

        new_user = None
        if role == "student":
            uid = request.form.get("student_id")
            if db.query(User).filter((User.student_id == uid)).first():
                flash(f"รหัสนักเรียน {uid} มีในระบบแล้ว!", "error")
                return redirect(url_for("admin_manager.dashboard"))

            new_user = User(
                student_id=uid,
                full_name=full_name,
                email=request.form.get("email") or f"{uid}@student.com",
                grade_level=request.form.get("grade_level", "-"),
                room=request.form.get("room", "-"),
                password=generate_password_hash(password),
                role="student",
            )

        elif role == "teacher":
            uid = request.form.get("teacher_id")
            if db.query(Teacher).filter((Teacher.teacher_id == uid)).first():
                flash(f"รหัสครู {uid} มีในระบบแล้ว!", "error")
                return redirect(url_for("admin_manager.dashboard"))

            new_user = Teacher(
                teacher_id=uid,
                full_name=full_name,
                email=request.form.get("email") or f"{uid}@teacher.com",
                department=request.form.get("department", "ไม่ระบุ"),
                password=generate_password_hash(password),
                role="teacher",
            )

        elif role == "staff":
            uid = request.form.get("staff_id")
            if db.query(Staff).filter((Staff.staff_id == uid)).first():
                flash(f"รหัสเจ้าหน้าที่ {uid} มีในระบบแล้ว!", "error")
                return redirect(url_for("admin_manager.dashboard"))

            new_user = Staff(
                staff_id=uid,
                full_name=full_name,
                email=request.form.get("email") or f"{uid}@staff.com",
                position=request.form.get("position", "ไม่ระบุ"),
                password=generate_password_hash(password),
                role="staff",
            )

        if new_user:
            db.add(new_user)
            db.commit()
            flash(f"เพิ่ม {full_name} สำเร็จ!", "success")

    except Exception as e:
        db.rollback()
        # 2. แข็งแกร่งขึ้น: ไม่พ่น Error ดิบของ SQL ออกไป (Security)
        flash(
            "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาเช็คความถูกต้องของรหัสประจำตัว",
            "error",
        )
    finally:
        db.close()
    return redirect(url_for("admin_manager.dashboard"))


# ระบบแก้ไข (อัปเกรด Password Safety)
@bp.route("/edit/<role>/<int:id>", methods=["POST"])
@admin_required
def edit_user(role, id):
    db = SessionLocal()
    try:
        model = User if role == "student" else Teacher if role == "teacher" else Staff
        user = db.query(model).get(id)

        if user:
            user.full_name = request.form.get("full_name", user.full_name)
            user.email = request.form.get("email", user.email)

            if role == "student":
                user.grade_level = request.form.get("grade_level", user.grade_level)
                user.room = request.form.get("room", user.room)
            elif role == "teacher":
                user.department = request.form.get("department", user.department)
            elif role == "staff":
                user.position = request.form.get("position", user.position)

            new_pwd = request.form.get("password")
            if new_pwd and len(new_pwd.strip()) >= 4:
                user.password = generate_password_hash(new_pwd.strip())

            db.commit()
            flash(f"อัปเดตข้อมูลของ {user.full_name} เรียบร้อย!", "success")
        else:
            flash("ไม่พบข้อมูลผู้ใช้", "error")
    finally:
        db.close()
    return redirect(url_for("admin_manager.dashboard"))


# ระบบลบผู้ใช้งาน (อัปเกรด Self-Protection)
@bp.route("/delete/<role>/<int:id>", methods=["POST"])
@admin_required
def delete_user(role, id):
    # 4. แข็งแกร่งขึ้น: "Anti-Suicide" ห้ามแอดมินลบตัวเอง (ถ้าแอดมินอยู่ในตารางเดียวกัน)
    if role == "admin" and id == session.get("user_id"):
        flash("คุณไม่สามารถลบบัญชีที่กำลังใช้งานอยู่ได้!", "error")
        return redirect(url_for("admin_manager.dashboard"))

    db = SessionLocal()
    try:
        model = User if role == "student" else Teacher if role == "teacher" else Staff
        user = db.query(model).get(id)
        if user:
            db.delete(user)
            db.commit()
            flash("ลบข้อมูลสำเร็จ!", "success")
    finally:
        db.close()
    return redirect(url_for("admin_manager.dashboard"))
