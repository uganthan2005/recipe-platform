import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const RecipeDetail = () => {
    const location = useLocation();
    const { id } = useParams();
    const [recipe, setRecipe] = useState(location.state?.recipe || null);
    const [loading, setLoading] = useState(!location.state?.recipe);

    useEffect(() => {
        if (recipe) return;

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
        <div className="max-w-4xl mx-auto space-y-6">
            <Link to="/recipes" className="text-blue-600 hover:underline">
                ← Back to Recipes
            </Link>

            <div className="bg-white border border-gray-300 p-6">
                <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
                <div className="flex gap-6 text-sm text-gray-600 mb-6">
                    <div>⏱️ 30m Cook Time</div>
                    <div>🔥 {recipe.nutrition?.calories || 'N/A'} kcal</div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Ingredients */}
                <div className="md:col-span-1">
                    <div className="bg-white border border-gray-300 p-4">
                        <h3 className="text-lg font-bold mb-3">Ingredients</h3>
                        <ul className="space-y-2">
                            {recipe.ingredients.map((ing, idx) => (
                                <li key={idx} className="flex justify-between text-sm border-b border-gray-200 pb-2">
                                    <span>{ing.name}</span>
                                    <span className="font-medium">{ing.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-sm">
                            Save
                        </button>
                        <button className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-sm">
                            Share
                        </button>
                    </div>
                </div>

                {/* Instructions */}
                <div className="md:col-span-2">
                    <div className="bg-white border border-gray-300 p-4">
                        <h3 className="text-lg font-bold mb-3">Instructions</h3>
                        <div className="space-y-4">
                            {recipe.steps.map((step, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-bold">
                                        {idx + 1}
                                    </div>
                                    <p className="text-sm text-gray-700">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
