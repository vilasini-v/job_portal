import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen = () => {
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userType === 'client') {
      navigate('/client-profile');
    } else if (userType === 'freelancer') {
      navigate('/freelancer-profile');
    } else {
      alert('Please select an option');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Welcome!</h2>
        <p className="mb-4 text-center">Please select if you are a client or freelancer:</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="userType"
                value="client"
                checked={userType === 'client'}
                onChange={(e) => setUserType(e.target.value)}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="ml-2">I am a Client</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="userType"
                value="freelancer"
                checked={userType === 'freelancer'}
                onChange={(e) => setUserType(e.target.value)}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="ml-2">I am a Freelancer</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeScreen;
