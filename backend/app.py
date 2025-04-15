from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sys

# Add the parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.database.db import init_db, get_db, get_menu_items, get_table_availability, get_orders, get_reservations, update_order, update_reservation
from backend.agent.agent import run_agent

# Store chat histories and agent memory in memory (in a real app, this would be in a database)
chat_histories = {}
agent_memories = {}

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app)

@app.route('/')
def index():
    return jsonify({"message": "Restaurant Management API is running"})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message', '')
    session_id = data.get('session_id', 'default')

    # Get chat history and memory for this session
    if session_id not in chat_histories:
        chat_histories[session_id] = []

    if session_id not in agent_memories:
        agent_memories[session_id] = {
            "current_order": None,
            "order_history": [],
            "current_reservation": None,
            "reservation_history": []
        }

    # Run the agent
    result = run_agent(user_input, chat_histories[session_id], agent_memories[session_id])

    # Update chat history and memory
    chat_histories[session_id] = result['chat_history']
    agent_memories[session_id] = result['memory']

    return jsonify({
        'response': result['response'],
        'session_id': session_id
    })

@app.route('/api/menu', methods=['GET'])
def menu():
    db = get_db()
    menu_items = get_menu_items(db)
    return jsonify([item.to_dict() for item in menu_items])

@app.route('/api/availability', methods=['GET'])
def availability():
    date = request.args.get('date')
    db = get_db()
    availability = get_table_availability(db, date)

    result = {}
    for item in availability:
        if item.date not in result:
            result[item.date] = {}

        result[item.date][item.time] = {"available": item.available}

    return jsonify(result)

@app.route('/api/orders', methods=['GET'])
def orders():
    db = get_db()
    orders_list = get_orders(db)
    return jsonify([order.to_dict() for order in orders_list])

@app.route('/api/orders/<int:order_id>', methods=['PUT'])
def update_order_endpoint(order_id):
    db = get_db()
    data = request.json

    # Extract data from request
    customer_name = data.get('customer_name')
    items = data.get('items')
    total_price = data.get('total_price')

    # Update the order
    updated_order = update_order(db, order_id, customer_name, items, total_price)

    if updated_order:
        return jsonify({
            'success': True,
            'message': 'Order updated successfully',
            'order': updated_order.to_dict()
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Order not found or could not be updated'
        }), 404

@app.route('/api/reservations', methods=['GET'])
def reservations():
    db = get_db()
    reservations_list = get_reservations(db)
    return jsonify([reservation.to_dict() for reservation in reservations_list])

@app.route('/api/reservations/<int:reservation_id>', methods=['PUT'])
def update_reservation_endpoint(reservation_id):
    db = get_db()
    data = request.json

    # Extract data from request
    customer_name = data.get('customer_name')
    date = data.get('date')
    time = data.get('time')
    party_size = data.get('party_size')

    # Update the reservation
    updated_reservation = update_reservation(db, reservation_id, customer_name, date, time, party_size)

    if updated_reservation:
        return jsonify({
            'success': True,
            'message': 'Reservation updated successfully',
            'reservation': updated_reservation.to_dict()
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Reservation not found or could not be updated'
        }), 404

# Initialize database
with app.app_context():
    init_db()

if __name__ == '__main__':
    app.run(debug=True)
