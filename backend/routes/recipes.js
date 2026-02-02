const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Create a new recipe
router.post('/', async (req, res) => {
    const { title, ingredients, steps, nutrition, createdBy } = req.body;
    try {
        const newRecipe = new Recipe({ title, ingredients, steps, nutrition, createdBy });
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ error: 'Error creating recipe' });
    }
});

// Get all recipes with filters
router.get('/', async (req, res) => {
    const { title, ingredient, minCalories, maxCalories } = req.query;
    const query = {};

    if (title) query.title = { $regex: title, $options: 'i' };
    if (ingredient) query['ingredients.name'] = { $regex: ingredient, $options: 'i' };
    if (minCalories || maxCalories) {
        query['nutrition.calories'] = {};
        if (minCalories) query['nutrition.calories'].$gte = Number(minCalories);
        if (maxCalories) query['nutrition.calories'].$lte = Number(maxCalories);
    }

    try {
        const recipes = await Recipe.find(query);
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recipes' });
    }
});

// Get a single recipe by ID
router.get('/:id', async (req, res) => {
    try {
        // Handle AI temporary IDs gracefully
        if (req.params.id.startsWith('ai_')) {
            return res.status(404).json({ error: 'AI Recipe expired or not found' });
        }

        const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'username');
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        res.json(recipe);
    } catch (error) {
        // If ID is invalid format (CastError), return 404 instead of 500
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.status(500).json({ error: 'Error fetching recipe' });
    }
});

// Update a recipe
router.put('/:id', async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRecipe) return res.status(404).json({ error: 'Recipe not found' });
        res.json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ error: 'Error updating recipe' });
    }
});

// Delete a recipe
router.delete('/:id', async (req, res) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!deletedRecipe) return res.status(404).json({ error: 'Recipe not found' });
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting recipe' });
    }
});

// Rate a recipe (PATCH) - Requested in PRD
router.patch('/:id/rate', async (req, res) => {
    const { userId, rating } = req.body;
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

        // Check if user already rated
        const existingRating = recipe.ratings.find(r => r.user.toString() === userId);
        if (existingRating) {
            existingRating.rating = rating;
        } else {
            recipe.ratings.push({ user: userId, rating });
        }
        await recipe.save();
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Error rating recipe' });
    }
});

module.exports = router;
