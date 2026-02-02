import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X, Check } from 'lucide-react';

const RecipeSelectorModal = ({ isOpen, onClose, onSelect }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchRecipes();
        }
    }, [isOpen]);

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

    const filteredRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">Select Recipe</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search recipes..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading recipes...</div>
                    ) : (
                        filteredRecipes.map(recipe => (
                            <button
                                key={recipe._id}
                                onClick={() => onSelect(recipe)}
                                className="w-full text-left p-3 hover:bg-orange-50 rounded-xl transition flex items-center gap-3 group border border-transparent hover:border-orange-100"
                            >
                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                    {/* Placeholder image */}
                                    <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-400 font-bold text-xs">
                                        IMG
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm group-hover:text-orange-700">{recipe.title}</h4>
                                    <p className="text-xs text-gray-500 line-clamp-1">{recipe.description || 'Delicious home cooked meal'}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeSelectorModal;
