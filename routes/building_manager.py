import os
import uuid  # เพิ่มเพื่อสร้าง Unique ID ให้ชื่อไฟล์
from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from functools import wraps
from werkzeug.utils import secure_filename
from models.building import Building
from models.category import Category
from database import SessionLocal
from sqlalchemy.orm import joinedload

bp = Blueprint("build_manager", __name__, url_prefix="/manage-build")

UPLOAD_FOLDER = "static/uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}  # กำหนดนามสกุลไฟล์ที่อนุญาต

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


# --- Helper Functions ---
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def delete_old_image(filename):
    if filename and filename != "default_building.jpg":
        path = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(path):
            try:
                os.remove(path)
            except Exception as e:
                print(f"ลบไฟล์ไม่สำเร็จ: {e}")


def staff_or_admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("role") not in ["admin", "staff"]:
            flash("คุณไม่มีสิทธิ์เข้าถึงหน้านี้!", "error")
            return redirect(url_for("home.index"))
        return f(*args, **kwargs)

    return decorated_function


# --- Routes ---
@bp.route("/")
@staff_or_admin_required
def dashboard():
    db = SessionLocal()
    try:
        buildings = (
            db.query(Building)
            .options(joinedload(Building.category))
            .order_by(Building.id)
            .all()
        )
        categories = db.query(Category).all()
        return render_template(
            "build_manager.html", buildings=buildings, categories=categories
        )
    finally:
        db.close()


@bp.route("/add", methods=["POST"])
@staff_or_admin_required
def add_building():
    db = SessionLocal()
    try:
        name = request.form.get("name")
        if not name or not request.form.get("category_id"):
            flash("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน!", "error")
            return redirect(url_for("build_manager.dashboard"))

        file = request.files.get("image_file")
        filename = "default_building.jpg"

        # 2. จัดการไฟล์อย่างปลอดภัย
        if file and file.filename != "" and allowed_file(file.filename):
            ext = os.path.splitext(secure_filename(file.filename))[1]
            filename = f"{uuid.uuid4().hex}{ext}"  # ป้องกันชื่อซ้ำด้วย UUID
            file.save(os.path.join(UPLOAD_FOLDER, filename))

        new_build = Building(
            name=name,
            description=request.form.get("description", "-"),
            category_id=request.form.get("category_id"),
            image_file=filename,
            maps_link=request.form.get("maps_link", ""),
        )
        db.add(new_build)
        db.commit()
        flash("เพิ่มข้อมูลอาคารสำเร็จ!", "success")
    except Exception as e:
        db.rollback()
        flash(
            "เกิดข้อผิดพลาดในการเพิ่มข้อมูล", "error"
        )  # ไม่หลุด Error ลึกๆ ให้ User เห็น
    finally:
        db.close()
    return redirect(url_for("build_manager.dashboard"))


@bp.route("/edit/<int:id>", methods=["POST"])
@staff_or_admin_required
def edit_building(id):
    db = SessionLocal()
    try:
        build = db.query(Building).get(id)  # ใช้ .get() ประสิทธิภาพดีกว่า
        if not build:
            flash("ไม่พบข้อมูลอาคาร!", "error")
            return redirect(url_for("build_manager.dashboard"))

        build.name = request.form.get("name", build.name)
        build.description = request.form.get("description", build.description)
        build.maps_link = request.form.get("maps_link", build.maps_link)

        cat_id = request.form.get("category_id")
        if cat_id:
            build.category_id = cat_id

        file = request.files.get("image_file")
        if file and file.filename != "" and allowed_file(file.filename):
            delete_old_image(build.image_file)
            ext = os.path.splitext(secure_filename(file.filename))[1]
            filename = f"{uuid.uuid4().hex}{ext}"
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            build.image_file = filename

        db.commit()
        flash("แก้ไขข้อมูลสำเร็จ!", "success")
    except Exception as e:
        db.rollback()
        flash("เกิดข้อผิดพลาดในการแก้ไข", "error")
    finally:
        db.close()
    return redirect(url_for("build_manager.dashboard"))


@bp.route("/delete/<int:id>", methods=["POST"])
@staff_or_admin_required
def delete_building(id):
    db = SessionLocal()
    try:
        build = db.query(Building).get(id)
        if build:
            # 4. ลบไฟล์จริงออกด้วย (สำคัญมาก!)
            delete_old_image(build.image_file)
            db.delete(build)
            db.commit()
            flash("ลบข้อมูลและไฟล์ภาพเรียบร้อย!", "success")
    except Exception as e:
        db.rollback()
        flash("ไม่สามารถลบข้อมูลได้", "error")
    finally:
        db.close()
    return redirect(url_for("build_manager.dashboard"))
