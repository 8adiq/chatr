from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from fastapi import HTTPException, status,Depends
from backend.posts.models import Post
from backend.likes.models import  Like
from typing import List

class LikeService:
    def __init__(self, db: Session):
        self.db = db

    def like_post(self, post_id: str, user_id: str) -> Like:
        """Like a post"""
        # Check if post exists
        post = self.db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Post Found.")
        
        # Check if already liked
        existing_like = self.db.query(Like).filter(
            Like.user_id == user_id, 
            Like.post_id == post_id
        ).first()

        if existing_like:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Already liked.")
            
        new_like = Like(
            user_id=user_id,
            post_id=post_id
        )
        self.db.add(new_like)
        self.db.commit()
        self.db.refresh(new_like)
        return new_like

    def unlike_post(self, post_id: str, user_id: str) -> None:
        """Unlike a post"""
        # Check if post exists
        post = self.db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No post Found.")
        
        # Check if liked
        liked = self.db.query(Like).filter(
            Like.user_id == user_id, 
            Like.post_id == post_id
        ).first()

        if not liked:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not Liked")
        
        self.db.delete(liked)
        self.db.commit()

    def get_user_likes(self, user_id: str) -> List[Like]:
        """Get all likes by a user"""
        return self.db.query(Like).filter(Like.user_id == user_id).all()