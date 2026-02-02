import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Layout = ({ children }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navItems = [
        { path: '/inventory', label: 'Inventory' },
        { path: '/recipes', label: 'Recipes' },
        { path: '/meal-planner', label: 'Meal Plan' },
        { path: '/social', label: 'Social' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-white border-b border-gray-300">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-14 items-center">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-gray-900">Recipe Platform</h1>
                        </div>

                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-3 py-1 text-sm font-medium ${location.pathname === item.path
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="h-6 w-px bg-gray-300 mx-2"></div>
                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-3 py-1 text-sm font-medium bg-gray-800 text-white hover:bg-gray-700"
                                >
                                    Login
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
                <div className="bg-white border border-gray-300 p-6 min-h-[calc(100vh-10rem)]">
                    {children}
                </div>
            </main>

            <footer className="bg-white border-t border-gray-300 py-4">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-xs text-gray-500">
                        © 2026 Recipe Platform
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
