import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('/api/auth/signup', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white p-8 border border-gray-300">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Start your cooking journey
                    </p>
                </div>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                    <div className="space-y-3">
                        <div>
                            <input
                                type="text"
                                required
                                className="block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                required
                                className="block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-gray-800 text-sm font-bold text-white bg-gray-800 hover:bg-gray-700"
                    >
                        Create Account
                    </button>
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
