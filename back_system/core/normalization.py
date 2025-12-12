def normalize_email(email: str) -> str:
    return email.strip().lower()

def normalize_phone(phone: str) -> str:
    digits = ''.join(d for d in phone if d.isdigit())

    if len(digits) != 10:
        raise ValueError('Phone number must contain exactly 10 digits')
    
    return f'+1{digits}'