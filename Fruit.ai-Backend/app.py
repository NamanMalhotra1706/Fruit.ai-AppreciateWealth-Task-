from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_jwt_extended import create_access_token, JWTManager
import datetime
import os
import google.generativeai as genai

app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/*": {"origins": ["https://fruit-ai-appreciate-wealth-task.vercel.app"]}})

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "CORS is working!"})




app.config['JWT_SECRET_KEY'] = 'your_secret_key_here'
jwt = JWTManager(app)

# Configure MongoDB
app.config['MONGO_URI'] = 'mongodb+srv://naman0913be21:uMUXSQfVQ4PrnDsb@cluster0.t1wvo.mongodb.net/appreciateWealth?retryWrites=true&w=majority'
mongo = PyMongo(app)

# Helper function to serialize data from MongoDB
def serialize_faq(faq):
    return {
        '_id': str(faq['_id']),
        'question': faq['question'],
        'answer': faq['answer'],
        'image': faq.get('image', ''),
        'image_name': faq.get('image_name', '')
    }

genai.configure(api_key="AIzaSyAMttgd1TbM-6Ourlu-rKjZClcncbpG0NA")

# Initialize the Generative Model
model = genai.GenerativeModel("gemini-1.5-flash")

# Sample data for fruits
fruits = {
    "apple": {"name": "Apple", "description": "A sweet, crunchy fruit.", "image": "images/apple.jpg"},
    "banana": {"name": "Banana", "description": "A soft, yellow fruit.", "image": "images/banana.jpg"},
    # Add more fruits as needed
}

# Global variable to store selected fruit
selected_fruit = None

@app.route('/fruits', methods=['GET'])
def get_fruits():
    return jsonify(fruits)

@app.route('/fruit/<fruit_name>', methods=['GET'])
def get_fruit(fruit_name):
    global selected_fruit
    fruit = fruits.get(fruit_name)

    if fruit:
        selected_fruit = fruit
        print(f"Selected fruit: {selected_fruit}")
        return jsonify(fruit)
    return jsonify({"error": "Fruit not found"}), 404

@app.route('/chat', methods=['POST'])
def gemini_chat():
    data = request.json
    message = data.get('message')
    selected_fruit_name = data.get('selectedFruit')
    history = data.get('history', [])  # Fetch history if available

    # If there is a message and either a selected fruit or history
    if message:
        # Check if a fruit is selected in the request
        if selected_fruit_name:
            selected_fruit = fruits.get(selected_fruit_name.lower())  # Get the fruit
            if selected_fruit:
                # If a new fruit is selected, prepend its info to the conversation history
                fruit_info = f"You selected {selected_fruit['name']}: {selected_fruit['description']}."
                history.append({"role": "system", "content": fruit_info})

        # Add the user's latest question to the history
        history.append({"role": "user", "content": message})

        try:
            # Build the conversation context by joining the historical messages
            conversation_history = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history])

            # Generate response from the model
            response = model.generate_content(conversation_history)
            
            # Append the model's response to the history
            history.append({"role": "assistant", "content": response.text})

            return jsonify({"response": response.text, "updated_history": history})
        except Exception as e:
            print(f"Error in /chat route: {e}")
            return jsonify({"error": "Something went wrong!"}), 500

    return jsonify({"error": "No message received"}), 400

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'message': 'Name, email, and password are required'}), 400

    existing_user = mongo.db.users.find_one({'email': email})
    if existing_user:
        return jsonify({'message': 'User already exists'}), 400

    password_hash = generate_password_hash(password)
    new_user = {'name': name, 'email': email, 'password_hash': password_hash}
    mongo.db.users.insert_one(new_user)

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    user = mongo.db.users.find_one({'email': email})
    if user and check_password_hash(user['password_hash'], password):
        token = create_access_token(identity=email, expires_delta=datetime.timedelta(minutes=30))
        return jsonify({'token': token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/faqs', methods=['GET'])
def get_all_faqs():
    faqs = mongo.db.faqs.find()
    return jsonify([serialize_faq(faq) for faq in faqs]), 200

@app.route('/faqs/<id>', methods=['GET'])
def get_faq_by_id(id):
    faq = mongo.db.faqs.find_one({'_id': ObjectId(id)})
    if faq:
        return jsonify(serialize_faq(faq)), 200
    else:
        return jsonify({'message': 'FAQ not found'}), 404

@app.route('/faqs', methods=['POST'])
def create_faq():
    data = request.get_json()
    question = data.get('question')
    answer = data.get('answer')
    image = data.get('image', '')
    image_name = data.get('image_name', '')

    if not question or not answer:
        return jsonify({'message': 'Question and answer are required'}), 400

    new_faq = {
        'question': question,
        'answer': answer,
        'image': image,
        'image_name': image_name
    }
    mongo.db.faqs.insert_one(new_faq)
    return jsonify({'message': 'FAQ created successfully'}), 201

@app.route('/faqs/<id>', methods=['PUT'])
def update_faq(id):
    try:
        data = request.get_json()
        print(f"Updating FAQ with ID: {id} and data: {data}")
        faq = mongo.db.faqs.find_one({'_id': ObjectId(id)})
        
        if not faq:
            return jsonify({'message': 'FAQ not found'}), 404
        
        updated_faq = {
            'answer': data.get('answer', faq['answer']),
            'question': data.get('question', faq['question']),
            'image': data.get('image', faq.get('image', '')),
            'image_name': data.get('image_name', faq.get('image_name', '')),
        }
        
        mongo.db.faqs.update_one({'_id': ObjectId(id)}, {'$set': updated_faq})
        
        return jsonify(serialize_faq(updated_faq)), 200
    except Exception as e:
        print(f"Error in update_faq: {e}")
        return jsonify({'message': 'Internal server error'}), 500

## Delete
@app.route('/faqs/<id>', methods=['DELETE'])
def delete_faq(id):
    faq = mongo.db.faqs.find_one({'_id': ObjectId(id)})
    if faq:
        mongo.db.faqs.delete_one({'_id': ObjectId(id)})
        return jsonify({'message': 'FAQ deleted successfully'}), 200
    else:
        return jsonify({'message': 'FAQ not found'}), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
