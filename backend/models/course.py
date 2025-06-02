from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text, Table
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from datetime import datetime, timezone
import uuid

from db import Base

class Course(Base):
    __tablename__ = 'courses'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    skills = Column(ARRAY(String), default=[])
    projects = Column(ARRAY(String), default=[])
    languages = Column(ARRAY(String), default=[])
    published = Column(Boolean, default=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)

    creator = relationship('User', back_populates='courses_created')