from fastapi import APIRouter, HTTPException,Depends, status
from sqlalchemy.orm import Session
from typing import List
from backend.users.models import User
from backend.posts.schema import PostPublic,PostCreate,PostBase
from backend.auth.service import get_user_details
from backend.database.main import get_db_session
from backend.posts.service import PostService
from datetime import datetime


router = APIRouter()


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