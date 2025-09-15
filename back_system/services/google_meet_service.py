import os
from google_auth_oauthlib.flow import Flow
from dotenv import load_dotenv

load_dotenv()

SCOPES = ['https://www.googleapis.com/auth/calendar']
CREDENTIALS = os.getenv('G_CREDENTIALS')

def create_google_auth_flow():
    """
    create and configure the Google OAuth2.0 Flow object
    reads the credentials file and the required scopes needed and makes the redirect uri to 
    send the user back to after authentication
    """
    flow = Flow.from_client_secrets_file(
        CREDENTIALS,
        scopes=SCOPES
    )

    flow.redirect_uri = os.getenv('GOOGLE_REDIRECT_URI')

    return flow

def get_google_auth_url():
    flow = create_google_auth_flow()
    url, state = flow.authorization_url(access_type='offline', prompt='consent')

    return url, state

def fetch_google_tokens(code):
    flow = create_google_auth_flow()

    flow.fetch_token(code=code)

    return flow.credentials