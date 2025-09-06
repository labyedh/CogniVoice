from flask import jsonify
from ..repositories.partner_repository import PartnerRepository

def list_public_partners():
    try:
        partners = PartnerRepository.list_active()
        return jsonify([{
            'id': str(p.id), 'name': p.name, 'type': p.type, 'description': p.description,
            'logo': p.logo, 'website': p.website
        } for p in partners])
    except Exception as e:
        print(f"Error fetching public partners: {e}")
        return jsonify({"message": "Could not retrieve partners at this time."}), 500
