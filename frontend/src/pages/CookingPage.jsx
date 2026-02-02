import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check, Play, Pause, RotateCcw } from 'lucide-react';
import Confetti from 'react-confetti'; // We'll need to install this or simulate it. For now, simulate.

const CookingPage = () => {
    // For now, mock data as we don't have a way to pass props easily without state management or URL params for complex objects if not using context
    // In a real app, we'd fetch the recipe by ID or use Redux
    // I'll simulate receiving a recipe via location state or default to a mock
    const location = useLocation();
    const navigate = useNavigate();
    const recipe = location.state?.recipe;

    useEffect(() => {
        if (!recipe) {
            navigate('/recipes');
        }
    }, [recipe, navigate]);

    if (!recipe) return null;

    const [currentStep, setCurrentStep] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const [completed, setCompleted] = useState(false);

    // Timer logic
    useEffect(() => {
        let interval;
        if (isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsTimerRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleNext = () => {
        if (currentStep < recipe.steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setCompleted(true);
            // TODO: Call backend to decrement inventory
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    if (completed) {
        return (
            <div className="min-h-screen bg-orange-500 flex flex-col items-center justify-center text-white text-center p-8">
                {/* <Confetti /> would go here */}
                <h1 className="text-5xl font-bold mb-4">Bon Appétit!</h1>
                <p className="text-xl mb-8">You've successfully cooked {recipe.title}</p>
                <div className="space-y-4 w-full max-w-sm">
                    <button onClick={() => navigate('/dashboard')} className="w-full py-3 bg-white text-orange-600 rounded-full font-bold shadow-lg hover:scale-105 transition">
                        Back to Dashboard
                    </button>
                    <button className="w-full py-3 bg-orange-600 border-2 border-white rounded-full font-bold hover:bg-orange-700 transition">
                        Share Photo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex flex-col md:flex-row gap-8 pb-20">
            {/* Sidebar / Progress */}
            <div className="md:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <h2 className="text-xl font-bold mb-6 text-gray-800">{recipe.title}</h2>
                <div className="flex-1 space-y-4 overflow-y-auto">
                    {recipe.steps.map((step, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentStep(idx)}
                            className={`p-4 rounded-xl cursor-pointer transition ${idx === currentStep
                                ? 'bg-orange-50 border-2 border-orange-500'
                                : idx < currentStep
                                    ? 'bg-green-50 border border-green-200 text-green-700'
                                    : 'bg-gray-50 text-gray-400'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${idx < currentStep ? 'bg-green-500 text-white' : idx === currentStep ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {idx < currentStep ? <Check size={14} /> : idx + 1}
                                </div>
                                <p className="text-sm line-clamp-2">{step}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Step View */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    {/* Background decorative blob */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

                    <span className="relative z-10 text-orange-500 font-bold tracking-widest uppercase text-sm mb-4">Step {currentStep + 1} of {recipe.steps.length}</span>
                    <h2 className="relative z-10 text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-8">
                        {recipe.steps[currentStep]}
                    </h2>

                    {/* Timer Widget */}
                    <div className="relative z-10 bg-gray-900 text-white px-6 py-3 rounded-full flex items-center gap-4 shadow-xl">
                        <span className="font-mono text-2xl font-bold w-20">{formatTime(timeLeft)}</span>
                        <div className="flex gap-2">
                            <button onClick={() => setTimeLeft(timeLeft + 60)} className="hover:text-orange-300 text-xs">+1m</button>
                            <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="p-2 bg-orange-500 rounded-full hover:bg-orange-600 transition">
                                {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                            </button>
                            <button onClick={() => { setIsTimerRunning(false); setTimeLeft(0); }} className="hover:text-red-300">
                                <RotateCcw size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`flex items-center px-6 py-3 rounded-xl font-bold transition ${currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <ChevronLeft className="mr-2" /> Previous
                    </button>

                    <button
                        onClick={handleNext}
                        className="flex items-center px-8 py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg hover:bg-orange-700 hover:scale-105 transition"
                    >
                        {currentStep === recipe.steps.length - 1 ? 'Finish Cooking' : 'Next Step'}
                        {currentStep !== recipe.steps.length - 1 && <ChevronRight className="ml-2" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookingPage;
