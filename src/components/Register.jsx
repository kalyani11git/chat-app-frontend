import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('name', name);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await fetch('https://chat-app-backend-1qir.onrender.com/register', {
                method: 'POST',
                body: formData, // No need for Content-Type, browser sets it automatically for FormData
            });

            if (response.ok) {
                setSuccess('User registered successfully');
                setUsername('');
                setPassword('');
                setName('');
                setImage(null);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (err) {
            setError('Something went wrong');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
            <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-300 p-8 rounded-xl shadow-xl max-w-sm w-full">
                <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-lg">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    </div>
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
                    <div>
                        <label className="block text-lg">Profile Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white text-black"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
                    >
                        Register
                    </button>
                </form>
                {success && <p className="mt-4 text-green-500 text-center">{success}</p>}
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default Register;
