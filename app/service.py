from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from fastapi import HTTPException, status,Depends
from fastapi.security import HTTPAuthorizationCredentials,HTTPBearer
from jose import jwt, JWTError
from .models import User, Post, Comment, Like
from .schema import UserCreate, UserLogin, PostCreate, PostBase, CommentBase
from .auth import hash_password, verify_password
from datetime import datetime
from typing import List


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def check_email_exists(self, email: str) -> bool:
        """Check if email already exists in database"""
        return self.db.query(User).filter(func.lower(User.email) == email.lower()).first() is not None

    def check_username_exists(self, username: str) -> bool:
        """Check if username already exists in database"""
        return self.db.query(User).filter(User.username == username).first() is not None

    def validate_password(self, password: str) -> None:
        """Validate password requirements"""
        if len(password) < 6:
            raise HTTPException(
                status_code=400, 
                detail="Password has to be at least 6 characters"
            )

    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user with validation"""
        # Check if email already exists
        if self.check_email_exists(user_data.email.lower()):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Check if username already exists
        if self.check_username_exists(user_data.username):
            raise HTTPException(status_code=400, detail="Username already exists")
        
        # Validate password length
        self.validate_password(user_data.password)
        
        # Create user
        hashed_password = hash_password(user_data.password)
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(self, user_data: UserLogin) -> User:
        """Authenticate user login"""
        user = self.db.query(User).filter(func.lower(User.email) == user_data.email.lower()).first()

        if not user or not verify_password(user_data.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return user

    def get_user_by_email(self, email: str) -> User:
        """Get user by email"""
        return self.db.query(User).filter(func.lower(User.email) == email.lower()).first()

    def get_user_by_id(self, user_id: str) -> User:
        """Get user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()


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


class CommentService:
    def __init__(self, db: Session):
        self.db = db

    def validate_comment_content(self, text: str) -> None:
        """Validate comment content"""
        if not text.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Comment cannot be empty")

    def create_comment(self, post_id: str, comment_data: CommentBase, user_id: str) -> Comment:
        """Create a new comment"""
        # Check if post exists
        post = self.db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Post found.")

        self.validate_comment_content(comment_data.text)
        
        db_comment = Comment(
            text=comment_data.text,
            user_id=user_id,
            post_id=post_id
        )
        self.db.add(db_comment)
        self.db.commit()
        self.db.refresh(db_comment)
        return db_comment

    def get_post_comments(self, post_id: str, skip: int = 0, limit: int = 10) -> List[Comment]:
        """Get comments for a specific post"""
        # Check if post exists
        post = self.db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Post Found.")
        
        return self.db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.desc()).offset(skip).limit(limit).all()


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

