from fastapi import APIRouter, HTTPException,Depends, status
from sqlalchemy.orm import Session
from typing import List
from .models import User,Post,Comment,Like,EmailVerificationToken
from .schema import UserCreate,TokenResponse,UserResponse,UserLogin,PostPublic,PostCreate,PostBase,CommentBase,CommentCreate,CommentPublic,LikeResponse,LikeCreate,EmailVerification
from .auth import get_user_details,create_token
from .database import get_db_session
from .service import EmailVerificationService, UserService, PostService, CommentService, LikeService
from datetime import datetime


router = APIRouter()

# User Routes
@router.post("/register", response_model= TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db_session)):

    user_service = UserService(db)
    email_service = EmailVerificationService()
    
    # Create user with validation
    db_user = user_service.create_user(user_data)
    
    # Create verification token
    verification_token = user_service.create_verification_token(db_user.id)
    
    # Send verification email
    email_sent = await email_service.send_verification_email(
        username=db_user.username,
        user_email=db_user.email,
        token=verification_token
    )
    if not email_sent:
        raise HTTPException(status_code=500, detail="Failed to send verification email.")

    access_token = create_token(data={"sub": db_user.email})
    return {
        "user": UserResponse(**db_user.to_dict()),
        "token": access_token
    }

@router.post("/login",response_model=TokenResponse)
async def login(user_data: UserLogin, db : Session = Depends(get_db_session)):

    user_service = UserService(db)
    user = user_service.authenticate_user(user_data)
    
    access_token = create_token(data={"sub": user.email})

    return{
        "user": UserResponse(**user.to_dict()),
        "token": access_token
    }

@router.post("/email-verification/request")
async def email_verification_request(request: EmailVerification, db:Session=Depends(get_db_session)):

    user_service = UserService(db)
    email_service = EmailVerificationService()
    
    user = user_service.get_user_by_email(request.email)

    if not user:
        return {"message: Email already exists, Verification link sent"}
    
    if user.email_varified:
        raise HTTPException(status_code=400, detail="Email already verified")
    
    # Delete existing verification tokens
    user_service.delete_existing_verification_tokens(user.id)

    # Create new verification token
    verification_token = user_service.create_verification_token(user.id)

    # Send verification email
    email_sent = await email_service.send_verification_email(
        username=user.username,
        user_email=user.email,
        token=verification_token
    )

    if not email_sent:
        raise HTTPException(status_code=500, detail="Failed to send verification email.")
    
    return {"message": "Verification email sent successfully"}

@router.post("/email-verification/confirm")
async def email_verification_confirm(token: str, db: Session = Depends(get_db_session)):
    """Confirm email verification with token"""
    
    # Find the verification token
    verification_token = db.query(EmailVerificationToken).filter(
        EmailVerificationToken.token == token,
        EmailVerificationToken.used == False,
        EmailVerificationToken.expires_at > datetime.utcnow()
    ).first()
    
    if not verification_token:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    
    # Get the user
    user_service = UserService(db)
    user = user_service.get_user_by_id(verification_token.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Mark email as verified
    user.email_varified = True
    user.email_varified_at = datetime.utcnow()
    
    # Mark token as used
    verification_token.used = True
    
    db.commit()
    
    return {"message": "Email verified successfully"}

@router.get("/profile")
async def show_profile(current_user : User = Depends(get_user_details)):
    return {"user": UserResponse(**current_user.to_dict())}


# Post Routes
@router.post("/posts",response_model=PostPublic,status_code=status.HTTP_201_CREATED)
async def create_post(post_data : PostCreate, db : Session = Depends(get_db_session),
                      current_user: User = Depends(get_user_details)):
    
    post_service = PostService(db)
    db_post = post_service.create_post(post_data, current_user.id)
    return PostPublic(**db_post.to_dict())

@router.get("/posts",response_model = List[PostPublic])
async def get_all_posts(skip : int = 0, limit : int = 50, 
                        db : Session = Depends(get_db_session)):

    post_service = PostService(db)
    posts = post_service.get_all_posts(skip, limit)
    return [PostPublic(**post.to_dict()) for post in posts]


@router.get("/posts/{post_id}",response_model=PostPublic)
async def get_post(post_id : str ,db : Session = Depends(get_db_session)):

    post_service = PostService(db)
    post = post_service.get_post_by_id(post_id)

    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return PostPublic(**post.to_dict())



@router.put("/posts/{post_id}",response_model=PostPublic)
async def update_post(post_data : PostBase , post_id : str , db : Session = Depends(get_db_session),
                      current_user : User = Depends(get_user_details)):

    post_service = PostService(db)
    post = post_service.update_post(post_id, post_data, current_user.id)
    return PostPublic(**post.to_dict())

@router.delete("/posts/{post_id}",status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id : str, db  : Session = Depends(get_db_session),
                      current_user : User = Depends(get_user_details)):

    post_service = PostService(db)
    post_service.delete_post(post_id, current_user.id)
    return None


# Comment Routes

@router.post("/comments",response_model=CommentPublic, status_code=status.HTTP_201_CREATED)
async def create_comment(post_id : str ,comment_data : 
                         CommentBase, db : Session = Depends(get_db_session),
                         current_user : User = Depends(get_user_details)):
    
    comment_service = CommentService(db)
    db_comment = comment_service.create_comment(post_id, comment_data, current_user.id)
    return CommentPublic(**db_comment.to_dict())


@router.get("/{post_id}/comments",response_model=List[CommentPublic])
async def get_comments(post_id : str, db :Session = Depends(get_db_session), skip : int = 0, limit : int = 10):

    comment_service = CommentService(db)
    comments = comment_service.get_post_comments(post_id, skip, limit)
    return [CommentPublic(**comment.to_dict()) for comment in comments]


# Like Routes
@router.post("/likes",response_model=LikeResponse,status_code=status.HTTP_201_CREATED)
async def like_post(post_id : str , current_user : User = Depends(get_user_details), 
                    db: Session = Depends(get_db_session)):
    
    like_service = LikeService(db)
    new_like = like_service.like_post(post_id, current_user.id)
    return LikeResponse(**new_like.to_dict())


@router.delete("/likes",status_code=status.HTTP_204_NO_CONTENT)
async def unlike(post_id : str, db : Session = Depends(get_db_session),current_user :User=Depends(get_user_details)):

    like_service = LikeService(db)
    like_service.unlike_post(post_id, current_user.id)
    return None


# User Posts Route (moved to end to avoid conflicts with comments route)
@router.get("/{user_id}/posts",response_model=List[PostPublic])
async def get_user_post(user_id : str ,skip :int = 0, limit :  int =10,
                        db: Session = Depends(get_db_session)):
    
    user_service = UserService(db)
    post_service = PostService(db)
    
    user = user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not Found.")

    posts = post_service.get_user_posts(user_id, skip, limit)
    return [PostPublic(**post.to_dict()) for post in posts]