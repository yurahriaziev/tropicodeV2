from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from db.session import SessionLocal
from models.user import User
from core.security import verify_pass
from schemas import Token

from datetime import timedelta, datetime, timezone
from jose import jwt

from dotenv import load_dotenv
import os

load_dotenv()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter()

@router.post("/auth/token", response_model=Token, tags=['Auth'])
def get_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db:Session = Depends(get_db)):
    email = form_data.username
    password = form_data.password

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail='Incorrent Email or Password')
    
    verify = verify_pass(password, user.hashed_password)
    if not verify:
        raise HTTPException(status_code=401, detail='Incorrent Email or Password')
    
    payload = {
        'sub':user.email,
        'exp':None
    }

    expiration = datetime.now(timezone.utc) + timedelta(minutes=60)
    payload['exp'] = expiration

    acc_t = jwt.encode(payload, os.getenv('SECURITY_SECRET_KEY'), os.getenv('ALGORITHM'))

    return {'access_token':acc_t, 'token_type':'bearer'}