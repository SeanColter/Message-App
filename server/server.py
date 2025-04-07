from flask import Flask, request, jsonify
import csv
import os

users_list = [
    {"userID": 1, "username": "admin", "role": "admin"},
    {"userID": 2, "username": "boss", "role": "admin"},
    {"userID": 3, "username": "user", "role": "user"},
    {"userID": 4, "username": "viewer", "role": "user"},
]

def get_user_by_name(username):
    """Retrieve the user based on their username."""
    for user in users_list:
        if user['username'] == username:
            return user
    return None

def get_role_by_userID(userID):
    """Retrieve the user's role based on their userID."""
    for user in users_list:
        if user['userID'] == userID:
            return user['role']
    return None

app = Flask(__name__)
CSV_FILE = 'messages.csv'

# Initialize the CSV file if it doesn't exist
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['id', 'userID', 'message'])  # Create the header row

def get_next_id():
    """Generate the next ID based on the rows in the CSV file."""
    try:
        with open(CSV_FILE, mode='r') as file:
            reader = csv.DictReader(file)
            rows = list(reader)
            if rows:
                return int(rows[-1]['id']) + 1  # Increment the last ID
            else:
                return 1  # Start at 1 if no rows exist
    except Exception:
        return 1  # Default to 1 in case of errors

# Basic allow all CORS handling for 
@app.after_request
def add_cors_headers(response):
    """Add CORS headers to allow all origins."""
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


@app.route('/messages', methods=['GET'])
def get_messages():
    """Retrieve all messages."""
    messages = []
    with open(CSV_FILE, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            messages.append({
                "id": int(row["id"]),
                "userID": int(row["userID"]),
                "message": row["message"]
            })

    return jsonify(messages), 200

@app.route('/messages', methods=['POST'])
def create_message():
    """Create a new message."""
    user_id = int(request.headers.get('Authorization'))  # Get userId from headers

    if not user_id:
        return jsonify({"error": "Missing Authorization header"}), 400

    role = get_role_by_userID(user_id)
    if role == 'admin':
        new_message = request.json.get('message')  # Only expecting 'message' in body
        if not new_message:
            return jsonify({"error": "Missing message in request body"}), 400
        new_id = get_next_id()  # Auto-generate the next ID
        with open(CSV_FILE, mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([new_id, user_id, new_message])

        return jsonify({"id": new_id, "userID": user_id, "message": new_message}), 201
    else:
        return jsonify({"error": "Insufficient permissions"}), 403

@app.route('/login', methods=['POST'])
def login():
    """Login route to authenticate users."""
    credentials = request.json
    username = credentials.get('username')
    password = credentials.get('password')

    if username == password:
        user = get_user_by_name(username)
        if not user:
            return jsonify({"error": "User not found"}), 404

        if user["role"] == 'admin':
            # Generate an admin "token" if admin role
            return jsonify({"permissions": "full", "id": user['userID']}), 200
        elif user["role"] == 'user':
            # Generate a less-privileged "token" if not admin role
            return jsonify({"permissions": "limited", "id": user['userID']}), 200

    return jsonify({"error": "Invalid credentials"}), 401


if __name__ == '__main__':
    app.run(debug=True)
