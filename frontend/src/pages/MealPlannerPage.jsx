import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Calendar, Users, Plus, Save, X, FileText, PlusCircle, Trash2 } from 'lucide-react';
import RecipeSelectorModal from '../components/RecipeSelectorModal';

const MealPlannerPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [plan, setPlan] = useState({});
    const [planId, setPlanId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [inviteUserId, setInviteUserId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null); // { day: 'monday', meal: 'breakfast' }
    const [saving, setSaving] = useState(false);
    const [savedPlans, setSavedPlans] = useState([]);
    const [isEditingNew, setIsEditingNew] = useState(false);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const meals = ['Breakfast', 'Lunch', 'Dinner'];

    useEffect(() => {
        if (user?.id) {
            fetchAllPlans();
        }
    }, [user]);

    const fetchAllPlans = async () => {
        try {
            const res = await axios.get(`/api/mealplanner/user/${user.id}/all`);
            setSavedPlans(res.data || []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const loadPlan = async (savedPlanId) => {
        try {
            const res = await axios.get(`/api/mealplanner/plan/${savedPlanId}`);
            if (res.data) {
                setPlan(res.data.plan || {});
                setPlanId(res.data._id);
                setIsEditingNew(false);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to load meal plan');
        }
    };

    const handleNewPlanner = () => {
        setPlan({});
        setPlanId(null);
        setIsEditingNew(true);
    };

    const handleCancelPlanner = () => {
        setPlan({});
        setPlanId(null);
        setIsEditingNew(false);
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!planId) return alert("No meal plan found to invite to. Save a plan first.");

        try {
            await axios.post(`/api/mealplanner/${planId}/invite`, { userIdToInvite: inviteUserId });
            alert(`Invite sent successfully to User ID: ${inviteUserId}`);
            setInviteUserId('');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Failed to invite user");
        }
    };

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

    const handleSavePlan = async () => {
        if (!user?.id) return;

        setSaving(true);
        try {
            // Convert plan to use recipe IDs only
            const planToSave = {};
            Object.keys(plan).forEach(day => {
                planToSave[day] = {};
                Object.keys(plan[day]).forEach(meal => {
                    planToSave[day][meal] = plan[day][meal]?._id || null;
                });
            });

            const res = await axios.post('/api/mealplanner', {
                userId: user.id,
                weekStartDate: new Date(),
                plan: planToSave,
                planId: planId // Include planId to update existing or null to create new
            });

            if (res.data._id) {
                setPlanId(res.data._id);
                setIsEditingNew(false);
                // Refresh the saved plans list
                await fetchAllPlans();
            }
            alert('Meal plan saved successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to save meal plan');
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePlan = async (planIdToDelete, e) => {
        e.stopPropagation(); // Prevent loading the plan when clicking delete

        if (!window.confirm('Are you sure you want to delete this meal plan? This action cannot be undone.')) {
            return;
        }

        try {
            await axios.delete(`/api/mealplanner/${planIdToDelete}`, {
                data: { userId: user.id }
            });

            // If the deleted plan was currently loaded, clear it
            if (planId === planIdToDelete) {
                setPlan({});
                setPlanId(null);
                setIsEditingNew(false);
            }

            // Refresh the saved plans list
            await fetchAllPlans();
            alert('Meal plan deleted successfully!');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Failed to delete meal plan');
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Calendar className="text-orange-500" /> Meal Planner
                </h1>
                <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                    {(planId || isEditingNew) && (
                        <button
                            onClick={handleCancelPlanner}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 flex items-center gap-2"
                        >
                            <X size={18} /> Cancel
                        </button>
                    )}
                    <button
                        onClick={handleNewPlanner}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2"
                    >
                        <PlusCircle size={18} /> New Planner
                    </button>
                    <form onSubmit={handleInvite} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter User ID to invite..."
                            className="flex-1 md:w-48 border border-gray-300 rounded-lg px-4 py-2"
                            value={inviteUserId}
                            onChange={e => setInviteUserId(e.target.value)}
                        />
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2">
                            <Users size={18} /> Invite
                        </button>
                    </form>
                </div>
            </div>

            {(planId || isEditingNew) && (

                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    {days.map(day => (
                        <div key={day} className="space-y-4">
                            <div className="bg-gray-800 text-white p-3 rounded-lg text-center font-bold">
                                {day}
                            </div>
                            <div className="space-y-2">
                                {meals.map(meal => {
                                    const recipe = plan[day.toLowerCase()]?.[meal.toLowerCase()];

                                    return (
                                        <div
                                            key={meal}
                                            onClick={() => handleSlotClick(day, meal)}
                                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 min-h-[100px] flex flex-col justify-between group hover:border-orange-300 transition cursor-pointer relative"
                                        >
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{meal}</span>

                                            {recipe ? (
                                                <div className="flex flex-col gap-1 mt-2">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm font-semibold text-gray-800 line-clamp-2">{recipe.title}</p>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveRecipe(day, meal);
                                                            }}
                                                            className="flex-shrink-0 p-1 hover:bg-red-100 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                    {recipe.description && (
                                                        <p className="text-xs text-gray-500 line-clamp-1">{recipe.description}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-300">
                                                    <Plus className="group-hover:text-orange-400" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Saved Meal Plans Section */}
            {!isEditingNew && !planId && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="text-orange-500" /> Saved Meal Plans
                    </h2>
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading meal plans...</div>
                    ) : savedPlans.length === 0 ? (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                            <FileText className="mx-auto text-gray-400 mb-3" size={48} />
                            <p className="text-gray-600 font-semibold mb-2">No saved meal plans yet</p>
                            <p className="text-gray-500 text-sm mb-4">Click "New Planner" to create your first meal plan</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {savedPlans.map(savedPlan => {
                                const planDate = new Date(savedPlan.weekStartDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                });

                                // Count how many meals are planned
                                let mealCount = 0;
                                Object.keys(savedPlan.plan || {}).forEach(day => {
                                    Object.keys(savedPlan.plan[day] || {}).forEach(meal => {
                                        if (savedPlan.plan[day][meal]) mealCount++;
                                    });
                                });

                                return (
                                    <div
                                        key={savedPlan._id}
                                        onClick={() => loadPlan(savedPlan._id)}
                                        className="bg-white border border-gray-200 rounded-xl p-5 hover:border-orange-400 hover:shadow-lg transition cursor-pointer group"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-800 group-hover:text-orange-600 transition">
                                                    Week of {planDate}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {mealCount} meal{mealCount !== 1 ? 's' : ''} planned
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => handleDeletePlan(savedPlan._id, e)}
                                                    className="p-2 hover:bg-red-100 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition"
                                                    title="Delete meal plan"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <Calendar className="text-orange-400" size={24} />
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Created {new Date(savedPlan.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            <div className="fixed bottom-8 right-8">
                <button
                    onClick={handleSavePlan}
                    disabled={saving}
                    className="bg-orange-600 text-white p-4 rounded-full shadow-2xl hover:bg-orange-700 hover:scale-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <div className="animate-spin">⏳</div>
                    ) : (
                        <Save size={24} />
                    )}
                </button>
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
