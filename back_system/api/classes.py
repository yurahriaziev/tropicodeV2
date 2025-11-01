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
from core.logger import logger

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

def get_tropicode_calendar(creds):
    service = build('calendar', 'v3', credentials=creds)

    calendar_list = service.calendarList().list().execute()
    calendars = calendar_list.get('items', [])
    log(f'retrived user calendar list, {calendars}', 'log')

    for cal in calendars:
        if cal.get('summary') == 'Tropicode':
            log('found Tropicode calendar', 'log')
            return cal['id']
        
    calendar_body = {
        'summary':'Tropicode',
        'timeZone':'America/New_York'
    }
    try:
        new_calendar = service.calendars().insert(body=calendar_body).execute()
        service.calendarList().insert(body={'id':new_calendar['id']}).execute()
        log('added new Tropicode calendar to user', 'log')
        return new_calendar['id']
    except Exception as e:
        log(f'error adding new Tropicode calendar {e}', 'error')
        raise HTTPException(status_code=500, detail='Failed to create Tropicode calendar')

@router.post("/classes", response_model=GoogleClassOut)
def make_class(new_class: ClassCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role not in (UserRole.ADMIN, UserRole.TUTOR):
        logger.warning(f"[CLASS] Unauthorized access attempt by user_id={user.id} ({user.role})")
        raise HTTPException(status_code=403, detail='Unauthorized')
    
    if not user.tutor_gmail or not user.token:
        logger.warning(f"[CLASS] user_id={user.id} attempted to create class without connected Google account")
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
            created_class = service.events().insert(calendarId=get_tropicode_calendar(creds), body=google_class, conferenceDataVersion=1).execute()
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

            logger.info(f"[{user.role}] user_id={user.id} | route=/classes | action=Created class '{new_class.title}' with student_id={new_class.student_id}")
            return {'id': new_class_db.id, 'title':new_class.title, 'start_time':start, 'end_time':end, 'google_meet_link':meet_link}
        except Exception as e:
            logger.error(f"[CLASS] Google API event creation failed for user_id={user.id}: {e}")
            raise HTTPException(status_code=500, detail="Internal server error")
    except Exception as e:
        logger.error(f"[CLASS] Token decryption failed for user_id={user.id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
    
@router.get("/classes", response_model=List[GoogleClassOut])
def get_classes(user:User=Depends(get_current_user), db:Session = Depends(get_db)):
    if user.role not in [UserRole.ADMIN, UserRole.TUTOR, UserRole.STUDENT]:
        logger.warning(f"[CLASS] Unauthorized access attempt by user_id={user.id} ({user.role})")
        raise HTTPException(status_code=403, detail='Unauthorized')
    
    if user.role == UserRole.TUTOR:
        classes = db.query(GoogleClass).filter(GoogleClass.tutor_id == user.id).all()
    elif user.role == UserRole.STUDENT:
        classes = db.query(GoogleClass).filter(GoogleClass.student_id == user.id).all()
    return classes

@router.delete("/classes/{class_id}", response_model=List[GoogleClassOut])
def delete_class(class_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role not in [UserRole.TUTOR]:
        logger.warning(f"[CLASS] Unauthorized access attempt by user_id={user.id} ({user.role})")
        raise HTTPException(status_code=403, detail='Unauthorized')
    
    class_to_delete = db.query(GoogleClass).filter(GoogleClass.id == class_id, GoogleClass.tutor_id == user.id).first()

    if not class_to_delete:
        logger.warning(f"[CLASS] Class with id={class_id} not found to delete")
        raise HTTPException(status_code=404, detail='Class not found')
    
    db.delete(class_to_delete)
    db.commit()
    logger.info(f"[CLASS] Class with id={class_id} successfully deleted by tutor with id={user.id}")

    updated_classes = db.query(GoogleClass).filter(GoogleClass.tutor_id == user.id).all()
    return updated_classes