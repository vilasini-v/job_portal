import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // adjust path if necessary

const SignIn = () => {
    const { currentUser, loginWithGoogle, handleSignIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const signUpNavigation = () => {
        navigate('/signup');
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await handleSignIn(email, password);
        } catch (error) {
            setError('Failed to sign in with email and password');
            console.error('Error signing in:', error);
        }
    };

    // Check authentication status and navigate to profile
    useEffect(() => {
        if (currentUser) {
            navigate('/profile');
        }
    }, [currentUser, navigate]);

    const handleGoogleSignIn = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Sign In
                    </button>
                </form>

                <div className="my-4 text-center text-gray-500">OR</div>
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Sign In with Google
                </button>

                <p className="mt-4 text-center">
                    Not a member? <span className="text-blue-500 cursor-pointer" onClick={signUpNavigation}>Sign Up</span>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
