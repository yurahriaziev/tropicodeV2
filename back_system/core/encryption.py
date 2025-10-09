from dotenv import load_dotenv
import os

from cryptography.fernet import Fernet

load_dotenv()
ENCRYPTION_KEY=os.getenv('ENCRYPTION_SECRET')
key = Fernet(ENCRYPTION_KEY)

def encrypt_token(token):
    enc = key.encrypt(token.encode()).decode()
    return enc

def decrypt_token(token):
    dec = key.decrypt(token.encode()).decode()
    return dec