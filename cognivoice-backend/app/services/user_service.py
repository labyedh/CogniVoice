from sqlalchemy import desc
from ..repositories.user_repository import UserRepository
from ..models import User

class UserService:
    @staticmethod
    def list_users_full():
        users = UserRepository.list_all()
        # enrichments (latest_analysis, counts) are computed in controller to avoid tight coupling
        return users
