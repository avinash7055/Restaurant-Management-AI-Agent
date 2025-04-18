from langchain_core.tools import tool
import json
from inspect import currentframe

# Use absolute imports when running as a script
try:
    from ..database.db import get_db, get_menu_items, get_table_availability, create_order, create_reservation, get_orders, get_reservations
except ImportError:
    from backend.database.db import get_db, get_menu_items, get_table_availability, create_order, create_reservation, get_orders, get_reservations




@tool
def get_menu():
    """Get the restaurant menu with all available items."""
    db = get_db()
    menu_items = get_menu_items(db)

    # Header
    formatted_menu = (
        "🍽️  ✦ WELCOME TO GREEN DELIGHT RESTAURANT ✦\n"
        "       ~ Exquisite Vegetarian Cuisine ~\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "         🍃 MENU HIGHLIGHTS 🍃\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
    )

    # Categories
    price_ranges = {
        "APPETIZERS & STARTERS": {"emoji": "🥗", "items": []},
        "MAIN COURSES": {"emoji": "🍛", "items": []},
        "CHEF'S SPECIALTIES": {"emoji": "👨‍🍳", "items": []}
    }

    # Categorize items
    for item in menu_items:
        item_dict = item.to_dict()
        price = item_dict["price"]

        if price < 10:
            price_ranges["APPETIZERS & STARTERS"]["items"].append(item_dict)
        elif price <= 15:
            price_ranges["MAIN COURSES"]["items"].append(item_dict)
        else:
            price_ranges["CHEF'S SPECIALTIES"]["items"].append(item_dict)

    # Format each section
    for category, details in price_ranges.items():
        items = details["items"]
        emoji = details["emoji"]
        if items:
            formatted_menu += f"{emoji}  {category}\n"
            formatted_menu += "────────────────────────────\n"
            sorted_items = sorted(items, key=lambda x: x["name"])
            for i, item in enumerate(sorted_items, 1):
                formatted_menu += f"{i}. {item['name']} — ${item['price']:.2f}\n"
            formatted_menu += "\n"

    # Footer
    formatted_menu += (
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
        "📝 To place your order, simply let me know the item numbers or names you'd like.\n"
        "We're here to deliver a delightful dining experience! 🌿\n"
    )

    # Return both formatted and raw menu
    return {
        "formatted_menu": formatted_menu,
        "menu_items": [item.to_dict() for item in menu_items]
    }

@tool
def check_availability(date: str = None):
    """
    Check table availability for a specific date or all dates.

    Args:
        date: Date in format YYYY-MM-DD (optional)

    Returns:
        Dictionary of available tables by date and time, and a formatted message for display
    """
    db = get_db()
    availability = get_table_availability(db, date)

    result = {}
    for item in availability:
        if item.date not in result:
            result[item.date] = {}

        result[item.date][item.time] = {"available": item.available}

    # Create a formatted message for display
    formatted_message = "📅 Available Tables:\n\n"

    for date in sorted(result.keys()):
        formatted_message += f"Date: {date}\n"
        formatted_message += "─────────────────────\n"

        for time in sorted(result[date].keys()):
            available = result[date][time]["available"]
            status = f"{available} tables available" if available > 0 else "Fully booked"
            formatted_message += f"🕒 {time}: {status}\n"

        formatted_message += "\n"

    formatted_message += "To make a reservation, please let me know your preferred date and time.\n"

    return {
        "availability_data": result,
        "formatted_message": formatted_message
    }

@tool
def place_order(customer_name: str, items: str, total_price: float):
    """
    Place a food order.

    Args:
        customer_name: Name of the customer
        items: JSON string of items in format [{"id": 1, "name": "Item Name", "quantity": 2, "price": 12.99}, ...]
        total_price: Total price of the order

    Returns:
        Order confirmation details
    """
    db = get_db()
    items_dict = json.loads(items)

    order = create_order(db, customer_name, items_dict, total_price)

    if order:
        # Create order details for memory
        order_details = {
            "order_id": order.id,
            "customer_name": customer_name,
            "items": items_dict,
            "total_price": total_price,
            "timestamp": order.timestamp.isoformat() if hasattr(order, 'timestamp') else None
        }

        # Update the agent's memory if available
        frame = currentframe()
        while frame:
            if 'memory' in frame.f_locals:
                memory = frame.f_locals['memory']
                memory["current_order"] = order_details
                memory["order_history"].append(order_details)
                break
            frame = frame.f_back

        return {
            "success": True,
            "order_id": order.id,
            "order_details": order_details,
            "message": f"Order placed successfully for {customer_name}. Your order ID is {order.id}. You can view your order details in the Orders section of the navigation bar."
        }
    else:
        return {
            "success": False,
            "message": "Failed to place order. Please try again."
        }

