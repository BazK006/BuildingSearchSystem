from flask import Blueprint, render_template, session

bp = Blueprint("home", __name__)


@bp.route("/")
def index():
    role = session.get("role") or "guest"

    return render_template("index.html", role=role)
