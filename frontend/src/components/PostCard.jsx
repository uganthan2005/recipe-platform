import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const PostCard = ({ recipe }) => {
    const { user } = useSelector((state) => state.auth);
    const [liked, setLiked] = useState(recipe.likes?.includes(user?.id) || false);
    const [likesCount, setLikesCount] = useState(recipe.likes?.length || 0);
    const [saved, setSaved] = useState(user?.savedRecipes?.includes(recipe._id) || false); // Assuming user object has savedRecipes updated
    const [comments, setComments] = useState(recipe.comments || []);
    const [commentText, setCommentText] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLike = async () => {
        if (!user) return;

        // Optimistic UI update
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        try {
            await axios.post(`/api/social/like/${recipe._id}`, { userId: user.id });
        } catch (err) {
            setLiked(!newLikedState);
            setLikesCount(prev => !newLikedState ? prev + 1 : prev - 1);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        const newSavedState = !saved;
        setSaved(newSavedState);
        try {
            await axios.post(`/api/social/save/${recipe._id}`, { userId: user.id });
        } catch (err) {
            setSaved(!newSavedState);
        }
    };

    const handleComment = async () => {
        if (!commentText.trim() || !user) return;
        try {
            const res = await axios.post(`/api/social/comment/${recipe._id}`, { userId: user.id, text: commentText });
            setComments([...comments, res.data]);
            setCommentText("");
            setShowComments(true);
        } catch (err) {
            console.error(err);
        }
    };

    // Placeholder image logic if no imageUrl is present
    const displayImage = recipe.imageUrl || `https://source.unsplash.com/800x600/?food,${recipe.title.split(' ')[0]}`;

    return (
        <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${recipe.createdBy?._id}`} className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold">
                        {recipe.createdBy?.username?.[0]?.toUpperCase() || 'U'}
                    </Link>
                    <div>
                        <Link to={`/profile/${recipe.createdBy?._id}`} className="font-semibold text-sm text-gray-900 hover:underline">
                            {recipe.createdBy?.username || 'Unknown User'}
                        </Link>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                </div>
                <button className="text-gray-500 hover:text-gray-900">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Media */}
            <div className="w-full aspect-square bg-gray-100 relative group" onDoubleClick={handleLike}>
                <img
                    src={displayImage}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/600x600?text=No+Image' }}
                />

                {/* Heart Animation Overlay */}
                {isAnimating && (
                    <div className="absolute inset-0 flex items-center justify-center animate-ping-short pointer-events-none">
                        <Heart size={100} className="text-white fill-white drop-shadow-lg" />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-4 pb-2">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex gap-4">
                        <button
                            onClick={handleLike}
                            className={`transform transition-transform active:scale-90 ${liked ? 'text-red-500' : 'text-gray-700 hover:text-gray-900'}`}
                        >
                            <Heart size={26} className={liked ? 'fill-current' : ''} />
                        </button>
                        <button className="text-gray-700 hover:text-gray-900">
                            <MessageCircle size={26} />
                        </button>
                        <button className="text-gray-700 hover:text-gray-900">
                            <Share2 size={26} />
                        </button>
                    </div>
                    <button onClick={handleSave} className={`transform transition-transform active:scale-90 ${saved ? 'text-black' : 'text-gray-700 hover:text-gray-900'}`}>
                        <Bookmark size={26} className={saved ? 'fill-current' : ''} />
                    </button>
                </div>

                <p className="font-semibold text-sm mb-1">{likesCount} likes</p>

                <div className="mb-2">
                    <span className="font-semibold text-sm mr-2">{recipe.createdBy?.username}</span>
                    <span className="text-sm text-gray-800">{recipe.description || recipe.title}</span>
                </div>

                {recipe.ingredients?.length > 0 && (
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{recipe.ingredients.length} Ingredients</p>
                )}

                {comments.length > 0 && (
                    <button onClick={() => setShowComments(!showComments)} className="text-gray-500 text-sm mb-2">
                        {showComments ? 'Hide comments' : `View all ${comments.length} comments`}
                    </button>
                )}

                {showComments && (
                    <div className="space-y-2 mb-3">
                        {comments.map((c, i) => (
                            <div key={i} className="flex gap-2">
                                <span className="font-bold text-xs">{c.user?.username || 'User'}:</span>
                                <span className="text-xs text-gray-700">{c.text}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2 mt-2">
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="text-sm w-full outline-none text-gray-700"
                        onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                    />
                    <button onClick={handleComment} disabled={!commentText.trim()} className="text-blue-500 font-semibold text-sm opacity-50 hover:opacity-100 disabled:opacity-30">Post</button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
