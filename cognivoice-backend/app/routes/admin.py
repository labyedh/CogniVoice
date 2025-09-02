from flask import Blueprint, jsonify, request, g , Response
from ..utils.decorators import admin_required
from ..models import User, Partner, Analysis
from ..extensions import db
from sqlalchemy import func, distinct
from datetime import datetime, timedelta
import csv
import io
# All routes in this file will use this single blueprint
admin_bp = Blueprint('admin', __name__)

# --- THIS IS THE MISSING ROUTE ---
@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_stats():
    try:
        total_users = User.query.filter_by(role='user').count()
        total_analyses = Analysis.query.count()
        
        risk_distribution = {
            'low': Analysis.query.filter_by(risk_level='low').count(),
            'moderate': Analysis.query.filter_by(risk_level='moderate').count(),
            'high': Analysis.query.filter_by(risk_level='high').count()
        }

        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        usage_query = db.session.query(
            func.strftime('%Y-%m-%d', Analysis.timestamp).label('date'),
            func.count(Analysis.id).label('analyses'),
            func.count(distinct(Analysis.user_id)).label('users')
        ).filter(
            Analysis.timestamp >= thirty_days_ago
        ).group_by('date').order_by('date').all()

        # --- THIS IS THE FIX ---
        # `row.date` is already a string like "2025-08-29", so we just use it directly.
        daily_usage = [{'date': row.date, 'analyses': row.analyses, 'users': row.users} for row in usage_query]
        # --- END OF FIX ---

        return jsonify({
            'totalUsers': total_users,
            'totalAnalyses': total_analyses,
            'riskDistribution': risk_distribution,
            'dailyUsage': daily_usage
        })
    except Exception as e:
        print(f"Error in /admin/stats: {e}")
        return jsonify({"message": f"An internal error occurred: {e}"}), 500

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    users = User.query.all()
    users_data = []
    for user in users:
        latest_analysis = user.analyses.order_by(db.desc('timestamp')).first()
        users_data.append({
            'id': str(user.id), 'email': user.email, 'firstName': user.first_name, 'lastName': user.last_name, 'role': user.role,
            'createdAt': user.created_at.isoformat() + "Z", 'lastLogin': user.last_login.isoformat() + "Z" if user.last_login else None,
            'analysisCount': user.analyses.count(), 'riskLevel': latest_analysis.risk_level if latest_analysis else None,
            'isActive': user.is_active
        })
    return jsonify(users_data)

