from datetime import datetime
from ..extensions import db

class Analysis(db.Model):
    __tablename__ = "analysis"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    risk_level = db.Column(db.String(20), nullable=False)
    final_prediction = db.Column(db.String(50))
    confidence = db.Column(db.Float)
    file_name = db.Column(db.String(255))
    pause_frequency = db.Column(db.Float)
    speech_rate = db.Column(db.Float)
    vocabulary_complexity = db.Column(db.Float)
    semantic_fluency = db.Column(db.Float)
