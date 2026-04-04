from flask import render_template, redirect, url_for, session, Blueprint

bp = Blueprint("about", __name__, url_prefix="/about")


@bp.route("/")
def about():
    role = session.get("role", "guest")
    return render_template("about.html", role=role)
