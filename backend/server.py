from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from flask_restful import Api, Resource, reqparse
from bson import ObjectId
from gridfs import GridFS
from pdf2image import convert_from_bytes
import hashlib
import uuid
from findCompatibility import calculate_compatibility

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)
# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client['jobPortal']  # Database name
jobs_collection = db['jobs']  # Collection for jobs
profiles_freelancers = db['freelancer_profiles']  # Collection for freelancers profiles
profiles_clients = db['client_profiles'] #collection for client profiles
applications_collection = db["applications"]
pdfs=db["resumes"]
fs = GridFS(db)

def calculate_hash(content):
    md5 = hashlib.md5()
    md5.update(content)
    return md5.hexdigest()

# API to add a job
@app.route('/api/jobs', methods=['POST'])
def add_job():
    job_data = request.json
    job_with_client = {
        "Jobid": str(uuid.uuid4()),
        "title": job_data.get('title'),
        "description": job_data.get('description'),
        "salary": job_data.get('salary'),
        "location": job_data.get('location'),
        "clientUsername": job_data.get('clientUsername'),
        "tags":job_data.get('tags')  # Store client identifier
    }

    jobs_collection.insert_one(job_with_client)  # Insert job data into MongoDB
    return jsonify({"message": "Job added successfully!"}), 201

@app.route('/api/apply/<freelancerID>', methods=['GET'])
def get_job_by_id(freelancerID):
    job=list(applications_collection.find({"applicantid": freelancerID}, {"_id":0}))
    return jsonify(job),200

#api route to apply for a job
@app.route('/api/apply', methods=['POST'])
def apply_job():
    job_data = request.json
    jobid = job_data.get('jobid')
    job=jobs_collection.find_one({'Jobid':jobid},{'title': 1, 'description': 1, '_id': 0})
    job_skills = list(jobs_collection.find({"Jobid": jobid}, {"_id": 0, "tags": 1}))
    if not job_skills:
        return jsonify({'error': 'Job not found'}), 404
    job_skills = job_skills[0].get('tags', [])
    
    # Fetch user skills
    user_skills = list(profiles_freelancers.find({"email": job_data.get("applicantEmail")}, {"_id": 0, "skills": 1}))
    if not user_skills:
        return jsonify({'error': 'User not found'}), 404
    user_skills = user_skills[0].get('skills', [])
    
    user_skills = list(user_skills.split(','))
    job_skills = list(job_skills.split(','))
        
    compatibility_percentage, matching_skills = calculate_compatibility(job_skills, user_skills)
    apply_job={
        "applicationID": str(uuid.uuid4()),
        'title':job.get("title"),
        'desc':job.get("description"),
        "applicantid": job_data.get("applicantID"),
        "emailid": job_data.get("applicantEmail"),
        "Jobid":job_data.get('jobid'),
        "resume": job_data.get('resume'),
        "quote": job_data.get("quote"),
        "status": "No Result",
        'compatibilityPercentage': compatibility_percentage,
        "matchingSkills" : list(matching_skills)
    }
    applications_collection.insert_one(apply_job)  # Insert job data into MongoDB
    
    return jsonify({"message": "application added successfully!"}), 201

@app.route('/api/applications/<applicationID>', methods=['PUT'])
def update_application_status(applicationID):
    data = request.get_json()
    status = data.get('status')

    if not status:
        return jsonify({"error": "Status is required"}), 400

    try:
        # Update the application status in MongoDB
        result = applications_collection.update_one(
            {"applicationID": applicationID},  # Query filter
            {"$set": {"status": status}}  # Update operation
        )

        if result.matched_count == 0:
            return jsonify({"error": "Application not found"}), 404

        return jsonify({"message": "Status updated successfully"}), 200
    except Exception as e:
        print(f"Error updating application status: {e}")
        return jsonify({"error": "An error occurred"}), 500
# api to get all the applications for a job (client side)
@app.route('/api/jobs/<jobid>', methods=['GET'])
def get_applications(jobid):
    print("Received jobid:", jobid, "Type:", type(jobid))
    applications = list(applications_collection.find({'Jobid': jobid}, {"_id":0}))
    return jsonify(applications),200

# API to get all jobs (freelancer side)
@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    jobs = list(jobs_collection.find({}, {"_id": 0}))
    return jsonify(jobs), 200

# API to get jobs by client username
@app.route('/api/client-jobs/<username>', methods=['GET'])
def get_jobs_by_client(username):
    jobs = list(jobs_collection.find({"clientUsername": username}, {"_id": 0}))
    return jsonify(jobs), 200

