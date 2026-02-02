import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { UserPlus, UserMinus, ChefHat } from 'lucide-react';
import PostCard from '../components/PostCard';

const SocialPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [feed, setFeed] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        if (user?.id) {
            fetchFeed();
            fetchSuggestions();
            // In a real app, we'd fetch who we follow to update button states
            // For now assuming we can derive it or simplistic toggle
        }
    }, [user]);

    const fetchFeed = async () => {
        try {
            const res = await axios.get(`/api/social/feed/${user.id}`);
            setFeed(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSuggestions = async () => {
        try {
            const res = await axios.get(`/api/social/suggestions/${user.id}`);
            setSuggestions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFollow = async (targetId) => {
        try {
            await axios.post(`/api/social/follow/${targetId}`, { currentUserId: user.id });
            alert("Followed!");
            fetchSuggestions(); // Refresh list
            fetchFeed();
        } catch (err) {
            alert("Error following user");
        }
    };

    return (
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Feed Section */}
            <div className="flex-1 space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Discovery Feed</h1>
                {feed.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-400">
                        <ChefHat size={48} className="mx-auto mb-2" />
                        <p>Loading the tastiest recipes for you...</p>
                    </div>
                ) : (
                    feed.map(recipe => (
                        <PostCard key={recipe._id} recipe={recipe} />
                    ))
                )}
            </div>

            {/* Sidebar: Suggestions */}
            <div className="md:w-1/3 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Chefs to Follow</h2>
                    <ul className="space-y-4">
                        {suggestions.map(s => (
                            <li key={s._id} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                        {s.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{s.username}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleFollow(s._id)}
                                    className="p-2 bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100"
                                >
                                    <UserPlus size={18} />
                                </button>
                            </li>
                        ))}
                        {suggestions.length === 0 && <p className="text-gray-400 text-sm">No new suggestions.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SocialPage;
