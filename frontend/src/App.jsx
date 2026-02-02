import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetail from './pages/RecipeDetail';
import CookingPage from './pages/CookingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SocialPage from './pages/SocialPage';
import MealPlannerPage from './pages/MealPlannerPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/cooking" element={<CookingPage />} />
        <Route path="/social" element={<SocialPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/meal-planner" element={<MealPlannerPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
