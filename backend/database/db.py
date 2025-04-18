from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import json
import os

# Use absolute imports when running as a script
try:
    from ..models import Base, MenuItem, TableAvailability
except ImportError:
    from backend.models import Base, MenuItem, TableAvailability

# Create database engine
DATABASE_URL = "sqlite:///restaurant.db"
engine = create_engine(DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Initialize the database with tables and sample data"""
    Base.metadata.create_all(bind=engine)

    # Add sample data if tables are empty
    session = SessionLocal()

    # Add menu items if none exist
    if session.query(MenuItem).count() == 0:
        menu_items = [
            {"id": 1, "name": "Margherita Pizza", "price": 12.99},
            {"id": 2, "name": "Caprese Salad", "price": 9.49},
            {"id": 3, "name": "Vegetarian Lasagna", "price": 14.99},
            {"id": 4, "name": "Stuffed Bell Peppers", "price": 13.49},
            {"id": 5, "name": "Spinach and Ricotta Ravioli", "price": 15.99},
            {"id": 6, "name": "Mushroom Risotto", "price": 16.49},
            {"id": 7, "name": "Vegetable Biryani", "price": 11.99},
            {"id": 8, "name": "Paneer Tikka Masala", "price": 13.99},
            {"id": 9, "name": "Falafel Wrap", "price": 10.49},
            {"id": 10, "name": "Grilled Veggie Sandwich", "price": 8.99},
            {"id": 11, "name": "Bruschetta", "price": 7.49},
            {"id": 12, "name": "Vegetarian Sushi Roll", "price": 12.99},
            {"id": 13, "name": "Zucchini Noodles with Pesto", "price": 14.49},
            {"id": 14, "name": "Sweet Potato Tacos", "price": 9.99},
            {"id": 15, "name": "Greek Salad", "price": 8.49},
            {"id": 16, "name": "Stuffed Portobello Mushrooms", "price": 13.99},
            {"id": 17, "name": "Chickpea Curry with Rice", "price": 11.49},
            {"id": 18, "name": "Vegetable Quesadilla", "price": 10.99},
            {"id": 19, "name": "Lentil Soup", "price": 7.99},
            {"id": 20, "name": "Vegetarian Pad Thai", "price": 12.49},
            {"id": 21, "name": "Pumpkin Gnocchi", "price": 15.99},
            {"id": 22, "name": "Avocado Toast", "price": 8.99},
            {"id": 23, "name": "Cauliflower Steak", "price": 14.99},
            {"id": 24, "name": "Vegetable Tempura", "price": 9.49},
            {"id": 25, "name": "Fruit Salad", "price": 6.99}
        ]

        for item in menu_items:
            menu_item = MenuItem(id=item["id"], name=item["name"], price=item["price"])
            session.add(menu_item)

    # Add table availability if none exists
    if session.query(TableAvailability).count() == 0:
        availability_data = {
            "2025-03-27": {
                "12:00 PM": {"available": 3},
                "2:00 PM": {"available": 5},
                "7:00 PM": {"available": 2},
                "9:00 PM": {"available": 0}
            },
            "2025-03-28": {
                "1:00 PM": {"available": 4},
                "3:00 PM": {"available": 6},
                "8:00 PM": {"available": 1}
            }
        }

        for date, times in availability_data.items():
            for time, data in times.items():
                availability = TableAvailability(
                    date=date,
                    time=time,
                    available=data["available"]
                )
                session.add(availability)

    session.commit()
    session.close()

def get_db():
    """Get a database session"""
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()

# Functions for database operations
def get_menu_items(db):
    """Get all menu items"""
    return db.query(MenuItem).all()

def get_table_availability(db, date=None):
    """Get table availability for a specific date or all dates"""
    if date:
        return db.query(TableAvailability).filter(TableAvailability.date == date).all()
    return db.query(TableAvailability).all()

def get_orders(db):
    """Get all orders"""
    try:
        from ..models import Order
    except ImportError:
        from backend.models import Order
    return db.query(Order).all()

def get_reservations(db):
    """Get all reservations"""
    try:
        from ..models import Reservation
    except ImportError:
        from backend.models import Reservation
    return db.query(Reservation).all()

def create_order(db, customer_name, items, total_price):
    """Create a new order"""
    try:
        from ..models import Order
    except ImportError:
        from backend.models import Order
    order = Order(
        customer_name=customer_name,
        items=items,
        total_price=total_price
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order

def update_order(db, order_id, customer_name=None, items=None, total_price=None):
    """Update an existing order"""
    try:
        from ..models import Order
    except ImportError:
        from backend.models import Order

    # Find the order by ID
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        return None

    # Update fields if provided
    if customer_name is not None:
        order.customer_name = customer_name

    if items is not None:
        order.items = items

    if total_price is not None:
        order.total_price = total_price

    db.commit()
    db.refresh(order)
    return order

def create_reservation(db, customer_name, date, time, party_size):
    """Create a new reservation and update availability"""
    try:
        from ..models import Reservation
    except ImportError:
        from backend.models import Reservation

    # Check if there are enough tables available
    availability = db.query(TableAvailability).filter(
        TableAvailability.date == date,
        TableAvailability.time == time
    ).first()

    if not availability or availability.available < 1:
        return None

    # Update availability
    availability.available -= 1

    # Create reservation
    reservation = Reservation(
        customer_name=customer_name,
        date=date,
        time=time,
        party_size=party_size
    )

    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation

def update_reservation(db, reservation_id, customer_name=None, date=None, time=None, party_size=None):
    """Update an existing reservation"""
    try:
        from ..models import Reservation
    except ImportError:
        from backend.models import Reservation

    # Find the reservation by ID
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()

    if not reservation:
        return None

    # If changing date or time, check availability
    if (date and date != reservation.date) or (time and time != reservation.time):
        old_date = reservation.date
        old_time = reservation.time
        new_date = date or old_date
        new_time = time or old_time

        # Check if there are tables available at the new time
        new_availability = db.query(TableAvailability).filter(
            TableAvailability.date == new_date,
            TableAvailability.time == new_time
        ).first()

        if not new_availability or new_availability.available < 1:
            return None

        # Update old availability (increase available tables)
        old_availability = db.query(TableAvailability).filter(
            TableAvailability.date == old_date,
            TableAvailability.time == old_time
        ).first()

        if old_availability:
            old_availability.available += 1

        # Update new availability (decrease available tables)
        new_availability.available -= 1

    # Update fields if provided
    if customer_name is not None:
        reservation.customer_name = customer_name

    if date is not None:
        reservation.date = date

    if time is not None:
        reservation.time = time

    if party_size is not None:
        reservation.party_size = party_size

    db.commit()
    db.refresh(reservation)
    return reservation
