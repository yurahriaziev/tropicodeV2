from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session

from db.session import SessionLocal
from models.user import User, UserRole
from core.security import verify_pass
from schemas import Token, StudentLogin, Optional
from db.redis_client import redis_client

from datetime import timedelta, datetime, timezone
from jose import jwt, JWTError
import os
from dotenv import load_dotenv
load_dotenv()

from core import config, encryption
from core.logger import logger
import secrets

from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

SCOPES = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/calendar'
]

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(prefix='/auth')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/token')
frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')

def get_current_user(token:str = Depends(oauth2_scheme), db:Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, config.SECURITY_SECRET_KEY, config.ALGORITHM)
        id:str = payload.get('sub')

        if id is None:
            raise HTTPException(status_code=401, detail='Invalid Credentials')
        
    except JWTError as je:
        raise HTTPException(status_code=401, detail='Invalid Credentials')
    
    user = db.query(User).filter(User.id == payload.get('sub')).first()
    if user is None:
        raise HTTPException(status_code=401, detail='Invalid Credentials')
            
    return user

def get_admin_user(user: User = Depends(get_current_user)):
    if user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail='Access denied.')

@router.post("/token", response_model=Token, tags=['Auth'])
def get_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db:Session = Depends(get_db)):
    email = form_data.username
    password = form_data.password

    user = db.query(User).filter(User.email == email).first()

    if not user:
        logger.warning(f"[LOGIN] Invalid email login attempt: {email}")
        raise HTTPException(status_code=401, detail='Incorrent Email or Password')
    
    verify = verify_pass(password, user.hashed_password)
    if not verify:
        logger.warning(f"[LOGIN] Incorrect password for user_id={user.id}")
        raise HTTPException(status_code=401, detail='Incorrent Email or Password')
    
    payload = {
        'sub':str(user.id),
        'exp':None
    }

    expiration = datetime.now(timezone.utc) + timedelta(minutes=60)
    payload['exp'] = expiration

    acc_t = jwt.encode(payload, config.SECURITY_SECRET_KEY, config.ALGORITHM)

    logger.info(f"[{user.role}] user_id={user.id} | route=/token | action=Successful login")
    return {'access_token':acc_t, 'token_type':'bearer'}

@router.post('/student/login', response_model=Token)
def student_login(s: StudentLogin, db:Session = Depends(get_db)):
    student = db.query(User).filter(User.login_code == s.code).first()

    if not student or student.role != UserRole.STUDENT:
        logger.warning(f'[LOGIN] Invalid student code used: {s.code}')
        raise HTTPException(status_code=401, detail='Invalid Code')

    payload = {
        'sub':str(student.id),
        'exp':None
    }

    expiration = datetime.now(timezone.utc) + timedelta(minutes=60)
    payload['exp'] = expiration
    acc_token = jwt.encode(payload, config.SECURITY_SECRET_KEY, config.ALGORITHM)

    logger.info(f'[STUDENT] user_id={student.id} logged in')
    return {'access_token':acc_token, 'token_type':'bearer'}

@router.get('/google/login')
def google_login(user: User = Depends(get_current_user)):
    if not user or user.role not in [UserRole.ADMIN, UserRole.TUTOR]:
        logger.warning(f"[OAUTH] Unauthorized access attempt by user_id={user.id if user else 'unknown'}")
        raise HTTPException(status_code=401, detail='Not authorized')
    
    state = secrets.token_urlsafe(16)
    redis_client.setex(state, 300, str(user.id))

    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": os.getenv("CLIENT_ID"),
                "client_secret": os.getenv("CLIENT_SECRET"),
                "redirect_uris": [os.getenv("GOOGLE_REDIRECT_URI")],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=SCOPES,
        state=state
    )
    flow.redirect_uri = os.getenv('GOOGLE_REDIRECT_URI')

    auth_url, _ = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent'
    )

    logger.info(f"[{user.role}] user_id={user.id}")
    return {'url':auth_url}

@router.get('/google/callback')
def google_callback(state: str, code: Optional[str] = None, error: Optional[str] = None, db: Session = Depends(get_db)):
    if error:
        logger.warning(f"[OAUTH] Google callback returned error param for state={state}")
        return RedirectResponse(url=f'{frontend_url}/tropitutor')
    
    user_id = redis_client.get(state)

    if not user_id:
        logger.warning(f"[OAUTH] Missing or expired state token: {state}")
        raise HTTPException(status_code=401, detail='Not authorized')
    
    redis_client.delete(state)

    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": os.getenv("CLIENT_ID"),
                "client_secret": os.getenv("CLIENT_SECRET"),
                "redirect_uris": [os.getenv("GOOGLE_REDIRECT_URI")],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=SCOPES,
        state=state
    )
    flow.redirect_uri = os.getenv('GOOGLE_REDIRECT_URI')

    try:
        flow.fetch_token(code=code)
    except Exception as e:
        logger.error(f"[OAUTH] Token exchange failed for state={state}: {e}")
        return RedirectResponse(url=f'{frontend_url}/tropitutor?status=error')
    
    creds = flow.credentials
    refresh_token = creds.refresh_token
    access_token = creds.token
    id_token = creds.id_token 

    service = build(serviceName='oauth2', version='v2', credentials=creds)
    user_info_req = service.userinfo().get()
    user_info = user_info_req.execute()
    tutor_gmail = user_info.get('email', None)
    if not tutor_gmail:
        logger.error(f"[OAUTH] Could not fetch Gmail from Google response for user_id={user_id}")
        return RedirectResponse(url=f'{frontend_url}/tropitutor?status=error')
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user or user.role not in [UserRole.TUTOR, UserRole.ADMIN]:
        logger.warning(f"[OAUTH] Unauthorized user_id={user_id} or invalid role during callback")
        raise HTTPException(status_code=401, detail='Not authorized')
    
    user.tutor_gmail = tutor_gmail

    if refresh_token:
        user.token = encryption.encrypt_token(refresh_token)
    db.commit()

    logger.info(f"[{user.role}] user_id={user.id} Google account linked ({tutor_gmail})")
    return RedirectResponse(url=f"{frontend_url}/tropitutor?status=success")
