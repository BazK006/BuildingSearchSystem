from flask import Flask
from config import settings
from database import engine, Base
from routes import (
    auth,
    home,
    map as map_module,
    build_search,
    build_all,
    about,
    admin_manager,
)
from routes.building_manager import bp as build_manager_bp
from routes.auth import limiter
from routes.stats import admin_stats_bp
from models.user import Base
from models.teachers import Teacher
from models.staffs import Staff
from models.admin import Admin
from models.building import Building
from models.category import Category

app = Flask(__name__)
app.secret_key = settings.secret_key

limiter.init_app(app)


@app.context_processor
def inject_api_keys():
    return dict(weather_api_key=settings.weather_api_url)


Base.metadata.create_all(bind=engine)

app.register_blueprint(auth.bp)
app.register_blueprint(home.bp)
app.register_blueprint(admin_manager.bp)
app.register_blueprint(build_manager_bp)
app.register_blueprint(about.bp)
app.register_blueprint(admin_stats_bp)
app.register_blueprint(map_module.bp, url_prefix="/map")
app.register_blueprint(build_search.bp, url_prefix="/search")
app.register_blueprint(build_all.bp, url_prefix="/all")

if __name__ == "__main__":
    app.run(debug=True, port=settings.flask_port, host="0.0.0.0")
