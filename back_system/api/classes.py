from core.encryption import decrypt_token
from google.oauth2.credentials import Credentials
from google.auth.exceptions import RefreshError
from googleapiclient.discovery import build
from datetime import timedelta, datetime

from models import User
import uuid

import os
from dotenv import load_dotenv

load_dotenv()

def get_creds_from_token(google_refresh_token):
    dec_token = decrypt_token(google_refresh_token)

    creds = Credentials(
        refresh_token=dec_token,
        client_id=os.getenv('CLIENT_ID'),
        client_secret=os.getenv('CLIENT_SECRET'),
        token_uri=os.getenv('TOKEN_URI')
    )

    try:
        creds.refresh(None)
        return creds
    except RefreshError as e:
        raise ValueError(f"Failed to refresh Google token: {str(e)}")
    
def create_google_meet(tutor: User, title: str, start_time: datetime):
    if not tutor.token:
        raise ValueError("Tutor has not connected their Google account.")
    
    creds = get_creds_from_token(tutor.token)

    end_time = start_time + timedelta(hours=1)
    start_iso = start_time.isoformat()
    end_iso = end_time.isoformat()

    google_class = {
        'summary':title,
        'start': {'dateTime':start_iso, 'timeZone':'America/New_York'},
        'end': {'dateTime': end_iso, 'timeZone':'America/New_York'},
        'attendees': [{'email': tutor.tutor_gmail}],
        'conferenceData': {
            'createRequest': {
                'requestID':str(uuid.uuid4()),
                'conferenceSolutionKey': {'type': 'hangoutsMeet'}
            }
        }
    }

    try:
        service = build(serviceName='calendar', version='v3', credentials=creds)

        created_class = service.events().insert(calendarId='primary', body=google_class, conferenceDataVersion=1).execute()

        return created_class

    except Exception as e:
        raise Exception('Server error in classes service')