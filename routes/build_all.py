from flask import Blueprint, render_template

bp = Blueprint("build_all", __name__, template_folder="../templates")


@bp.route("/")
def all_buildings():
    return render_template("buildall.html")
