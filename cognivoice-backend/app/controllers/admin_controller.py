from flask import jsonify, request, g ,Response
import io , csv
from ..services.admin_service import AdminService
from ..repositories.user_repository import UserRepository
from ..repositories.partner_repository import PartnerRepository
from ..repositories.analysis_repository import AnalysisRepository
from ..models import User, Partner ,Analysis
from ..extensions import db

def stats():
    try:
        return jsonify(AdminService.get_stats())
    except Exception as e:
        print(f"Error in /admin/stats: {e}")
        return jsonify({"message": f"An internal error occurred: {e}"}), 500

def list_users():
    users = UserRepository.list_all()
    data = []
    for u in users:
        latest = u.analyses.order_by(db.desc('timestamp')).first()
        data.append({
            'id': str(u.id),
            'email': u.email,
            'firstName': u.first_name,
            'lastName': u.last_name,
            'role': u.role,
            'createdAt': u.created_at.isoformat() + "Z",
            'lastLogin': u.last_login.isoformat() + "Z" if u.last_login else None,
            'analysisCount': u.analyses.count(),
            'riskLevel': latest.risk_level if latest else None,
            'isActive': u.is_active
        })
    return jsonify(data)

def create_user():
    data = request.get_json() or {}
    if not all(k in data for k in ['email', 'firstName', 'lastName']):
        return jsonify({'message': 'Missing required fields'}), 400
    if data.get('role') == 'admin':
        return jsonify({'message': 'Cannot create another admin user'}), 403
    if UserRepository.get_by_email(data['email']):
        return jsonify({'message': 'User with this email already exists'}), 409
    u = User(email=data['email'], first_name=data['firstName'], last_name=data['lastName'], role='user', is_active=data.get('isActive', True))
    u.set_password('DefaultPassword123!')
    UserRepository.create(u)
    return jsonify({'message': 'User created'}), 201

def update_user(user_id: int):
    user = UserRepository.get_by_id(user_id)
    if not user:
        return jsonify({'message': 'Not found'}), 404
    if user.id == g.current_user.id:
        return jsonify({'message': "Admin should use the main profile page to edit their own details."}), 403

    data = request.get_json() or {}
    try:
        # email uniqueness
        if 'email' in data:
            existing = UserRepository.get_by_email(data['email'])
            if existing and existing.id != user_id:
                return jsonify({'message': 'This email address is already in use by another account.'}), 409

        user.first_name = data.get('firstName', user.first_name)
        user.last_name  = data.get('lastName',  user.last_name)
        user.email      = data.get('email',     user.email)
        user.role       = data.get('role',      user.role)
        user.is_active  = data.get('isActive',  user.is_active)
        UserRepository.update()
        return jsonify({'message': 'User updated successfully'})
    except Exception as e:
        from ..extensions import db
        db.session.rollback()
        print(f"Error updating user {user_id}: {e}")
        return jsonify({'message': f'An internal error occurred: {e}'}), 500

def delete_user(user_id: int):
    if user_id == g.current_user.id:
        return jsonify({'message': 'Admin cannot delete their own account.'}), 403
    user = UserRepository.get_by_id(user_id)
    if not user:
        return jsonify({'message': 'Not found'}), 404
    UserRepository.delete(user)
    return jsonify({'message': 'User deleted'})

def list_partners():
    ps = PartnerRepository.list_all()
    return jsonify([{
        'id': str(p.id), 'name': p.name, 'type': p.type, 'description': p.description,
        'logo': p.logo, 'website': p.website, 'contactEmail': p.contact_email,
        'isActive': p.is_active, 'createdAt': p.created_at.isoformat() + "Z"
    } for p in ps])

def create_partner():
    data = request.get_json() or {}
    p, err = __import__('app.services.partner_service', fromlist=['PartnerService']).PartnerService.create_partner(data)
    if err:
        msg, code = err if isinstance(err, tuple) else (err, 400)
        return jsonify({'message': msg}), code
    return jsonify({'message': 'Partner created successfully'}), 201

def update_partner(partner_id: int):
    p = PartnerRepository.get_by_id(partner_id)
    if not p:
        return jsonify({'message': 'Not found'}), 404
    data = request.get_json() or {}
    for k, v in data.items():
        if hasattr(p, k):
            setattr(p, k, v)
    PartnerRepository.update()
    return jsonify({'message': 'Partner updated'})

def delete_partner(partner_id: int):
    p = PartnerRepository.get_by_id(partner_id)
    if not p:
        return jsonify({'message': 'Not found'}), 404
    PartnerRepository.delete(p)
    return jsonify({'message': 'Partner deleted'})



def recent_activity():
    try:
        recent_users = User.query.filter_by(role='user').order_by(db.desc(User.created_at)).limit(5).all()
        recent_analyses = Analysis.query.order_by(db.desc(Analysis.timestamp)).limit(5).all()

        activity_feed = []
        for user in recent_users:
            activity_feed.append({
                'type': 'registration',
                'id': f'user-{user.id}',
                'user_name': f'{user.first_name} {user.last_name}',
                'timestamp': user.created_at.isoformat(),
                'details': 'registered a new account',
                'risk_level': None
            })

        for analysis in recent_analyses:
            user = analysis.author
            activity_feed.append({
                'type': 'analysis',
                'id': f'analysis-{analysis.id}',
                'user_name': f'{user.first_name} {user.last_name}',
                'timestamp': analysis.timestamp.isoformat(),
                'details': 'completed an analysis',
                'risk_level': analysis.risk_level
            })

        activity_feed.sort(key=lambda x: x['timestamp'], reverse=True)
        return jsonify(activity_feed[:5])

    except Exception as e:
        print(f"Error fetching recent activity: {e}")
        return jsonify({"message": "Could not retrieve recent activity."}), 500
def export_users_csv():
    try:
        users = User.query.order_by(User.id).all()

        string_io = io.StringIO()
        headers = [
            'id', 'email', 'firstName', 'lastName', 'role',
            'createdAt', 'lastLogin', 'isActive', 'analysisCount', 'riskLevel'
        ]
        writer = csv.DictWriter(string_io, fieldnames=headers)
        writer.writeheader()

        for u in users:
            latest = u.analyses.order_by(db.desc('timestamp')).first()
            writer.writerow({
                'id': u.id,
                'email': u.email,
                'firstName': u.first_name,
                'lastName': u.last_name,
                'role': u.role,
                'createdAt': u.created_at.isoformat() if u.created_at else '',
                'lastLogin': u.last_login.isoformat() if u.last_login else '',
                'isActive': u.is_active,
                'analysisCount': u.analyses.count(),
                'riskLevel': latest.risk_level if latest else 'N/A',
            })

        mem = io.BytesIO()
        mem.write(string_io.getvalue().encode('utf-8'))
        mem.seek(0)
        string_io.close()

        return Response(
            mem,
            mimetype='text/csv',
            headers={
                "Content-Disposition": "attachment; filename=users_export.csv",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except Exception as e:
        print(f"Error exporting users: {e}")
        return jsonify({"message": "Failed to export user data."}), 500