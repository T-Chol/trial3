from flask import Flask
# from app.config import DevelopmentConfig
# from models import User
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    # app.config.from_object(DevelopmentConfig)
    db.init_app(app)

    from routes import home_bp, user_bp, task_bp 
    app.register_blueprint(home_bp, url_prefix='/')
    app.register_blueprint(user_bp, url_prefix='/add')
    app.register_blueprint(task_bp, url_prefix='/task')


   

    with app.app_context():
        db.create_all()
    return app