import jwt
from datetime import datetime, timedelta, timezone
from flask import current_app
from ..models import User
from ..repositories.user_repository import UserRepository

class AuthService:
    @staticmethod
    def generate_token_and_payload(user: User) -> dict:
        token = jwt.encode(
            {'user_id': user.id, 'exp': datetime.now(timezone.utc) + timedelta(hours=24)},
            current_app.config['SECRET_KEY'],
            "HS256"
        )
        return {'token': token, 'user': {
            'id': str(user.id),
            'email': user.email,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'role': user.role,
            'createdAt': user.created_at.isoformat() + "Z",
            'avatarUrl': user.avatar_url
        }}

    @staticmethod
    def register_user(email, password, first_name, last_name, reserved_admin_email):
        if email == reserved_admin_email:
            return None, ('This email address is reserved.', 403)
        if UserRepository.get_by_email(email):
            return None, ('User with this email already exists', 409)
        u = User(email=email, first_name=first_name, last_name=last_name, is_active=True)
        u.set_password(password)
        UserRepository.create(u)
        return u, None

    @staticmethod
    def login(email, password):
        user = UserRepository.get_by_email(email)
        if not user or not user.check_password(password):
            return None, ('Invalid credentials', 401)
        if not user.is_active:
            return None, ('Account is inactive', 403)
        user.last_login = datetime.utcnow()
        UserRepository.update()
        return user, None
