from datetime import datetime,timedelta,timezone
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import HTTPException, Depends,status
from sqlalchemy.orm import Session
from app.users.models import User
from app.auth.model import EmailVerificationToken
from app.database.main import get_db_session
from app.config import settings
import bcrypt
import uuid
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sib_api_v3_sdk import Configuration, ApiClient, TransactionalEmailsApi, SendSmtpEmail
from sib_api_v3_sdk.rest import ApiException


SECRET_KEY = settings.secret_key
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is not set.")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_MINUTES = int(settings.access_token_expires_minutes)
ACCESS_TOKEN_EXPIRES_DAYS = int(settings.refresh_token_expires_days)


security = HTTPBearer()

def hash_password(password: str) -> str:
    """hash password"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(password: str, hashed_password: str) -> bool:
    """verify password against hashed password"""
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(data:dict) -> str:
    """generates jwt access token"""

    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)

    to_encode.update({'exp':expire, 'type':'access'})
    encoded_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

    return encoded_jwt

def create_refresh_token(data:dict) -> str :
    """generates jwt access token"""

    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRES_DAYS)

    to_encode.update({'exp': expire, 'type': 'refresh'})
    encoded_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

    return encoded_jwt

def verify_token(token : str, token_type : str = 'access'):

    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms=ALGORITHM)
        email = payload.get('sub')
        token_type_check = payload.get('type')

        if email is None or token_type_check != token_type:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Token invalid or expired.")
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Token invalid or expired.")


def get_user_details(credentials: HTTPAuthorizationCredentials = Depends(security),
                      db: Session = Depends(get_db_session)):
    """get authenticated user's details"""
    try:
        payload = verify_token(credentials.credentials,"access")
        email = payload.get('sub')

        if email is None:
            raise HTTPException(status_code=401, detail='Invalid Token')
    except JWTError:
        raise HTTPException(status_code=401, detail='Invalid Token')
    
    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise HTTPException(status_code=401,detail="User not found")
    
    # Check if user is verified (optional - remove if you don't want to enforce verification)
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified. Please verify your email address.")
    
    return user


def generate_verification_token():
    """generate a random token"""
    return str(uuid.uuid4())

def create_verification_token(user_id, db: Session):
    """create and store token for a user"""

    token = generate_verification_token()
    expired_at = datetime.utcnow() + timedelta(hours=24)

    verification_token = EmailVerificationToken(
        user_id=user_id,
        token=token,
        expired_at=expired_at
    )
    db.add(verification_token)
    db.commit()
    db.refresh(verification_token)  
    return verification_token

def send_verification_email(user_email,token,username):
    """sending verification to user after registration"""
    try:
        smtp_server=settings.smtp_host
        smtp_port=settings.smtp_port
        smtp_from_email=settings.smtp_default_from_email
        smtp_password=settings.smtp_password
        smtp_username=settings.smtp_username


        msg = MIMEMultipart()
        msg["From"] = smtp_from_email
        msg["To"] = user_email
        msg["Subject"] = "Verify Your Email Address"

        verification_url = f"{settings.cors_allowed_origins}/verify-email?token={token}"

        body = f"""
        Hello {username}!
        
        Thank you for registering. Please verify your email address by clicking the link below:
        
        {verification_url}
        
        This link will expire in 24 hours.
        
        If you didn't create an account, please ignore this email.
        
        Best regards,
        Your App Team
        """

        msg.attach(MIMEText(body,'plain'))

        if smtp_port == 465:
            server = smtplib.SMTP_SSL(smtp_server,smtp_port)
            print("Using SSL connection")
        else:
            server = smtplib.SMTP(smtp_server,smtp_port)
            print("Starting TLS")
            server.starttls()

        server.login(smtp_username,smtp_password)
        server.send_message(msg)
        server.quit()

        return True

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=f"Error sending email :{e}")

# settings = get_settings()

# def send_verification_email(user_email: str, token: str, username: str):
#     """Send verification email using Brevo Transactional Email API"""
#     try:
#         verification_url = f"{settings.cors_allowed_origins}/verify-email?token={token}"

#         # Configure Brevo API
#         configuration = Configuration()
#         configuration.api_key['api-key'] = settings.brevo_api_key

#         api_instance = TransactionalEmailsApi(ApiClient(configuration))

#         email = SendSmtpEmail(
#             sender={"name": "Your App Team", "email": settings.smtp_default_from_email},
#             to=[{"email": user_email, "name": username}],
#             subject="Verify Your Email Address",
#             html_content=f"""
#             <html>
#                 <body>
#                     <p>Hello {username}!</p>
#                     <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
#                     <p><a href="{verification_url}">Verify Email</a></p>
#                     <p>This link will expire in 24 hours.</p>
#                     <p>If you didn't create an account, please ignore this email.</p>
#                     <p>Best regards,<br>Your App Team</p>
#                 </body>
#             </html>
#             """
#         )

#         api_response = api_instance.send_transac_email(email)
#         print(f"Verification email sent to {user_email}")
#         return True

#     except ApiException as e:
#         # Log the error instead of raising HTTPException
#         print(f"Failed to send verification email to {user_email}: {e}")
#         return False

def validate_email_token(token,db: Session) -> bool:
    """validate the token returned after the user verifies their email"""

    verification_token = db.query(EmailVerificationToken).filter(EmailVerificationToken.token == token).first()

    if not verification_token:
        return False
    

    now_utc = datetime.now(timezone.utc)

    if verification_token.expired_at < now_utc:
        return False
    
    if verification_token.used_at:
        return False
    
    verification_token.used_at = now_utc

    user = db.query(User).filter(User.id == verification_token.user_id).first()

    if user:
        user.is_verified = True
    
    db.commit()
    return True

    


def resend_verification_email():
    pass




    
