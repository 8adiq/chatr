from sqlalchemy import Column, Integer, String, DateTime, ForeignKey,func
from sqlalchemy.orm import relationship
import uuid
from app.database.main import Base


class EmailVerificationToken(Base):
    __tablename__ = 'EmailVerificationTokens'
    id = Column(String(36),primary_key=True,index=True,default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("Users.id"),nullable=False)
    token = Column(String(36),nullable=False,unique=True,index=True)
    created_at = Column(DateTime(timezone=True),server_default=func.now())
    used_at =  Column(DateTime(timezone=True))
    expired_at = Column(DateTime(timezone= True),nullable=False)


    user = relationship("User", backref="EmailVerificationToken")

