import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, Bookmark, Settings, User as UserIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import PostCard from '../components/PostCard'; // We might want a GridCard version, but PostCard reuse is OK for now or we make a simple thumbnail.

const ProfilePage = () => {
    const { userId } = useParams();
    const { user: currentUser } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ bio: '', profilePicture: '' });
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`/api/social/profile/${userId}`);
                setProfile(res.data.user);
                setEditForm({ bio: res.data.user.bio || '', profilePicture: res.data.user.profilePicture || '' });
                setPosts(res.data.posts);

                // Check if current user is following this profile
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
                // Unfollow
                await axios.post(`/api/social/unfollow/${userId}`, { currentUserId: currentUser.id });
                setIsFollowing(false);
                // Update follower count optimistically
                setProfile(prev => ({
                    ...prev,
                    followers: prev.followers.filter(id => id !== currentUser.id)
                }));
            } else {
                // Follow
                await axios.post(`/api/social/follow/${userId}`, { currentUserId: currentUser.id });
                setIsFollowing(true);
                // Update follower count optimistically
                setProfile(prev => ({
                    ...prev,
                    followers: [...(prev.followers || []), currentUser.id]
                }));
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Failed to update follow status');
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading profile...</div>;
    if (!profile) return <div className="p-10 text-center">User not found</div>;

    const isOwnProfile = currentUser?.id === profile._id;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {profile.profilePicture ? (
                            <img src={profile.profilePicture} alt={profile.username} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl font-bold text-gray-300">{profile.username[0].toUpperCase()}</span>
                        )}
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <h1 className="text-2xl font-light text-gray-800">{profile.username}</h1>
                        {isOwnProfile ? (
                            <button
                                onClick={() => {
                                    if (isEditing) {
                                        // Save logic (Optimistic)
                                        setProfile({ ...profile, ...editForm });
                                        setIsEditing(false);
                                        // Call API to save (Not implemented in backend yet, but UI is ready)
                                        // axios.post('/api/social/updateProfile', editForm);
                                    } else {
                                        setIsEditing(true);
                                    }
                                }}
                                className={`px-4 py-1.5 border rounded font-semibold text-sm flex items-center gap-2 ${isEditing ? 'bg-black text-white border-black' : 'border-gray-300 hover:bg-gray-50'}`}
                            >
                                <Settings size={16} /> {isEditing ? 'Save Profile' : 'Edit Profile'}
                            </button>
                        ) : (
                            <button
                                onClick={handleFollowToggle}
                                disabled={followLoading}
                                className={`px-6 py-1.5 rounded font-semibold text-sm transition-colors disabled:opacity-50 ${isFollowing
                                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                            >
                                {followLoading ? 'Loading...' : (isFollowing ? 'Following' : 'Follow')}
                            </button>
                        )}
                    </div>

                    <div className="flex justify-center md:justify-start gap-8 text-sm">
                        <span><strong className="font-bold text-gray-900">{posts.length}</strong> posts</span>
                        <span><strong className="font-bold text-gray-900">{profile.followers?.length || 0}</strong> followers</span>
                        <span><strong className="font-bold text-gray-900">{profile.following?.length || 0}</strong> following</span>
                    </div>

                    <div className="space-y-1 w-full">
                        <p className="font-semibold text-gray-900">{profile.username}</p>
                        {isEditing ? (
                            <div className="space-y-2 mt-2">
                                <input
                                    className="w-full border p-2 rounded text-sm"
                                    placeholder="Profile Image URL"
                                    value={editForm.profilePicture}
                                    onChange={(e) => setEditForm({ ...editForm, profilePicture: e.target.value })}
                                />
                                <textarea
                                    className="w-full border p-2 rounded text-sm"
                                    placeholder="Write a bio..."
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                />
                            </div>
                        ) : (
                            <p className="text-gray-700 whitespace-pre-line">{profile.bio || "No bio yet."}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-200 mb-6">
                <div className="flex justify-center gap-12">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`flex items-center gap-2 py-4 text-xs font-semibold tracking-widest uppercase border-t-2 transition-colors ${activeTab === 'posts' ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-400'}`}
                    >
                        <Grid size={12} /> Posts
                    </button>
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`flex items-center gap-2 py-4 text-xs font-semibold tracking-widest uppercase border-t-2 transition-colors ${activeTab === 'saved' ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-400'}`}
                    >
                        <Bookmark size={12} /> Saved
                    </button>
                </div>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-3 gap-1 md:gap-8">
                {activeTab === 'posts' && posts.map(post => (
                    <div key={post._id} className="relative aspect-square group bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity">
                        <img
                            src={post.imageUrl || `https://source.unsplash.com/400x400/?food,${post.title}`}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image' }}
                        />
                        <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center text-white font-bold gap-4">
                            <span className="flex items-center gap-1"><Heart size={18} className="fill-white" /> {post.likes?.length || 0}</span>
                            <span className="flex items-center gap-1"><MessageCircle size={18} className="fill-white" /> {post.comments?.length || 0}</span>
                        </div>
                    </div>
                ))}

                {activeTab === 'saved' && (
                    <div className="col-span-3 text-center py-20 text-gray-400">
                        <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Saved posts will appear here</p>
                        <p className="text-xs mt-2">(API for fetching saved posts pending in this demo view)</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper icons needed for the hover effect (was missing in imports)
import { Heart, MessageCircle } from 'lucide-react';

export default ProfilePage;
