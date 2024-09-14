from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_jwt_extended import create_access_token, JWTManager
import datetime
import os

app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/*": {"origins": ["https://fruit-ai-appreciate-wealth-task.vercel.app"]}})

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
    data = request.get_json()
    faq = mongo.db.faqs.find_one({'_id': ObjectId(id)})

    if not faq:
        return jsonify({'message': 'FAQ not found'}), 404

    updated_faq = {
        'question': data.get('question', faq['question']),
        'answer': data.get('answer', faq['answer']),
        'image': data.get('image', faq.get('image', '')),
        'image_name': data.get('image_name', faq.get('image_name', ''))
    }
    mongo.db.faqs.update_one({'_id': ObjectId(id)}, {'$set': updated_faq})
    return jsonify({'message': 'FAQ updated successfully'}), 200

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
