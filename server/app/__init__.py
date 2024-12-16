from flask import Flask
# from models import User
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    db.init_app(app)

    from routes import home_bp, user_bp
    app.register_blueprint(home_bp, url_prefix='/')
    app.register_blueprint(user_bp, url_prefix='/add')


   

    with app.app_context():
        db.create_all()
    return app