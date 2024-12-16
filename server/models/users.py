from sqlalchemy import Column, Integer, String, DateTime, Enum, Boolean
from datetime import datetime
from app import db

class User(db.Model):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=True, unique=True)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # Replace with Enum if you have specific roles
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(Boolean, default=True)

# Example of Enum for roles:
from enum import Enum as PyEnum

class Role(PyEnum):
    DEPUTY_DIRECTOR = "deputyDirector"
    PRINCIPAL_OFFICER = "principalOfficer"
    SENIOR_OFFICER = "seniorOfficer"

# If you want to enforce specific roles:
role = Column(Enum(Role), nullable=False)
