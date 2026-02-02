import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-extrabold text-gray-900 sm:text-6xl mb-6"
            >
                Your Smart <span className="text-orange-500">Kitchen Companion</span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-xl text-gray-500 max-w-2xl"
            >
                Manage your pantry, discover AI-powered recipes, and cook delicious meals with less waste.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10 flex gap-4"
            >
                <Link to="/inventory" className="px-8 py-3 bg-orange-500 text-white rounded-full font-bold shadow-lg hover:bg-orange-600 transition transform hover:-translate-y-1">
                    Manage Pantry
                </Link>
                <Link to="/recipes" className="px-8 py-3 bg-white text-orange-500 border-2 border-orange-500 rounded-full font-bold shadow-sm hover:bg-orange-50 transition transform hover:-translate-y-1">
                    Find Recipes
                </Link>
            </motion.div>
        </div>
    );
};
export default Home;
