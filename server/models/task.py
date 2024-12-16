from sqlalchemy import Column, String, Integer, Enum, DateTime, Text
from datetime import datetime
from app import db


class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    urgency = Column(String(50), nullable=True)
    document_url = Column(String(255), nullable=True)
    status = Column(Enum('Open', 'Closed', name='status_enum'), default='Open', nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "department": self.department,
            "urgency": self.urgency,
            "documentUrl": self.document_url,
            "status": self.status,
            "createdAt": self.created_at.isoformat(),
        }
