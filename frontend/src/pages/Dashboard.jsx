import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchInventory } from '../store/inventorySlice';
import { LayoutDashboard, ShoppingBag, Utensils, ChefHat, ArrowRight, Scan, Heart, Clock } from 'lucide-react';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items: inventory, status } = useSelector((state) => state.inventory);

    useEffect(() => {
        if (user?.id && status === 'idle') {
            dispatch(fetchInventory(user.id));
        }
    }, [dispatch, user, status]);

    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{getTimeOfDay()}, {user?.username || 'Chef'}! 👨‍🍳</h1>
                        <p className="text-orange-100 opacity-90">Ready to cook something delicious today?</p>
                    </div>
                    <Link to="/inventory" className="bg-white text-orange-600 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-orange-50 transition flex items-center gap-2">
                        <Scan size={20} /> Scan Ingredients
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Pantry Items</p>
                        <h3 className="text-3xl font-bold text-gray-800">{inventory.length}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                        <ShoppingBag size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Saved Recipes</p>
                        <h3 className="text-3xl font-bold text-gray-800">0</h3>
                    </div>
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                        <Heart size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Total Cooks</p>
                        <h3 className="text-3xl font-bold text-gray-800">0</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                        <ChefHat size={24} />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/recipes" className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition border-l-4 border-l-orange-500">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                                    <Utensils size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition">Find Recipes</h3>
                                    <p className="text-sm text-gray-500">Browse recommendations based on your pantry</p>
                                </div>
                            </div>
                            <ArrowRight className="text-gray-300 group-hover:text-orange-500 transition" />
                        </div>
                    </Link>

                    <Link to="/inventory" className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition border-l-4 border-l-blue-500">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                                    <LayoutDashboard size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">Manage Pantry</h3>
                                    <p className="text-sm text-gray-500">Add, remove, or scan new ingredients</p>
                                </div>
                            </div>
                            <ArrowRight className="text-gray-300 group-hover:text-blue-500 transition" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Activity Mockup */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                            <Clock size={16} />
                        </div>
                        <div>
                            <p className="text-gray-800 font-medium">Joined Kitchen Companion</p>
                            <p className="text-sm text-gray-500">Welcome to your new kitchen assistant!</p>
                            <span className="text-xs text-gray-400 mt-1 block">Just now</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
