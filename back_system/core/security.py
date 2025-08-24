from passlib.context import CryptContext

pass_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def get_password_hash(password:str):
    return pass_context.hash(password)

def verify_pass(original:str, h:str):
    return pass_context.verify(original, h)