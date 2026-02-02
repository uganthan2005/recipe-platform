import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/recipes')
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error('Error fetching recipes:', error));
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header bg-blue-500 text-white p-4">
          <h1 className="text-2xl font-bold">Recipe Platform</h1>
          <nav className="mt-4">
            <Link to="/" className="mr-4">Home</Link>
            <Link to="/recipes" className="mr-4">Recipes</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/step-by-step" className="mr-4">Step-by-Step Cooking</Link>
            <Link to="/mobile-view" className="mr-4">Mobile View</Link>
          </nav>
        </header>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<h2>Welcome to the Recipe Platform</h2>} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/profile" element={<h2>User Profile</h2>} />
            <Route path="/step-by-step" element={<StepByStepCooking />} />
            <Route path="/mobile-view" element={<MobileView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Recipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/recipes')
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error('Error fetching recipes:', error));
  }, []);

  return (
    <div>
      <h2>Recipes</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>{recipe.title}</li>
        ))}
      </ul>
    </div>
  );
}

function StepByStepCooking() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/recipes')
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error('Error fetching recipes:', error));
  }, []);

  return (
    <div>
      <h2>Step-by-Step Cooking</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>{recipe.title}</li>
        ))}
      </ul>
    </div>
  );
}

function MobileView() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/recipes')
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error('Error fetching recipes:', error));
  }, []);

  return (
    <div>
      <h2>Mobile View</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>{recipe.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;