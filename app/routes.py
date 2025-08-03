from fastapi import APIRouter, HTTPException,Depends, status
from sqlalchemy.orm import Session
from typing import List
from .models import User,Post
from .schema import UserCreate,TokenResponse,UserResponse,UserLogin,PostPublic,PostCreate,PostBase
from .auth import hash_password,verify_password,get_user_details,create_token
from .database import get_db_session


router = APIRouter()

@router.post("/register", response_model= TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db_session)):

    # check if email already exits
    existing_email = db.query(User).filter(User.email ==user_data.email).first()
    if existing_email:
        raise HTTPException(status_code=400,detail="Email already registered")
    
    # check if username already exits
    existing_username = db.query(User).filter(User.username ==user_data.username).first()
    if existing_username:
        raise HTTPException(status_code=400,detail="Username already exits")
    
    # validate password length
    if len(user_data.password) < 6:
        raise HTTPException(status_code=400,detail="Password has to be at least 6 characters")
    
    hashed_password = hash_password(user_data.password) 
    db_user = User(
        username = user_data.username,
        email = user_data.email,
        hashed_password = hashed_password
    )
    db.add(db_user)
    db.commit()

    access_token = create_token(data={"sub":db_user.email})
    return {
        "user": UserResponse(**db_user.to_dict()),
        "token": access_token
    }

@router.post("/login",response_model=TokenResponse)
async def login(user_data: UserLogin, db : Session = Depends(get_db_session)):

    # Find user
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401,detail="Invalid credentials")
    
    access_token = create_token(data={"sub":user.email})

    return{
        "user": UserResponse(**user.to_dict()),
        "token": access_token
    }

@router.get("/profile")
async def show_profile(current_user : User = Depends(get_user_details)):
    return {"user":UserResponse(**current_user.to_dict())}


@router.post("/posts",response_model=PostPublic,status_code=status.HTTP_201_CREATED)
async def create_post(post_data : PostCreate, db : Session = Depends(get_db_session),
                      current_user: User = Depends(get_user_details)):
    
    if not post_data.text.strip():
        raise HTTPException(status_code=400,detail="Posts cannot be empty")
    
    db_post = Post(
        text = post_data.text,
        user_id = current_user.id
    )

    db.add(db_post)
    db.commit()
    db.refresh(db_post)

    return PostPublic(**db_post.to_dict())

@router.get("/posts",response_model = List[PostPublic])
async def get_all_posts(skip : int = 0, limit : int = 50, 
                        db : Session = Depends(get_db_session)):

    posts = db.query(Post).offset(skip).limit(limit).all()
    return  [PostPublic(**post.to_dict()) for post in posts]


@router.get("/posts/{post_id}",response_model=PostPublic)
async def get_post(post_id : str ,db : Session = Depends(get_db_session)):

    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Post not found")
    return PostPublic(**post.to_dict())

@router.put("/posts/{post_id}",response_model=PostPublic)
async def update_post(post_data : PostBase , post_id : str , db : Session = Depends(get_db_session),
                      current_user : User = Depends(get_user_details)):

    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Post not found.")

    if post.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You can only update your own post.")
    

    post.text = post_data.text
    db.commit()
    db.refresh(post)
    
    return PostPublic(**post.to_dict())

@router.delete("/posts/{post_id}",status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id : str, db  : Session = Depends(get_db_session),
                      current_user : User = Depends(get_user_details)):

    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Post not found.")

    if post.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You can only delete your own post.")

    db.delete(post)
    db.commit()
    return None




