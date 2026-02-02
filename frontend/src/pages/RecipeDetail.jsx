import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Clock, Flame, ArrowLeft, Heart, Share2, ChefHat, PlayCircle } from 'lucide-react';

const RecipeDetail = () => {
    const location = useLocation();
    const { id } = useParams();
    const [recipe, setRecipe] = useState(location.state?.recipe || null);
    const [loading, setLoading] = useState(!location.state?.recipe);

    useEffect(() => {
        if (recipe) return; // If we already have recipe from state, don't fetch

        const fetchRecipe = async () => {
            try {
                const res = await axios.get(`/api/recipes/${id}`);
                setRecipe(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id, recipe]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!recipe) return <div className="p-8 text-center">Recipe not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <Link to="/recipes" className="flex items-center text-gray-500 hover:text-orange-500 mb-4">
                <ArrowLeft size={20} className="mr-1" /> Back to Recipes
            </Link>

            <div className="relative rounded-2xl overflow-hidden bg-gray-900 h-64 md:h-96">
                {/* Placeholder Image */}
                <div className="absolute inset-0 bg-orange-100 flex items-center justify-center text-orange-300 opacity-20">
                    <ChefHat size={120} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">{recipe.title}</h1>
                    <div className="flex gap-6 text-sm md:text-base font-medium">
                        <div className="flex items-center gap-2">
                            <Clock size={20} />
                            <span>30m Cook Time</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Flame size={20} />
                            <span>{recipe.nutrition?.calories || 'N/A'} kcal</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Ingredients Column */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">1</span>
                            Ingredients
                        </h3>
                        <ul className="space-y-3">
                            {recipe.ingredients.map((ing, idx) => (
                                <li key={idx} className="flex justify-between items-center text-gray-700 border-b border-gray-50 pb-2 last:border-0">
                                    <span>{ing.name}</span>
                                    <span className="font-semibold text-gray-900">{ing.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex-1 py-3 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition">
                            <Heart size={20} /> Save
                        </button>
                        <button className="flex-1 py-3 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition">
                            <Share2 size={20} /> Share
                        </button>
                    </div>
                </div>

                {/* Instructions Column */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">2</span>
                            Instructions
                        </h3>
                        <div className="space-y-6">
                            {recipe.steps.map((step, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm">
                                        {idx + 1}
                                    </div>
                                    <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link to="/cooking" state={{ recipe }} className="block w-full py-4 bg-orange-600 text-white rounded-xl text-center font-bold text-lg shadow-lg hover:bg-orange-700 hover:shadow-xl transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                        <PlayCircle size={24} /> Start Cooking Mode
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
