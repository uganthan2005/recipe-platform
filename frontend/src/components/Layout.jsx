import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { ChefHat, List, Utensils, Home as HomeIcon, User, LogOut, LogIn, Calendar, Users } from 'lucide-react';

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
        { path: '/', icon: <HomeIcon size={20} />, label: 'Home' },
        { path: '/dashboard', icon: <User size={20} />, label: 'Dashboard' },
        { path: '/inventory', icon: <List size={20} />, label: 'Inventory' },
        { path: '/recipes', icon: <Utensils size={20} />, label: 'Recipes' },
        { path: '/meal-planner', icon: <Calendar size={20} />, label: 'Meal Plan' },
        { path: '/social', icon: <Users size={20} />, label: 'Social' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <ChefHat className="text-orange-500 mr-2" size={28} />
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">KitchenMate</h1>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${location.pathname === item.path
                                        ? 'border-orange-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-red-600"
                                >
                                    <LogOut className="mr-2" size={20} /> Logout
                                </button>
                            ) : (
                                <Link to="/login" className="flex items-center px-1 pt-1 text-sm font-medium text-orange-600 hover:text-orange-500">
                                    <LogIn className="mr-2" size={20} /> Login
                                </Link>
                            )}
                        </nav>
                        {/* Mobile Menu Button would go here */}
                    </div>
                </div>
            </header>
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 pb-safe">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center p-1 ${location.pathname === item.path ? 'text-orange-500' : 'text-gray-400'
                            }`}
                    >
                        {item.icon}
                        <span className="text-xs mt-1">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Layout;
