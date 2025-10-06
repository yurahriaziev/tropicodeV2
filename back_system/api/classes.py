# from core.encryption import decrypt_token
# from google.oauth2.credentials import Credentials
# from google.auth.transport.requests import Request
# from google.auth.exceptions import RefreshError
# from googleapiclient.discovery import build
# from datetime import timedelta, datetime
# from sqlalchemy.orm import Session
# from db.session import SessionLocal
# from .auth import get_current_user

# from models import User
# from schemas import ClassCreate, GoogleClassOut, UserRole
# from models import GoogleClass
# import uuid

# import os
# from dotenv import load_dotenv

# from fastapi import APIRouter, Depends, HTTPException

# load_dotenv()

# router = APIRouter()

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# @router.post("/classes", response_model=GoogleClassOut)
# def make_class(new_class: ClassCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
#     if user.role not in [UserRole.ADMIN, UserRole.TUTOR]:
#         raise HTTPException(status_code=403, detail='Unauthorized')
#     print('got here 1')
#     try:
#         google_event = create_google_meet(
#             tutor=user, 
#             title=new_class.title, 
#             start_time=new_class.start_time
#         )
#     except ValueError as e:
#         raise HTTPException(
#             status_code=401, 
#             detail="Google authentication has expired or been revoked. Please reconnect your Google account."
#         )
#     except Exception as e:
#         print('exception', e)
#         raise HTTPException(status_code=500, detail=f"An unexpected error occurred with the Google API: {str(e)}")
    
#     start_time_obj = datetime.fromisoformat(new_class.start_time)
#     end_time_obj = start_time_obj + timedelta(hours=1)
#     g_class = GoogleClass(
#         title=new_class.title,
#         start_time=start_time_obj,
#         end_time=end_time_obj,
#         tutor_id=user.id,
#         student_id=new_class.student_id,
#         google_meet_link=google_event.get('hangoutLink'),
#         google_event_id=google_event.get('id') 
#     )

#     db.add(g_class)
#     db.commit()
#     db.refresh(g_class)
#     return g_class

# def get_creds_from_token(google_refresh_token):
#     dec_token = decrypt_token(google_refresh_token)

#     creds = Credentials(
#         token=None,
#         refresh_token=dec_token,
#         client_id=os.getenv('CLIENT_ID'),
#         client_secret=os.getenv('CLIENT_SECRET'),
#         token_uri=os.getenv('TOKEN_URI')
#     )

#     try:
#         creds.refresh(Request())
#         return creds
#     except RefreshError as e:
#         raise ValueError(f"Failed to refresh Google token: {str(e)}")
    
# def create_google_meet(tutor: User, title: str, start_time: datetime):
#     if not tutor.token:
#         raise ValueError("Tutor has not connected their Google account.")
    
#     creds = get_creds_from_token(tutor.token)

#     start_time_obj = datetime.fromisoformat(start_time)
#     end_time_obj = start_time_obj + timedelta(hours=1)

#     start_iso = start_time_obj.isoformat()
#     end_iso = end_time_obj.isoformat()

#     google_class = {
#         'summary':title,
#         'start': {'dateTime':start_iso, 'timeZone':'America/New_York'},
#         'end': {'dateTime': end_iso, 'timeZone':'America/New_York'},
#         'attendees': [{'email': tutor.tutor_gmail}],
#         'conferenceData': {
#             'createRequest': {
#                 'requestId':str(uuid.uuid4()),
#                 'conferenceSolutionKey': {'type': 'hangoutsMeet'}
#             }
#         }
#     }

#     try:
#         service = build(serviceName='calendar', version='v3', credentials=creds, cache_discovery=False)

#         created_class = service.events().insert(calendarId='primary', body=google_class, conferenceDataVersion=1).execute()

#         return created_class

#     except Exception as e:
#         raise Exception('Server error in classes service')