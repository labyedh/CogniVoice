from flask import Blueprint, jsonify
from app.models import Partner

public_bp = Blueprint('public', __name__)

@public_bp.route('/partners', methods=['GET'])
def get_public_partners():
    """
    Provides a public list of all ACTIVE partners.
    No authentication is required for this endpoint.
    """
    try:
        # Query the database for all partners that are marked as active
        active_partners = Partner.query.filter_by(is_active=True).order_by(Partner.name).all()
        
        # Format the data into a JSON array
        partners_data = [{
            'id': str(p.id),
            'name': p.name,
            'type': p.type,
            'description': p.description,
            'logo': p.logo,
            # Note: We don't send sensitive data like contactEmail to the public
            'website': p.website 
        } for p in active_partners]
        
        return jsonify(partners_data)
        
    except Exception as e:
        print(f"Error fetching public partners: {e}")
        return jsonify({"message": "Could not retrieve partners at this time."}), 500