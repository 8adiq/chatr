from sqlalchemy import Column, String, ForeignKey, DateTime, UniqueConstraint,Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.database import Base

class User(Base):
    __tablename__ = 'Users'
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    email_varified = Column(Boolean,nullable=False,default=False)
    email_varified_at = Column(DateTime(timezone=True),nullable=True)

    def to_dict(self):
        """ converting user object to a dictionary"""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }
    
    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"
    
class Post(Base):
    __tablename__ = 'Posts'
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    text = Column(String(1000), nullable=True)
    user_id = Column(String(36), ForeignKey("Users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="posts")

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat()
        }
    
    def __repr__(self):
        return f"<Post(id={self.id}, text={self.text}, user_id={self.user_id})>"
    
class Comment(Base):
    __tablename__ = "Comments"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    text = Column(String(500), nullable=True)
    user_id = Column(String(36), ForeignKey("Users.id"), nullable=False)
    post_id = Column(String(36), ForeignKey("Posts.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="comments")
    post = relationship("Post", backref="comments")

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "user_id": self.user_id,
            "post_id": self.post_id,
            "created_at": self.created_at.isoformat()
        }
    
    def __repr__(self):
        return f"<Comment(id={self.id}, text={self.text}, user_id={self.user_id}, post_id={self.post_id})>"

class Like(Base):
    __tablename__ = "Likes"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("Users.id"), nullable=False)
    post_id = Column(String(36), ForeignKey("Posts.id"), nullable=False)

    user = relationship("User", backref="likes")
    post = relationship("Post", backref="likes")
    
    # Prevent duplicate likes
    __table_args__ = (UniqueConstraint('user_id', 'post_id', name='unique_user_post_like'),)

    def to_dict(self):
        """Convert like object to dictionary"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id
        }
    
    def __repr__(self):
        return f"<Like(id={self.id}, user_id={self.user_id}, post_id={self.post_id})>"




class EmailVerificationToken(Base):
    __tablename__ = "EmailVerificationTokens"
    id = Column(String(36),primary_key=True,unique=True,default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36),ForeignKey('Users.id'),nullable=False)
    token  = Column(String(255),unique=True,nullable=False)
    expires_at = Column(DateTime(timezone=True),nullable=False)
    used = Column(Boolean,default=False)

    user = relationship('User', backref="email_verification_tokens")
    
    def to_dict(self):
        """Convert email verification token to dictionary"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "token": self.token,
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
            "used": self.used
        }
    