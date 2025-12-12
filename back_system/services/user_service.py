from core.normalization import normalize_email, normalize_phone
from schemas import ContactCreate
from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.contact import Contact

def create_contact(db: Session, contact: ContactCreate):
    normalized_email = normalize_email(contact.email)
    normalized_phone = normalize_email(contact.phone)

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

    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)

    return db_contact