import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RecipesPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const { user } = useSelector(state => state.auth);

    const [aiSuggestions, setAiSuggestions] = useState(() => {
        const saved = sessionStorage.getItem('aiSuggestions');
        return saved ? JSON.parse(saved) : [];
    });
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            const res = await axios.get('/api/recipes');
            setRecipes(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleAiRecommend = async () => {
        if (!user) return alert("Please login to use AI features");
        setAiLoading(true);
        try {
            const res = await axios.post('/api/ai/recommend', { userId: user.id });
            setAiSuggestions(res.data);
            sessionStorage.setItem('aiSuggestions', JSON.stringify(res.data));
        } catch (e) {
            console.error(e);
            alert("Failed to get recommendations");
        }
        setAiLoading(false);
    };

    const filteredRecipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* AI Section */}
            <div className="bg-blue-600 border border-blue-700 p-4 text-white">
                <h2 className="text-xl font-bold mb-2">What can I cook today?</h2>
                <p className="mb-3 text-sm">Let AI analyze your pantry and suggest recipes.</p>
                <button
                    onClick={handleAiRecommend}
                    disabled={aiLoading}
                    className="px-4 py-2 bg-white text-blue-600 font-bold hover:bg-gray-100 disabled:opacity-50"
                >
                    {aiLoading ? 'Analyzing...' : 'Get AI Suggestions'}
                </button>
            </div>

            {/* AI Results */}
            {aiSuggestions.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-800">AI Recommendations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {aiSuggestions.map((recipe) => (
                            <Link to={`/recipes/${recipe._id}`} state={{ recipe }} key={recipe._id} className="bg-white border border-blue-400 p-3 hover:bg-blue-50">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-sm text-gray-900">{recipe.title}</h3>
                                    {recipe.isAiSuggestion && <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1">AI</span>}
                                </div>
                                <div className="text-xs text-gray-600">
                                    Using: {recipe.ingredients?.map(i => i.name).join(', ')}
                                </div>
                            </Link>
                        ))}
                    </div>
                    <hr className="border-gray-300 my-4" />
                </div>
            )}

            {/* Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <h2 className="text-xl font-bold text-gray-800">All Recipes</h2>
                <input
                    type="text"
                    placeholder="Search recipes..."
                    className="w-full md:w-80 px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Recipes List */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRecipes.length > 0 ? (
                        filteredRecipes.map((recipe) => (
                            <Link to={`/recipes/${recipe._id}`} key={recipe._id} className="bg-white border border-gray-300 hover:border-gray-400">
                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400 text-4xl">🍳</span>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-bold text-sm text-gray-900 mb-2">{recipe.title}</h3>
                                    <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
                                        <div>⏱️ 30m</div>
                                        <div>🔥 {recipe.nutrition?.calories || 'N/A'} kcal</div>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                                            <span key={idx} className="text-xs bg-gray-200 px-2 py-1 text-gray-700">
                                                {ing.name}
                                            </span>
                                        ))}
                                        {recipe.ingredients.length > 3 && (
                                            <span className="text-xs bg-gray-200 px-2 py-1 text-gray-600">
                                                +{recipe.ingredients.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No recipes found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RecipesPage;
