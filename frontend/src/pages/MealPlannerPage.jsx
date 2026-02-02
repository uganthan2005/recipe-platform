import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, Plus, X } from 'lucide-react';
import RecipeSelectorModal from '../components/RecipeSelectorModal';

const MealPlannerPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [plan, setPlan] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const meals = ['Breakfast', 'Lunch', 'Dinner'];

    const handleSlotClick = (day, meal) => {
        setSelectedSlot({ day: day.toLowerCase(), meal: meal.toLowerCase() });
        setIsModalOpen(true);
    };

    const handleRecipeSelect = (recipe) => {
        if (!selectedSlot) return;

        const { day, meal } = selectedSlot;

        setPlan(prevPlan => ({
            ...prevPlan,
            [day]: {
                ...prevPlan[day],
                [meal]: recipe
            }
        }));

        setIsModalOpen(false);
        setSelectedSlot(null);
    };

    const handleRemoveRecipe = (day, meal) => {
        setPlan(prevPlan => ({
            ...prevPlan,
            [day.toLowerCase()]: {
                ...prevPlan[day.toLowerCase()],
                [meal.toLowerCase()]: null
            }
        }));
    };

    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar size={24} /> Meal Planner
                </h1>
                <p className="text-sm text-gray-600 mt-1">Plan your meals for the week</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {days.map(day => (
                    <div key={day} className="space-y-2">
                        <div className="bg-gray-200 text-gray-800 p-2 text-center font-semibold text-sm">
                            {day}
                        </div>
                        <div className="space-y-2">
                            {meals.map(meal => {
                                const recipe = plan[day.toLowerCase()]?.[meal.toLowerCase()];

                                return (
                                    <div
                                        key={meal}
                                        onClick={() => handleSlotClick(day, meal)}
                                        className={`p-3 border cursor-pointer min-h-[100px] ${recipe
                                                ? 'bg-blue-50 border-blue-300'
                                                : 'bg-white border-gray-300 border-dashed'
                                            }`}
                                    >
                                        <div className="flex flex-col h-full">
                                            <span className="text-xs text-gray-500 mb-1">{meal}</span>

                                            {recipe ? (
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm font-medium text-gray-900">{recipe.title}</p>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveRecipe(day, meal);
                                                            }}
                                                            className="text-gray-500 hover:text-red-600"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-1 items-center justify-center">
                                                    <Plus size={18} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <RecipeSelectorModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedSlot(null);
                }}
                onSelect={handleRecipeSelect}
            />
        </div>
    );
};

export default MealPlannerPage;
