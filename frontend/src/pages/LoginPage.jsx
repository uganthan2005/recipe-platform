import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/login', formData);
            dispatch(login({ user: res.data.user, token: res.data.token }));
            navigate('/recipes');
        } catch (err) {
            if (err.code === 'ERR_NETWORK') {
                setError('Network error: Is the backend server running and its IP whitelisted?');
            } else {
                setError(err.response?.data?.error || 'Login failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white p-8 border border-gray-300">
                <div>
                    <h2 className="text-center text-2xl font-bold text-gray-900">
                        Login
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to your account
                    </p>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 p-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 border border-gray-800 text-sm font-bold text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <Link to="/register" className="text-sm text-blue-600 hover:underline">
                            Need an account? Register here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
