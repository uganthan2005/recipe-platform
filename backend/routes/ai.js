const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const Inventory = require('../models/Inventory'); // Add Inventory model import
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Core AI logic for "What can I cook?"
router.post('/recommend', async (req, res) => {
    const { userId, ingredients, preferences } = req.body;
    console.log("AI Request received for User:", userId);

    // 1. Fetch available ingredients
    let availableIngredients = ingredients || [];
    if (userId && availableIngredients.length === 0) {
        const inventory = await Inventory.find({ userId });
        availableIngredients = inventory.map(i => i.item);
        console.log("Fetched Inventory:", availableIngredients);
    }

    // DEMO MODE: If inventory is empty, assume basic staples to show off AI capabilities
    let isDemoMode = false;
    if (!availableIngredients || availableIngredients.length === 0) {
        console.log("Inventory empty. Using demo ingredients.");
        availableIngredients = ["Eggs", "Milk", "Flour", "Tomato", "Onion"];
        isDemoMode = true;
    }

    if (!availableIngredients || availableIngredients.length === 0) {
        // Fallback to random recipes if pantry is empty (this block might be redundant now due to demo mode)
        const randomRecipes = await Recipe.find().limit(5);
        return res.json(randomRecipes);
    }

    try {
        // 2. Ask Gemini for recommendations (Using gemini-3-flash-preview as requested)
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `
            Act as a professional AI Chef. 
            I have these ingredients in my pantry: ${availableIngredients.join(', ')}.
            ${isDemoMode ? "(Note: These are default staples because my pantry is empty)" : ""}
            My dietary preferences: ${preferences ? JSON.stringify(preferences) : 'None'}.
            
            Based on this, suggest 3 creative and delicious recipes I can make. 
            Detailed format required.
            
            Return ONLY a valid JSON array of objects with this structure:
            [
              {
                "title": "Recipe Title",
                "description": "Short appetizing description",
                "matchType": "Exact" or "Partial",
                "ingredients": [
                    { "name": "Ingredient Name", "quantity": "Quantity (e.g. 2 cups)" }
                ],
                "steps": [
                    "Step 1 instruction...",
                    "Step 2 instruction..."
                ],
                "nutrition": { "calories": 500, "protein": "20g", "carbs": "50g" },
                "cookTime": "30 mins"
              }
            ]
            Do not include markdown formatting like \`\`\`json. Just the raw JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();

        let suggestions = [];
        try {
            suggestions = JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse Gemini response", text);
            suggestions = [];
        }

        // 3. Search DB for these titles
        const titles = suggestions.map(s => s.title);
        const matchedRecipes = await Recipe.find({
            title: { $in: titles.map(t => new RegExp(t, 'i')) }
        });

        const finalResults = [...matchedRecipes];

        // 4. If we found nothing in DB, let's create "Ghost" recipe objects from AI
        const matchedTitles = matchedRecipes.map(r => r.title.toLowerCase());
        const newSuggestions = suggestions.filter(s => !matchedTitles.some(mt => mt.includes(s.title.toLowerCase())));

        newSuggestions.forEach(s => {
            finalResults.push({
                _id: "ai_" + Date.now() + Math.random().toString(36).substr(2, 9),
                title: s.title,
                description: s.description || "AI Suggested Recipe",
                ingredients: s.ingredients || availableIngredients.map(n => ({ name: n, quantity: "As needed" })),
                steps: s.steps || ["Mix ingredients and cook until done (AI didn't provide steps)"],
                nutrition: s.nutrition || { calories: 0 },
                cookTime: s.cookTime || "30m",
                isAiSuggestion: true,
                matchType: s.matchType
            });
        });

        res.json(finalResults);
        console.log("AI Response sent with", finalResults.length, "recipes");

    } catch (e) {
        console.error("AI Error Details:", e);
        // Fallback to local matching logic
        const allRecipes = await Recipe.find({});
        const scored = allRecipes.filter(r =>
            r.ingredients.some(ri => availableIngredients.some(ai => ai.toLowerCase().includes(ri.name.toLowerCase())))
        );
        res.json(scored.slice(0, 5));
    }
});

// Route for element match (legacy/simple)
router.post('/recommendations', async (req, res) => {
    const { userPreferences, availableIngredients } = req.body;
    try {
        // Legacy logic from index.js
        const recommendations = await Recipe.find({
            'ingredients.name': { $in: availableIngredients },
            // 'nutrition': { $elemMatch: { $in: userPreferences } } // Complex query, simplifying for now
        });
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: 'Error generating recommendations' });
    }
});

module.exports = router;
