import React, { useState } from 'react';
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { useNavigate } from 'react-router-dom';

const ProfileSetupFreelancers = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        uid:'',
        username: '',
        name: '',
        email: '',
        skills:'',
        portfolio: '',
        location: '',
        pfp: ''
      });
      const handleFileUpload = (event) => {
         const file = event.target.files[0];
         if (file) {
          setFormData({
           ...formData,
           resume: file // Store the file in formData
          });
         }
        };
        
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        const currentUser = auth.currentUser; 
        const uid = currentUser.uid; 
        const uemail=currentUser.email; // Choose preferred field
        const newProfile = {
            ...formData,
            uid: uid,
            email: uemail, 
        };
        console.log("Form submitted:", formData);
        try {
            const response = await fetch('http://127.0.0.1:5000/api/freelancer-profile-setup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProfile),
                 // Send the new job with the client username
            });
            navigate('/freelancer-profile');
            if (!response.ok) {
                const errorText = await response.text(); // Get the error text
                console.error("Server error:", errorText);
                return;
            }

    
        // Handle the response as needed
      }catch (error) {
        console.error('Error submitting form:', error);
    }
    };
    return ( <>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Profile Setup</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="freelancerUsername">Username</label>
          <input
            type="text"
            id="freelancerUsername"
            name="freelancerUsername"
            value={formData.freelancerUsername}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="skills">Skills (Enter skills separated by a comma):</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="portfolio">Portfolio Link:</label>
          <input
            type="url"
            id="portfolio"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"

          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="industry">Resume</label>
          <input
            type="file"
            id="resume"
            name="resume"
            accept='.pdf, pdef'
            onChange={handleFileUpload}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="pfp">Profile Picture URL</label>
          <input
            type="url"
            id="pfp"
            name="pfp"
            value={formData.pfp}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
        >
          Submit Profile
        </button>
      </form>
    </div>
    </> );
}

 
export default ProfileSetupFreelancers;