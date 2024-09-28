import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Clear any existing errors

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect to the sign-in page after successful sign-up
      navigate("/signin"); // <== Here is where the redirect happens
    } catch (error) {
      setError(error.message); // Display error if something goes wrong
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <section className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
          <p className="text-gray-600">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="email-address" className="block text-gray-700">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Email address"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Create password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-gray-600 text-center">
          Already have an account?{" "}
          <NavLink to="/signin" className="text-indigo-600 hover:underline">
            Sign in
          </NavLink>
        </p>
      </section>
    </main>
  );
};

export default SignUp;
