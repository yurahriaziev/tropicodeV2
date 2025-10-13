# from core.encryption import decrypt_token
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
# from google.auth.exceptions import RefreshError
from googleapiclient.discovery import build
from datetime import timedelta, datetime
from sqlalchemy.orm import Session
from db.session import SessionLocal
from .auth import get_current_user

from models import User
from schemas import ClassCreate, GoogleClassOut, UserRole
from models import GoogleClass
import uuid

import os
from dotenv import load_dotenv
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from core import encryption

load_dotenv()

router = APIRouter()

def log(message: str, level: str = "info"):
    """
    Print colored messages to terminal based on level.
    Levels: 'error', 'success', 'log', or default (white)
    """

    COLORS = {
        "error": "\033[91m",    
        "success": "\033[92m",  
        "log": "\033[93m",      
        "info": "\033[97m",     
    }
    RESET = "\033[0m"

    color = COLORS.get(level.lower(), COLORS["info"])
    print(f"{color}{message}{RESET}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/classes", response_model=GoogleClassOut)
def make_class(new_class: ClassCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role not in (UserRole.ADMIN, UserRole.TUTOR):
        raise HTTPException(status_code=403, detail='Unauthorized')
    
    if not user.tutor_gmail or not user.token:
        raise HTTPException(status_code=401, detail="Please connect Google Account")
    
    try:
        refresh_token = encryption.decrypt_token(user.token)
        creds = Credentials(
            token=None,
            refresh_token=refresh_token,
            client_id=os.getenv('CLIENT_ID'),
            client_secret=os.getenv('CLIENT_SECRET'),
            token_uri=os.getenv('TOKEN_URI'),
        )
        log('past creds var creation', 'log')

        creds.refresh(Request())

        log('past creds refresh', 'log')

        start_time_obj = datetime.fromisoformat(new_class.start_time)
        end_time_obj = start_time_obj + timedelta(hours=1)

        start_iso = start_time_obj.isoformat()
        end_iso = end_time_obj.isoformat()

        google_class = {
            'summary': new_class.title,
            'start': {'dateTime': start_iso, 'timeZone':'America/New_York'},
            'end': {'dateTime': end_iso, 'timeZone':'America/New_York'},
            'attendees': [{'email':user.tutor_gmail}],
            'conferenceData': {
                'createRequest': {
                    'requestId':str(uuid.uuid4()),
                    'conferenceSolutionKey': {'type': 'hangoutsMeet'}
                }
            }
        }
        log('google_class dict made', 'log')

        try:
            service = build(serviceName='calendar', version='v3', credentials=creds, cache_discovery=False)
            created_class = service.events().insert(calendarId='primary', body=google_class, conferenceDataVersion=1).execute()
            log('created_class made with google api', 'log')

            start = created_class['start']['dateTime']
            end = created_class['end']['dateTime']
            meet_link = created_class['hangoutLink']

            new_class_db = GoogleClass(
                title=new_class.title,
                start_time=datetime.fromisoformat(start),
                end_time=datetime.fromisoformat(end),
                tutor_id=user.id,
                student_id=new_class.student_id,
                google_meet_link=meet_link,
                google_event_id=created_class['id']
            )
            db.add(new_class_db)
            db.commit()
            db.refresh(new_class_db)

            return {'id': new_class_db.id, 'title':new_class.title, 'start_time':start, 'end_time':end, 'google_meet_link':meet_link}
        except Exception as e:
            log(f'Error creating class, {e}', 'error')
            raise HTTPException(status_code=500, detail="Internal server error")
    except Exception as e:
        log(f"Token decryption failed: {e}", 'error')
        raise HTTPException(status_code=500, detail="Internal server error")
    
@router.get("/classes", response_model=List[GoogleClassOut])
def get_classes(user:User=Depends(get_current_user), db:Session = Depends(get_db)):
    if user.role not in [UserRole.ADMIN, UserRole.TUTOR, UserRole.STUDENT]:
        raise HTTPException(status_code=403, detail='Unauthorized')
    
    if user.role == UserRole.TUTOR:
        classes = db.query(GoogleClass).filter(GoogleClass.tutor_id == user.id).all()
    elif user.role == UserRole.STUDENT:
        classes = db.query(GoogleClass).filter(GoogleClass.student_id == user.id).all()
    return classes
    