import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchInventory } from '../store/inventorySlice';

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
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-blue-600 border border-blue-700 p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">{getTimeOfDay()}, {user?.username || 'Chef'}!</h1>
                <p className="mb-4">Ready to cook something delicious today?</p>
                <Link to="/inventory" className="inline-block bg-white text-blue-600 px-4 py-2 font-bold hover:bg-gray-100">
                    Scan Ingredients
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 border border-gray-300">
                    <p className="text-gray-600 text-sm mb-1">Pantry Items</p>
                    <h3 className="text-2xl font-bold text-gray-800">{inventory.length}</h3>
                </div>

                <div className="bg-white p-4 border border-gray-300">
                    <p className="text-gray-600 text-sm mb-1">Saved Recipes</p>
                    <h3 className="text-2xl font-bold text-gray-800">0</h3>
                </div>

                <div className="bg-white p-4 border border-gray-300">
                    <p className="text-gray-600 text-sm mb-1">Total Cooks</p>
                    <h3 className="text-2xl font-bold text-gray-800">0</h3>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-3">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/recipes" className="bg-white p-4 border border-gray-300 hover:border-gray-400">
                        <h3 className="font-bold text-gray-900 mb-1">Find Recipes</h3>
                        <p className="text-sm text-gray-600">Browse recommendations based on your pantry</p>
                    </Link>

                    <Link to="/inventory" className="bg-white p-4 border border-gray-300 hover:border-gray-400">
                        <h3 className="font-bold text-gray-900 mb-1">Manage Pantry</h3>
                        <p className="text-sm text-gray-600">Add, remove, or scan new ingredients</p>
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-3">Recent Activity</h2>
                <div className="bg-white border border-gray-300 p-4">
                    <p className="text-gray-800 font-medium">Joined Recipe Platform</p>
                    <p className="text-sm text-gray-600">Welcome to your new kitchen assistant!</p>
                    <span className="text-xs text-gray-500 mt-1 block">Just now</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
