from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from fastapi import HTTPException, status,Depends
from fastapi.security import HTTPAuthorizationCredentials,HTTPBearer
from jose import jwt, JWTError
from app.posts.models import Post
from app.users.models import User
from app.comments.models import Comment
from app.likes.models import Like
from app.posts.schema import PostCreate, PostBase

from datetime import datetime
from typing import List


class PostService:
    def __init__(self, db: Session):
        self.db = db

    def validate_post_content(self, text: str) -> None:
        """Validate post content"""
        if not text.strip():
            raise HTTPException(status_code=400, detail="Posts cannot be empty")

    def create_post(self, post_data: PostCreate, user_id: str) -> Post:
        """Create a new post"""
        self.validate_post_content(post_data.text)
        
        db_post = Post(
            text=post_data.text,
            user_id=user_id
        )
        self.db.add(db_post)
        self.db.commit()
        self.db.refresh(db_post)
        return db_post

    def get_all_posts(self, skip: int = 0, limit: int = 50) -> List[Post]:
        """Get all posts with pagination"""
        return self.db.query(Post).join(User).options(
            joinedload(Post.likes),
            joinedload(Post.comments)
        ).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

    def get_post_by_id(self, post_id: str) -> Post:
        """Get post by ID"""
        return self.db.query(Post).options(
            joinedload(Post.likes),
            joinedload(Post.comments)
        ).filter(Post.id == post_id).order_by(Post.created_at.desc()).first()

    def get_user_posts(self, user_id: str, skip: int = 0, limit: int = 10) -> List[Post]:
        """Get posts by user ID with pagination"""
        return self.db.query(Post).options(
            joinedload(Post.likes),
            joinedload(Post.comments)
        ).filter(Post.user_id == user_id).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

    def update_post(self, post_id: str, post_data: PostBase, current_user_id: str) -> Post:
        """Update a post"""
        post = self.db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")

        if post.user_id != current_user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only update your own post.")

        post.text = post_data.text
        self.db.commit()
        self.db.refresh(post)
        return post

    def delete_post(self, post_id: str, current_user_id: str) -> None:
        """Delete a post"""
        post = self.db.query(Post).filter(Post.id == post_id).first()

        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")

        if post.user_id != current_user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only delete your own post.")

        # Delete related likes first
        likes = self.db.query(Like).filter(Like.post_id == post_id).all()
        for like in likes:
            self.db.delete(like)
        
        # Delete related comments first
        comments = self.db.query(Comment).filter(Comment.post_id == post_id).all()
        for comment in comments:
            self.db.delete(comment)
        
        # Now delete the post
        self.db.delete(post)
        self.db.commit()