import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // State for success/error message
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

        try {
            const response = await fetch('https://chat-app-backend-1qir.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);  // Store token in localStorage
                localStorage.setItem('username', username); // Store username in localStorage
                setIsAuthenticated(true);  // Update authentication state in App.js
                setMessage({ text: 'Login successful! Redirecting...', type: 'success' });

                setTimeout(() => {
                    navigate('/chat');  // Navigate to the chat page after 1.5 seconds
                }, 1500);
            } else {
                const errorMessage = await response.text();
                setMessage({ text: errorMessage, type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'Something went wrong', type: 'error' });
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
            <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-300 p-8 rounded-xl shadow-xl max-w-sm w-full">
                <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-lg">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    </div>
                    <div>
                        <label className="block text-lg">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
                    >
                        Login
                    </button>
                </form>
                
                {/* Display success or error message */}
                {message && (
                    <p className={`mt-4 text-center ${message.type === 'success' ? 'text-green-400' : 'text-red-500'}`}>
                        {message.text}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;
