from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
import json
import os

Base = declarative_base()

class MenuItem(Base):
    __tablename__ = 'menu_items'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price
        }

class Order(Base):
    __tablename__ = 'orders'
    
    id = Column(Integer, primary_key=True)
    customer_name = Column(String, nullable=False)
    items = Column(JSON, nullable=False)  # List of item IDs and quantities
    total_price = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'customer_name': self.customer_name,
            'items': self.items,
            'total_price': self.total_price,
            'timestamp': self.timestamp.isoformat()
        }

class TableAvailability(Base):
    __tablename__ = 'table_availability'
    
    id = Column(Integer, primary_key=True)
    date = Column(String, nullable=False)  # Format: YYYY-MM-DD
    time = Column(String, nullable=False)  # Format: HH:MM AM/PM
    available = Column(Integer, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date,
            'time': self.time,
            'available': self.available
        }

class Reservation(Base):
    __tablename__ = 'reservations'
    
    id = Column(Integer, primary_key=True)
    customer_name = Column(String, nullable=False)
    date = Column(String, nullable=False)  # Format: YYYY-MM-DD
    time = Column(String, nullable=False)  # Format: HH:MM AM/PM
    party_size = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'customer_name': self.customer_name,
            'date': self.date,
            'time': self.time,
            'party_size': self.party_size,
            'timestamp': self.timestamp.isoformat()
        }
