from datetime import datetime, timedelta
from ..repositories.user_repository import UserRepository
from ..repositories.analysis_repository import AnalysisRepository

class AdminService:
    @staticmethod
    def get_stats():
        total_users = len([u for u in UserRepository.list_all() if u.role == 'user'])
        total_analyses = AnalysisRepository.count_all()
        risk_distribution = {
            'low': AnalysisRepository.count_by_risk('low'),
            'moderate': AnalysisRepository.count_by_risk('moderate'),
            'high': AnalysisRepository.count_by_risk('high'),
        }

        today = datetime.utcnow().date()
        start_date = today - timedelta(days=7)
        start_dt = datetime.combine(start_date, datetime.min.time())
        end_dt = datetime.combine(today + timedelta(days=1), datetime.min.time())
        rows = AnalysisRepository.usage_between(start_dt, end_dt)

        by_date = {r.date: {'analyses': r.analyses, 'users': r.users} for r in rows}
        d = start_date
        daily_usage = []
        while d <= today:
            ds = d.strftime('%Y-%m-%d')
            daily_usage.append({'date': ds, **by_date.get(ds, {'analyses': 0, 'users': 0})})
            d += timedelta(days=1)

        return {
            'totalUsers': total_users,
            'totalAnalyses': total_analyses,
            'riskDistribution': risk_distribution,
            'dailyUsage': daily_usage
        }
