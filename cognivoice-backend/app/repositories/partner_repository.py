from typing import Optional, List
from ..extensions import db
from ..models import Partner

class PartnerRepository:
    @staticmethod
    def list_all() -> List[Partner]:
        return Partner.query.all()

    @staticmethod
    def list_active() -> List[Partner]:
        return Partner.query.filter_by(is_active=True).order_by(Partner.name).all()

    @staticmethod
    def get_by_id(pid: int) -> Optional[Partner]:
        return Partner.query.get(pid)

    @staticmethod
    def get_by_name(name: str) -> Optional[Partner]:
        return Partner.query.filter_by(name=name).first()

    @staticmethod
    def create(p: Partner) -> Partner:
        db.session.add(p)
        db.session.commit()
        return p

    @staticmethod
    def update():
        db.session.commit()

    @staticmethod
    def delete(p: Partner):
        db.session.delete(p)
        db.session.commit()
