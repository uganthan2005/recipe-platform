import React, { useEffect, useState } from 'react';
import { Search, Clock, Flame, ChefHat, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RecipesPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const { user } = useSelector(state => state.auth);

    // Load from session storage initially
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
            // Save to session storage
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
        <div className="space-y-8">
            {/* AI Call to Action */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
                <div>
                    <h2 className="text-3xl font-bold mb-2">What can I cook today?</h2>
                    <p className="text-orange-100">Let our AI Chef analyze your pantry and suggest recipes instantly.</p>
                </div>
                <button
                    onClick={handleAiRecommend}
                    disabled={aiLoading}
                    className="px-8 py-3 bg-white text-orange-600 rounded-full font-bold shadow-lg hover:bg-orange-50 transition flex items-center gap-2 disabled:opacity-75"
                >
                    {aiLoading ? (
                        <>
                            <div className="animate-spin h-5 w-5 border-2 border-orange-600 border-t-transparent rounded-full"></div>
                            Analyzing Pantry...
                        </>
                    ) : (
                        <>
                            <ChefHat size={20} /> Suggest for Me
                        </>
                    )}
                </button>
            </div>

            {/* AI Results Section */}
            {aiSuggestions.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-orange-500">✨</span> AI Recommendations
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {aiSuggestions.map((recipe) => (
                            <Link to={`/recipes/${recipe._id}`} state={{ recipe }} key={recipe._id} className="bg-white rounded-xl shadow-md border-2 border-orange-100 hover:border-orange-200 transition overflow-hidden group">
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{recipe.title}</h3>
                                        {recipe.isAiSuggestion && <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-bold">AI Gen</span>}
                                    </div>
                                    <div className="text-sm text-gray-500 mb-4">
                                        Using: {recipe.ingredients?.map(i => i.name).join(', ')}
                                    </div>
                                    <span className="text-orange-500 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                        View Recipe <ArrowRight size={16} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <hr className="border-gray-200 my-8" />
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Discover Recipes</h2>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes.length > 0 ? (
                        filteredRecipes.map((recipe) => (
                            <Link to={`/recipes/${recipe._id}`} key={recipe._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group border border-gray-100 block">
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    {/* Placeholder image logic - in real app, fetch from recipe.image */}
                                    <div className="absolute inset-0 bg-orange-100 flex items-center justify-center text-orange-300 group-hover:scale-105 transition duration-500">
                                        <ChefHat size={48} />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{recipe.title}</h3>
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock size={16} />
                                            <span>30m</span> {/* Mock time if missing */}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Flame size={16} />
                                            <span>{recipe.nutrition?.calories || 'N/A'} kcal</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                                            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">
                                                {ing.name}
                                            </span>
                                        ))}
                                        {recipe.ingredients.length > 3 && (
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-500">
                                                +{recipe.ingredients.length - 3} more
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
