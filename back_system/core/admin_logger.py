from models import AdminActivity
from sqlalchemy.orm import Session

def log_admin_action(admin_id:int, action:str, target:str=None, details:str|dict=None, db:Session = None):
    if not db:
        return None
    
    new_admin_activity = AdminActivity(
        admin_id=admin_id,
        action=action,
        target=target,
        details=details
    )

    db.add(new_admin_activity)
    db.commit()
    db.refresh(new_admin_activity)

    return new_admin_activity