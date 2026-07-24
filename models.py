from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    telegram_id = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(150))
    last_name = db.Column(db.String(150))
    username = db.Column(db.String(150))
    usdt_balance = db.Column(db.Float, default=0.0)
    referral_count = db.Column(db.Integer, default=0)

from app import app
from models import db

with app.app_context():
    db.create_all()