@tool
def make_reservation(customer_name: str, date: str, time: str, party_size: int):
    """
    Make a table reservation.

    Args:
        customer_name: Name of the customer
        date: Date in format YYYY-MM-DD
        time: Time in format HH:MM AM/PM
        party_size: Number of people

    Returns:
        Reservation confirmation details
    """
    db = get_db()

    reservation = create_reservation(db, customer_name, date, time, party_size)

    if reservation:
        # Create reservation details for memory
        reservation_details = {
            "reservation_id": reservation.id,
            "customer_name": customer_name,
            "date": date,
            "time": time,
            "party_size": party_size,
            "timestamp": reservation.timestamp.isoformat() if hasattr(reservation, 'timestamp') else None
        }

        # Update the agent's memory if available
        frame = currentframe()
        while frame:
            if 'memory' in frame.f_locals:
                memory = frame.f_locals['memory']
                memory["current_reservation"] = reservation_details
                memory["reservation_history"].append(reservation_details)
                break
            frame = frame.f_back

        # Create a more detailed confirmation message
        people_text = "person" if party_size == 1 else "people"
        confirmation_message = (
            f"✅ Reservation Confirmed!\n\n"
            f"👤 Name: {customer_name}\n"
            f"📅 Date: {date}\n"
            f"🕒 Time: {time}\n"
            f"👥 Party Size: {party_size} {people_text}\n"
            f"🔢 Reservation ID: {reservation.id}\n\n"
            f"You can view your reservation details in the Reservations section of the navigation bar."
        )

        return {
            "success": True,
            "reservation_id": reservation.id,
            "reservation_details": reservation_details,
            "message": confirmation_message
        }
    else:
        return {
            "success": False,
            "message": f"❌ Sorry, no tables are available on {date} at {time} for a party of {party_size}.\n\nPlease try another date or time from the availability list, or consider a different party size."
        }

@tool
def get_order_history():
    """
    Get the customer's order history from memory.

    Returns:
        List of past orders or a message if no orders found
    """
    # Get the agent's memory if available
    frame = currentframe()
    while frame:
        if 'memory' in frame.f_locals:
            memory = frame.f_locals['memory']
            order_history = memory.get("order_history", [])

            if order_history:
                return {
                    "success": True,
                    "order_count": len(order_history),
                    "orders": order_history,
                    "message": f"Found {len(order_history)} order(s) in your history."
                }
            else:
                return {
                    "success": False,
                    "message": "You haven't placed any orders yet."
                }
        frame = frame.f_back

    # If memory not found
    return {
        "success": False,
        "message": "No order history available."
    }

@tool
def get_reservation_history():
    """
    Get the customer's reservation history from memory.

    Returns:
        List of past reservations or a message if no reservations found
    """
    # Get the agent's memory if available
    frame = currentframe()
    while frame:
        if 'memory' in frame.f_locals:
            memory = frame.f_locals['memory']
            reservation_history = memory.get("reservation_history", [])

            if reservation_history:
                return {
                    "success": True,
                    "reservation_count": len(reservation_history),
                    "reservations": reservation_history,
                    "message": f"Found {len(reservation_history)} reservation(s) in your history."
                }
            else:
                return {
                    "success": False,
                    "message": "You haven't made any reservations yet."
                }
        frame = frame.f_back

    # If memory not found
    return {
        "success": False,
        "message": "No reservation history available."
    }

@tool
def get_current_order():
    """
    Get the customer's current order from memory.

    Returns:
        Current order details or a message if no current order
    """
    # Get the agent's memory if available
    frame = currentframe()
    while frame:
        if 'memory' in frame.f_locals:
            memory = frame.f_locals['memory']
            current_order = memory.get("current_order")

            if current_order:
                return {
                    "success": True,
                    "order": current_order,
                    "message": f"Found your current order (ID: {current_order.get('order_id')})."
                }
            else:
                return {
                    "success": False,
                    "message": "You don't have any current order."
                }
        frame = frame.f_back

    # If memory not found
    return {
        "success": False,
        "message": "No current order available."
    }

@tool
def get_current_reservation():
    """
    Get the customer's current reservation from memory.

    Returns:
        Current reservation details or a message if no current reservation
    """
    # Get the agent's memory if available
    frame = currentframe()
    while frame:
        if 'memory' in frame.f_locals:
            memory = frame.f_locals['memory']
            current_reservation = memory.get("current_reservation")

            if current_reservation:
                return {
                    "success": True,
                    "reservation": current_reservation,
                    "message": f"Found your current reservation (ID: {current_reservation.get('reservation_id')})."
                }
            else:
                return {
                    "success": False,
                    "message": "You don't have any current reservation."
                }
        frame = frame.f_back

    # If memory not found
    return {
        "success": False,
        "message": "No current reservation available."
    }