@admin_bp.route('/users', methods=['POST'])
@admin_required
def create_user():
    data = request.get_json()
    if not data or not all(k in data for k in ['email', 'firstName', 'lastName']):
        return jsonify({'message': 'Missing required fields'}), 400
    if data.get('role') == 'admin':
        return jsonify({'message': 'Cannot create another admin user'}), 403
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User with this email already exists'}), 409
    
    new_user = User(email=data['email'], first_name=data['firstName'], last_name=data['lastName'], role='user', is_active=data.get('isActive', True))
    new_user.set_password('DefaultPassword123!')
    db.session.add(new_user); db.session.commit()
    return jsonify({'message': 'User created'}), 201

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    # Find the user by their ID or return a 404 error if not found.
    user = User.query.get_or_404(user_id)
    
    # Security check: Prevent the admin from editing their own details on this page.
    if user.id == g.current_user.id:
        return jsonify({'message': "Admin should use the main profile page to edit their own details."}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided for update.'}), 400

    try:
       
        user.first_name = data.get('firstName', user.first_name)
        user.last_name = data.get('lastName', user.last_name)
        user.email = data.get('email', user.email)
        user.role = data.get('role', user.role)
        user.is_active = data.get('isActive', user.is_active)


        if 'email' in data:
            existing_user = User.query.filter(User.email == user.email, User.id != user_id).first()
            if existing_user:
                return jsonify({'message': 'This email address is already in use by another account.'}), 409

        # No need to call db.session.add(user), as the object is already tracked by the session.
        db.session.commit()
        
        return jsonify({'message': 'User updated successfully'})

    except Exception as e:
        # If anything goes wrong, roll back the transaction to prevent partial saves.
        db.session.rollback()
        print(f"Error updating user {user_id}: {e}")
        return jsonify({'message': f'An internal error occurred: {e}'}), 500


@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    if user_id == g.current_user.id:
        return jsonify({'message': 'Admin cannot delete their own account.'}), 403
    user = User.query.get_or_404(user_id)
    db.session.delete(user); db.session.commit()
    return jsonify({'message': 'User deleted'})

@admin_bp.route('/partners', methods=['GET'])
@admin_required
def get_partners():
    return jsonify([{'id': str(p.id), 'name': p.name, 'type': p.type, 'description': p.description, 'logo': p.logo,
                     'website': p.website, 'contactEmail': p.contact_email, 'isActive': p.is_active,
                     'createdAt': p.created_at.isoformat() + "Z"} for p in Partner.query.all()])

@admin_bp.route('/partners', methods=['POST'])
@admin_required
def create_partner():
    data = request.get_json()
    
    # Basic validation
    required_fields = ['name', 'type', 'description', 'logo']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields: name, type, description, logo'}), 400

    # Prevent duplicate partner names
    if Partner.query.filter_by(name=data['name']).first():
        return jsonify({'message': f"A partner with the name '{data['name']}' already exists."}), 409

    # --- THIS IS THE FIX ---
    # Manually create the Partner object, only using fields that exist in the model.
    # Use .get() for optional fields to avoid errors if they are not sent.
    new_partner = Partner(
        name=data['name'],
        type=data['type'],
        description=data['description'],
        logo=data['logo'],
        website=data.get('website'),
        contact_email=data.get('contactEmail'),
        is_active=data.get('isActive', True)
    )
    # --- END OF FIX ---

    db.session.add(new_partner)
    db.session.commit()
    
    return jsonify({'message': 'Partner created successfully'}), 201

@admin_bp.route('/partners/<int:partner_id>', methods=['PUT'])
@admin_required
def update_partner(partner_id):
    partner = Partner.query.get_or_404(partner_id)
    data = request.get_json()
    for key, value in data.items():
        if hasattr(partner, key): setattr(partner, key, value)
    db.session.commit()
    return jsonify({'message': 'Partner updated'})

@admin_bp.route('/partners/<int:partner_id>', methods=['DELETE'])
@admin_required
def delete_partner(partner_id):
    partner = Partner.query.get_or_404(partner_id)
    db.session.delete(partner); db.session.commit()
    return jsonify({'message': 'Partner deleted'})


@admin_bp.route('/users/export', methods=['GET'])
@admin_required
def export_users():
    """
    Fetches all user data and returns it as a CSV file for download.
    """
    try:
        # 1. Fetch all users from the database
        all_users = User.query.order_by(User.id).all()

        # 2. Use Python's 'io' and 'csv' modules to build a CSV file in memory
        # 'io.StringIO' creates a text buffer that works like a file.
        string_io = io.StringIO()
        
        # Define the header row for our CSV file
        headers = [
            'id', 'email', 'firstName', 'lastName', 'role', 
            'createdAt', 'lastLogin', 'isActive', 'analysisCount', 'riskLevel'
        ]
        
        # Create a CSV writer that writes to our in-memory buffer
        writer = csv.DictWriter(string_io, fieldnames=headers)
        writer.writeheader() # Write the header row

        # 3. Loop through users and write each one as a row in the CSV
        for user in all_users:
            latest_analysis = user.analyses.order_by(db.desc('timestamp')).first()
            writer.writerow({
                'id': user.id,
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'role': user.role,
                'createdAt': user.created_at.isoformat() if user.created_at else '',
                'lastLogin': user.last_login.isoformat() if user.last_login else '',
                'isActive': user.is_active,
                'analysisCount': user.analyses.count(),
                'riskLevel': latest_analysis.risk_level if latest_analysis else 'N/A'
            })

        # 4. Prepare the HTTP response
        mem = io.BytesIO()
        mem.write(string_io.getvalue().encode('utf-8'))
        mem.seek(0) # Move the "cursor" back to the start of the buffer
        string_io.close()

        # Create a Flask Response object
        return Response(
            mem,
            mimetype='text/csv',
            headers={
                # This header tells the browser to treat the response as a file download
                "Content-Disposition": "attachment;filename=users_export.csv"
            }
        )
    except Exception as e:
        print(f"Error exporting users: {e}")
        return jsonify({"message": "Failed to export users."}), 500
@admin_bp.route('/activity/recent', methods=['GET'])
@admin_required
def get_recent_activity():
    """
    Fetches the 5 most recent activities (user registrations and analyses).
    """
    try:
        # Get the 5 most recent user registrations
        recent_users = User.query.filter_by(role='user').order_by(db.desc(User.created_at)).limit(5).all()
        
        # Get the 5 most recent analyses
        recent_analyses = Analysis.query.order_by(db.desc(Analysis.timestamp)).limit(5).all()
        
        # Format the activities into a common structure
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
            # The 'author' backref lets us get the user's name from the analysis
            user = analysis.author
            activity_feed.append({
                'type': 'analysis',
                'id': f'analysis-{analysis.id}',
                'user_name': f'{user.first_name} {user.last_name}',
                'timestamp': analysis.timestamp.isoformat(),
                'details': 'completed an analysis',
                'risk_level': analysis.risk_level
            })
        
        # Sort the combined feed by timestamp to get the true most recent activities
        activity_feed.sort(key=lambda x: x['timestamp'], reverse=True)
        
        # Return the top 5 overall activities
        return jsonify(activity_feed[:5])

    except Exception as e:
        print(f"Error fetching recent activity: {e}")
        return jsonify({"message": "Could not retrieve recent activity."}), 500