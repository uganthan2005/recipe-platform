import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PostCard from '../components/PostCard';

const SocialPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [feed, setFeed] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchFeed();
            fetchSuggestions();
        }
    }, [user]);

    const fetchFeed = async () => {
        try {
            const res = await axios.get(`/api/social/feed/${user.id}`);
            setFeed(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
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
            fetchSuggestions();
            fetchFeed();
        } catch (err) {
            alert("Error following user");
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Feed Section */}
            <div className="flex-1 space-y-4">
                <h1 className="text-2xl font-bold text-gray-800">Discovery Feed</h1>
                {loading ? (
                    <div className="bg-white p-8 border border-gray-300 text-center text-gray-500">
                        Loading recipes...
                    </div>
                ) : feed.length === 0 ? (
                    <div className="bg-white p-8 border border-gray-300 text-center text-gray-500">
                        No recipes found
                    </div>
                ) : (
                    feed.map(recipe => (
                        <PostCard key={recipe._id} recipe={recipe} />
                    ))
                )}
            </div>

            {/* Sidebar: Suggestions */}
            <div className="md:w-1/3 space-y-4">
                <div className="bg-white p-4 border border-gray-300">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">People to Follow</h2>
                    <ul className="space-y-3">
                        {suggestions.map(s => (
                            <li key={s._id} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-gray-300 flex items-center justify-center font-bold text-gray-600">
                                        {s.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{s.username}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleFollow(s._id)}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm hover:bg-blue-700"
                                >
                                    Follow
                                </button>
                            </li>
                        ))}
                        {suggestions.length === 0 && <p className="text-gray-500 text-sm">No suggestions.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SocialPage;
