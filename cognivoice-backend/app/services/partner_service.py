from ..repositories.partner_repository import PartnerRepository
from ..models import Partner

class PartnerService:
    @staticmethod
    def create_partner(data: dict):
        required = ['name', 'type', 'description', 'logo']
        if not all(k in data for k in required):
            return None, ('Missing required fields: name, type, description, logo', 400)
        if PartnerRepository.get_by_name(data['name']):
            return None, (f"A partner with the name '{data['name']}' already exists.", 409)

        p = Partner(
            name=data['name'],
            type=data['type'],
            description=data['description'],
            logo=data['logo'],
            website=data.get('website'),
            contact_email=data.get('contactEmail'),
            is_active=data.get('isActive', True),
        )
        PartnerRepository.create(p)
        return p, None
