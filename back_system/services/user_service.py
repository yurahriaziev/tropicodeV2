from core.normalization import normalize_email, normalize_phone
from schemas import ContactCreate
from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.contact import Contact
from core.logger import logger

def create_contact_service(db: Session, contact: ContactCreate):
    print(contact)
    normalized_email = normalize_email(contact.email)
    normalized_phone = normalize_phone(contact.phone)

    if db.query(Contact).filter(Contact.email == normalized_email).first():
        raise HTTPException(status_code=409, detail='Email already in use')
    
    if db.query(Contact).filter(Contact.phone == normalized_phone).first():
        raise HTTPException(status_code=409, detail='Phone already in use')
    
    db_contact = Contact(
        first = contact.first.strip(),
        last = contact.last.strip(),
        email = normalized_email,
        phone = normalized_phone
    )

    print(db_contact)

    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)

    logger.info(f"[USER_CONTACT] New contact added '{db_contact.first} {db_contact.last}'")
    return db_contact