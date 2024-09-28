from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from flask_restful import Api, Resource, reqparse

app = Flask(__name__)
CORS(app)  # Enable CORS to allow communication between React and Flask
api = Api(app)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client['jobPortal']  # Database name
jobs_collection = db['jobs']  # Collection for jobs
profiles_collection = db['profiles']  # Collection for profiles

# API to add a job
@app.route('/api/jobs', methods=['POST'])
def add_job():
    job_data = request.json
    job_with_client = {
        "title": job_data.get('title'),
        "description": job_data.get('description'),
        "salary": job_data.get('salary'),
        "location": job_data.get('location'),
        "clientUsername": job_data.get('clientUsername')  # Store client identifier
    }

    jobs_collection.insert_one(job_with_client)  # Insert job data into MongoDB
    return jsonify({"message": "Job added successfully!"}), 201

# API to get all jobs
@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    jobs = list(jobs_collection.find({}, {"_id": 0}))  # Retrieve jobs without MongoDB's _id field
    return jsonify(jobs), 200

# API to get jobs by client username
@app.route('/api/client-jobs/<username>', methods=['GET'])
def get_jobs_by_client(username):
    jobs = list(jobs_collection.find({"clientUsername": username}, {"_id": 0}))
    return jsonify(jobs), 200

#API to get profiles by their uid
@app.route('/api/client-profile/<username>', methods=['GET'])
def get_profile_info(username):
    data=list(profiles_collection.find({"uid": username}, {"_id":0}))
    return jsonify(data[0]), 200

@app.route('/api/check-profile', methods=['POST'])
def check_profile():
    data=request.get_json()
    user_id=data.get('uid') # Make sure this matches your request
    user_profile = profiles_collection.find_one({"uid": user_id})
    if user_profile:
        return jsonify({"profileCompleted": True}), 200
    else:
        return jsonify({"profileCompleted": False}), 200

@app.route('/api/profile-setup', methods=['POST'])  
def set_profile():
    profile_data = request.json
    profiles = {
        "uid": profile_data.get('uid'),  # Ensure you store uid to identify profiles
        "clientUsername": profile_data.get('clientUsername'),
        "name": profile_data.get('name'),
        "email": profile_data.get('email'),
        "companyName": profile_data.get('companyName'),
        "location": profile_data.get('location'),
        "companyWebsite": profile_data.get("companyWebsite"),
        "industry": profile_data.get("industry"),
        "pfp": profile_data.get("pfp"),
    }
    existing_profile = profiles_collection.find_one({"uid": profile_data.get("uid")})
    if existing_profile:
        return jsonify({"message": "Profile already exists!"}), 400
    else:
        profiles_collection.insert_one(profiles)
    return jsonify({"message": "Profile added successfully"}), 201

@app.route('/api/freelancer-profile/<username>', methods=['GET'])
def get_profile_info_freelancer(username):
    data=list(profiles_collection.find({"uid": username}, {"_id":0}))
    return jsonify(data[0]), 200

@app.route('/api/profile-setup-c', methods=['POST'])
def set_profile_freelacer():
    profile_data = request.json
    profiles = {
        "uid": profile_data.get('uid'),  # Ensure you store uid to identify profiles
        "clientUsername": profile_data.get('clientUsername'),
        "name": profile_data.get('name'),
        "email": profile_data.get('email'),
        "companyName": profile_data.get('companyName'),
        "location": profile_data.get('location'),
        "companyWebsite": profile_data.get("companyWebsite"),
        "industry": profile_data.get("industry"),
        "pfp": profile_data.get("pfp"),
    }
    existing_profile = profiles_collection.find_one({"uid": profile_data.get("uid")})
    if existing_profile:
        return jsonify({"message": "Profile already exists!"}), 400
    else:
        profiles_collection.insert_one(profiles)
    return jsonify({"message": "Profile added successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)
