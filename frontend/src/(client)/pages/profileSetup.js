import React, { useState } from 'react';
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { useNavigate } from 'react-router-dom';

const ProfileSetupClients = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientUsername: '', // Added this field
    username: '',
    name: '',
    companyName: '',
    location: '',
    compWebsite: '',
    industry: '',
    pfp: ''
   });
  
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
    if (!currentUser) {
      console.error('No user is signed in.');
      return;
    }
    const uid = currentUser.uid; 
    const uemail = currentUser.email; 
    const newProfile = {
      ...formData,
      uid,
      email: uemail, // Add client info
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/api/client-profile-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProfile),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get the error text
        console.error("Server error:", errorText);
        return;
      }

      navigate('/profile');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
   <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
    <h2 className="text-2xl font-semibold text-center mb-6">Profile Setup</h2>

    <div className="mb-4">
     <label className="block text-gray-700 mb-2" htmlFor="clientUsername">Client Username</label>
     <input
      type="text"
      id="clientUsername"
      name="clientUsername"
      value={formData.clientUsername}
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
     <label className="block text-gray-700 mb-2" htmlFor="companyName">Company Name</label>
     <input
      type="text"
      id="companyName"
      name="companyName"
      value={formData.companyName}
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
     <label className="block text-gray-700 mb-2" htmlFor="compWebsite">Company Website</label>
     <input
      type="url"
      id="compWebsite"
      name="compWebsite"
      value={formData.compWebsite}
      onChange={handleChange}
      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
     />
    </div>

    <div className="mb-4">
     <label className="block text-gray-700 mb-2" htmlFor="industry">Industry</label>
     <input
      type="text"
      id="industry"
      name="industry"
      value={formData.industry}
      onChange={handleChange}
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
  );
}

export default ProfileSetupClients;
