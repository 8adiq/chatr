from sqlalchemy import Column, Integer, String
from app.database import Base

class User(Base):
    __tablename__ = 'Users'
    id = Column(Integer,primary_key=True,index=True)
    username = Column(String,unique=True,index=True,nullable=False)
    email = Column(String,unique=True,nullable=False,index=True)
    hashed_password = Column(String,nullable=False)

    def to_dict(self):
        """ converting user object to a dictionary"""
        return {
            "id":self.id,
            "username":self.username,
            "email":self.username,
        }
