from typing import List, Dict
from sqlalchemy import func, distinct
from ..extensions import db
from ..models import Analysis

class AnalysisRepository:
    @staticmethod
    def count_all() -> int:
        return Analysis.query.count()

    @staticmethod
    def count_by_risk(risk: str) -> int:
        return Analysis.query.filter_by(risk_level=risk).count()

    @staticmethod
    def usage_between(start_dt, end_dt) -> List[Dict]:
        # SQLite-friendly date grouping; adjust for Postgres if needed
        rows = (
            db.session.query(
                func.strftime('%Y-%m-%d', Analysis.timestamp).label('date'),
                func.count(Analysis.id).label('analyses'),
                func.count(distinct(Analysis.user_id)).label('users')
            )
            .filter(Analysis.timestamp >= start_dt, Analysis.timestamp < end_dt)
            .group_by('date')
            .order_by('date')
            .all()
        )
        return rows

    @staticmethod
    def list_recent(limit: int = 5):
        return Analysis.query.order_by(db.desc(Analysis.timestamp)).limit(limit).all()

    @staticmethod
    def create(entity: Analysis) -> Analysis:
        db.session.add(entity)
        db.session.commit()
        return entity

    @staticmethod
    def commit():
        db.session.commit()
