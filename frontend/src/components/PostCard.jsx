import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const PostCard = ({ recipe }) => {
    const { user } = useSelector((state) => state.auth);
    const [liked, setLiked] = useState(recipe.likes?.includes(user?.id) || false);
    const [likesCount, setLikesCount] = useState(recipe.likes?.length || 0);
    const [saved, setSaved] = useState(user?.savedRecipes?.includes(recipe._id) || false);
    const [comments, setComments] = useState(recipe.comments || []);
    const [commentText, setCommentText] = useState("");
    const [showComments, setShowComments] = useState(false);

    const handleLike = async () => {
        if (!user) return;
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

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

    const displayImage = recipe.imageUrl || `https://source.unsplash.com/800x600/?food,${recipe.title.split(' ')[0]}`;

    return (
        <div className="bg-white border border-gray-300 mb-4">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <Link to={`/profile/${recipe.createdBy?._id}`} className="w-8 h-8 bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm">
                        {recipe.createdBy?.username?.[0]?.toUpperCase() || 'U'}
                    </Link>
                    <div>
                        <Link to={`/profile/${recipe.createdBy?._id}`} className="font-semibold text-sm text-gray-900 hover:underline">
                            {recipe.createdBy?.username || 'Unknown User'}
                        </Link>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                </div>
            </div>

            {/* Media */}
            <div className="w-full aspect-square bg-gray-100">
                <img
                    src={displayImage}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/600x600?text=No+Image' }}
                />
            </div>

            {/* Actions */}
            <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex gap-3">
                        <button
                            onClick={handleLike}
                            className={`text-sm ${liked ? 'text-red-600 font-bold' : 'text-gray-700'}`}
                        >
                            {liked ? '❤️' : '🤍'} Like
                        </button>
                        <button className="text-sm text-gray-700">
                            💬 Comment
                        </button>
                        <button className="text-sm text-gray-700">
                            📤 Share
                        </button>
                    </div>
                    <button onClick={handleSave} className={`text-sm ${saved ? 'text-black font-bold' : 'text-gray-700'}`}>
                        {saved ? '🔖' : '📑'} Save
                    </button>
                </div>

                <p className="font-semibold text-sm mb-1">{likesCount} likes</p>

                <div className="mb-2">
                    <span className="font-semibold text-sm mr-2">{recipe.createdBy?.username}</span>
                    <span className="text-sm text-gray-800">{recipe.description || recipe.title}</span>
                </div>

                {recipe.ingredients?.length > 0 && (
                    <p className="text-xs text-gray-500 mb-2">{recipe.ingredients.length} Ingredients</p>
                )}

                {comments.length > 0 && (
                    <button onClick={() => setShowComments(!showComments)} className="text-gray-600 text-sm mb-2">
                        {showComments ? 'Hide comments' : `View all ${comments.length} comments`}
                    </button>
                )}

                {showComments && (
                    <div className="space-y-1 mb-2">
                        {comments.map((c, i) => (
                            <div key={i} className="flex gap-2">
                                <span className="font-bold text-xs">{c.user?.username || 'User'}:</span>
                                <span className="text-xs text-gray-700">{c.text}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="text-sm w-full outline-none border border-gray-300 px-2 py-1"
                        onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                    />
                    <button onClick={handleComment} disabled={!commentText.trim()} className="text-blue-600 font-semibold text-sm disabled:opacity-30">Post</button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
