from typing import Optional, List
from sqlalchemy import desc
from ..extensions import db
from ..models import User

class UserRepository:
    @staticmethod
    def get_by_email(email: str) -> Optional[User]:
        return User.query.filter_by(email=email).first()

    @staticmethod
    def get_by_id(user_id: int) -> Optional[User]:
        return User.query.get(user_id)

    @staticmethod
    def create(user: User) -> User:
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def update():
        db.session.commit()

    @staticmethod
    def delete(user: User):
        db.session.delete(user)
        db.session.commit()

    @staticmethod
    def list_all() -> List[User]:
        return User.query.all()

    @staticmethod
    def list_users_ordered_by_created(limit: int = 5) -> List[User]:
        return User.query.filter_by(role='user').order_by(desc(User.created_at)).limit(limit).all()
