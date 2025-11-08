from fastapi import APIRouter, HTTPException,Depends, status,BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from backend.users.models import User
from backend.users.schema import UserCreate,UserResponse,UserLogin
from backend.auth.schema import TokenResponse,RequestTokenResponse,EmailVerificationRequest,EmailVerificationResponse
from backend.auth.service import create_access_token,create_refresh_token,verify_token,validate_email_token,send_verification_email,create_verification_token
from backend.database.main import get_db_session
from backend.users.service import UserService


router = APIRouter()



# User Routes
@router.post("/register", response_model= TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate,background_tasks : BackgroundTasks, db: Session = Depends(get_db_session)):

    try:
        user_service = UserService(db)
        
        # Create user with validation
        db_user = user_service.create_user(user_data)

        verification_token = create_verification_token(db_user.id,db)
        background_tasks.add_task(send_verification_email,db_user.email,verification_token.token,db_user.username)

        # creates tokens
        access_token = create_access_token(data={"sub": db_user.email})
        refresh_token = create_refresh_token(data={"sub":db_user.email})

        return {
            "user": UserResponse(**db_user.to_dict()),
            "token": access_token,
            "refresh_token":refresh_token
        }
    except HTTPException as e:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Registration failed. Try again.")

@router.post("/login",response_model=TokenResponse)
async def login(user_data: UserLogin, db : Session = Depends(get_db_session)):

    user_service = UserService(db)
    user = user_service.authenticate_user(user_data)
    
    # create tokens for authenticated user
    if user is not None:
        access_token = create_access_token(data={"sub": user.email})
        refresh_token = create_refresh_token(data={"sub":user.email})

    return{
        "user": UserResponse(**user.to_dict()),
        "token": access_token,
        "refresh_token":refresh_token
    }

@router.post("/refresh",response_model=TokenResponse)
async def get_refresh_token(refresh_data: RequestTokenResponse, db : Session = Depends(get_db_session)):
    try:

        # verify refresh token and get object of that user
        payload = verify_token(refresh_data.refresh_token,"refresh")
        email = payload.get('sub')
        user = db.query(User).filter(User.email == email).first()

        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User not found")
        
        new_access_token = create_access_token(data={'sub':email})
        new_refresh_token = create_refresh_token(data={'sub':email})

        return {
            "user" : UserResponse(**user.to_dict()),
            "token": new_access_token,
            "refresh_token":new_refresh_token
        }
    except HTTPException:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Token invalid or expired.")
    

@router.post('/verify-email',response_model=EmailVerificationResponse)
async def verify_email(verification_data: EmailVerificationRequest, db: Session = Depends(get_db_session)):
    
    try:
        is_valid = validate_email_token(verification_data.token, db)

        if is_valid:
            return EmailVerificationResponse(
                success=True,
                message="Email verified successfully!"
            )
        else:
            return EmailVerificationResponse(
                success=False,
                message="Invalid or expired verification token"
            )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=f"Error during verification {str(e)}")