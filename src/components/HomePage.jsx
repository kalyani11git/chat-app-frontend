import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
            <div className="text-center p-6 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-300 rounded-xl shadow-lg max-w-lg w-full">
                <h1 className="text-5xl font-bold mb-6">Welcome to Our App</h1>
                <p className="text-lg mb-8">A place to connect and share ideas. Get started by logging in or registering!</p>
                <div className="flex justify-center gap-6">
                    <Link to="/login">
                        <button className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
                            Login
                        </button>
                    </Link>
                    <Link to="/register">
                        <button className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
                            Register
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
