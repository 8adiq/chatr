from sqlalchemy import Column, String, ForeignKey, DateTime, UniqueConstraint, Index, func
from sqlalchemy.orm import relationship
import uuid
from app.database.main import Base

class User(Base):
    __tablename__ = 'Users'
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)


    __table_args__ = (
        Index('ix_users_email_lower', func.lower(email), unique=True),
    )

    def to_dict(self):
        """ converting user object to a dictionary"""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }
    
    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"