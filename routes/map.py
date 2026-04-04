from flask import Blueprint, render_template

bp = Blueprint("map", __name__, template_folder="../templates")


@bp.route("/")
def school_map():
    return render_template("schoolmap.html")