@app.route('/api/check-profile-clients', methods=['POST'])
def check_profile():
    data=request.get_json()
    user_id=data.get('uid') # Make sure this matches your request
    user_profile = profiles_clients.find_one({"uid": user_id})
    if user_profile:
        return jsonify({"profileCompleted": True}), 200
    else:
        return jsonify({"profileCompleted": False}), 200


@app.route('/api/check-profile-freelancers', methods=['POST'])
def check_profile_freelancers():
    data=request.get_json()
    user_id=data.get('uid') # Make sure this matches your request
    user_profile = profiles_freelancers.find_one({"uid": user_id})
    if user_profile:
        return jsonify({"profileCompleted": True}), 200
    else:
        return jsonify({"profileCompleted": False}), 200

@app.route('/api/client-profile-setup', methods=['POST'])  
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
    existing_profile = profiles_clients.find_one({"uid": profile_data.get("uid")})
    if existing_profile:
        return jsonify({"message": "Profile already exists!"}), 400
    else:
        profiles_clients.insert_one(profiles)
    return jsonify({"message": "Profile added successfully"}), 201

@app.route('/api/client-profile/<username>', methods=['GET'])
def get_profile_info_client(username):
    data=list(profiles_clients.find({"uid": username}, {"_id":0}))
    return jsonify(data[0]), 200

@app.route('/api/freelancer-profile/<username>', methods=['GET'])
def get_profile_info_freelancer(username):
    data=list(profiles_freelancers.find({"uid": username}, {"_id":0}))
    return jsonify(data[0]), 200

@app.route('/api/freelancer-info/<emailid>', methods=['GET'])
def get_profile_info_freelancer_with_email(emailid):
    data=list(profiles_freelancers.find({"email": emailid}, {"_id":0}))
    return jsonify(data[0]), 200

@app.route('/api/freelancer-profile-setup', methods=['POST'])
def set_profile_freelacer():
    profile_data = request.json
    
    profiles = {
    "uid": profile_data.get('uid'), # Ensure you store uid to identify profiles
    "freelancerUsername": profile_data.get('freelancerUsername'),
    "name": profile_data.get('name'),
    "email": profile_data.get('email'),
    "skills": profile_data.get('skills'),
    "portfolio": profile_data.get('portfolio'),
    "location": profile_data.get('location'),
    "resume": profile_data.get('resume'),
    "pfp": profile_data.get("pfp")
    }
    existing_profile = profiles_freelancers.find_one({"uid": profile_data.get("uid")})
    if existing_profile:
        return jsonify({"message": "Profile already exists!"}), 400
    else:
        profiles_freelancers.insert_one(profiles)
    return jsonify({"message": "Profile added successfully"}), 201
@app.route('/api/compatibility', methods=['POST'])
def compatibility():
    data = request.get_json()
    jobid = data.get('job_id')
    useremail = data.get('applicant_email')
    application_id = data.get('application_id')
    
    print(jobid)
    print(useremail)
    
    # Fetch job skills (tags)
    job_skills = list(jobs_collection.find({"Jobid": jobid}, {"_id": 0, "tags": 1}))
    if not job_skills:
        return jsonify({'error': 'Job not found'}), 404
    job_skills = job_skills[0].get('tags', [])
    
    # Fetch user skills
    user_skills = list(profiles_freelancers.find({"email": useremail}, {"_id": 0, "skills": 1}))
    if not user_skills:
        return jsonify({'error': 'User not found'}), 404
    user_skills = user_skills[0].get('skills', [])
    
    user_skills = list(user_skills.split(','))
    job_skills = list(job_skills.split(','))
    
    print("Job Skills:", job_skills)
    print("User Skills:", user_skills)
    
    compatibility_percentage, matching_skills = calculate_compatibility(job_skills, user_skills)
    
    # Find the application record and update it
    application_record = applications_collection.find_one({'applicationID': application_id})
    if application_record:
        application_record['compatibility_percentage'] = compatibility_percentage
        application_record['matching_skills'] = list(matching_skills)  # Convert matching_skills to a list
        applications_collection.update_one(
            {'applicationID': application_id},
            {'$set': application_record}
        )
    else:
        return jsonify({'error': 'Application not found'}), 404
    
    print(compatibility_percentage)
    print(matching_skills)
    return jsonify({
        'compatibility_percentage': compatibility_percentage,
        'matching_skills': list(matching_skills)  # Convert matching_skills to a list
    })
if __name__ == '__main__':
    app.run(debug=True)
