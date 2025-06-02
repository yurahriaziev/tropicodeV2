from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text, Table
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from datetime import datetime, timezone
import uuid

from db import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    parent = relationship('Parent', back_populates='user', uselist=False)
    courses_created = relationship('Course', back_populates='creator')

class Parent(Base):
    __tablename__ = 'parents'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    first = Column(String, nullable=False)
    last = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    phone_number = Column(String, nullable=True)
    student_ids = Column(ARRAY(UUID(as_uuid=True), default=[]))

    user = relationship('User', back_populates='parent')
    students = relationship('Student', back_populates='parent')

class Student(Base):
    __tablename__ = 'students'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parent_id = Column(UUID(as_uuid=True), ForeignKey('parents.id'), nullable=False)
    firs = Column(String, nullable=False)
    last = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    login_code = Column(String(4), unique=True, nullable=False)
    course_ids = Column(ARRAY(UUID(as_uuid=True), default=[]))
    
    parent = relationship('Parent', back_populates='students')