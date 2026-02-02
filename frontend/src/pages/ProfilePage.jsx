import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PostCard from '../components/PostCard';

const ProfilePage = () => {
    const { userId } = useParams();
    const { user: currentUser } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`/api/social/profile/${userId}`);
                setProfile(res.data.user);
                setPosts(res.data.posts);

                if (currentUser?.id && res.data.user.followers) {
                    setIsFollowing(res.data.user.followers.includes(currentUser.id));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId, currentUser]);

    const handleFollowToggle = async () => {
        if (!currentUser?.id) {
            alert('Please log in to follow users');
            return;
        }

        setFollowLoading(true);
        try {
            if (isFollowing) {
                await axios.post(`/api/social/unfollow/${userId}`, { currentUserId: currentUser.id });
                setIsFollowing(false);
                setProfile(prev => ({
                    ...prev,
                    followers: prev.followers.filter(id => id !== currentUser.id)
                }));
            } else {
                await axios.post(`/api/social/follow/${userId}`, { currentUserId: currentUser.id });
                setIsFollowing(true);
                setProfile(prev => ({
                    ...prev,
                    followers: [...(prev.followers || []), currentUser.id]
                }));
            }
        } catch (err) {
            console.error(err);
            alert('Failed to update follow status');
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!profile) return <div className="p-10 text-center">User not found</div>;

    const isOwnProfile = currentUser?.id === profile._id;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white border border-gray-300 p-6 mb-6">
                <div className="flex items-start gap-6 mb-4">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-gray-300 flex items-center justify-center text-3xl font-bold text-gray-700">
                        {profile.username[0].toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                            <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
                            {!isOwnProfile && (
                                <button
                                    onClick={handleFollowToggle}
                                    disabled={followLoading}
                                    className={`px-4 py-1 font-semibold text-sm disabled:opacity-50 ${isFollowing
                                            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    {followLoading ? 'Loading...' : (isFollowing ? 'Following' : 'Follow')}
                                </button>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 mb-3 text-sm">
                            <div>
                                <span className="font-bold">{posts.length}</span> posts
                            </div>
                            <div>
                                <span className="font-bold">{profile.followers?.length || 0}</span> followers
                            </div>
                            <div>
                                <span className="font-bold">{profile.following?.length || 0}</span> following
                            </div>
                        </div>

                        {/* Bio */}
                        {profile.bio && (
                            <p className="text-sm text-gray-700">{profile.bio}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-300 mb-6">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`pb-2 text-sm font-medium ${activeTab === 'posts'
                                ? 'border-b-2 border-gray-800 text-gray-900'
                                : 'text-gray-500'
                            }`}
                    >
                        Posts
                    </button>
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`pb-2 text-sm font-medium ${activeTab === 'saved'
                                ? 'border-b-2 border-gray-800 text-gray-900'
                                : 'text-gray-500'
                            }`}
                    >
                        Saved
                    </button>
                </div>
            </div>

            {/* Content */}
            <div>
                {activeTab === 'posts' && (
                    <div>
                        {posts.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No posts yet
                            </div>
                        ) : (
                            posts.map(post => <PostCard key={post._id} recipe={post} />)
                        )}
                    </div>
                )}

                {activeTab === 'saved' && (
                    <div className="text-center py-12 text-gray-500">
                        Saved recipes feature coming soon
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
