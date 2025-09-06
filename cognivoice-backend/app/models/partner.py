from datetime import datetime
from ..extensions import db

class Partner(db.Model):
    __tablename__ = "partner"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    type = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    logo = db.Column(db.String(255))
    website = db.Column(db.String(255))
    contact_email = db.Column(db.String(120))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
