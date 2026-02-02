const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe'); // Assuming we want to show recipes from followed users

// Follow a user
router.post('/follow/:id', async (req, res) => {
    const { currentUserId } = req.body;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
        return res.status(400).json({ error: "You cannot follow yourself" });
    }

    try {
        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!currentUser.following.includes(targetUserId)) {
            await currentUser.updateOne({ $push: { following: targetUserId } });
            await targetUser.updateOne({ $push: { followers: currentUserId } });
            res.json({ message: "User followed" });
        } else {
            res.status(400).json({ error: "Already following" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Unfollow a user
router.post('/unfollow/:id', async (req, res) => {
    const { currentUserId } = req.body;
    const targetUserId = req.params.id;

    try {
        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (currentUser.following.includes(targetUserId)) {
            await currentUser.updateOne({ $pull: { following: targetUserId } });
            await targetUser.updateOne({ $pull: { followers: currentUserId } });
            res.json({ message: "User unfollowed" });
        } else {
            res.status(400).json({ error: "Not following this user" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get Discovery Feed (Random posts from all users)
router.get('/feed/:userId', async (req, res) => {
    try {
        // Use aggregation to get random recipes
        const recipes = await Recipe.aggregate([
            { $sample: { size: 20 } },
            { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy' } },
            { $unwind: '$createdBy' },
            { $project: { 'createdBy.password': 0, 'createdBy.email': 0 } } // Exclude sensitive info
        ]);
        res.json(recipes);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Save a recipe
router.post('/save/:recipeId', async (req, res) => {
    const { userId } = req.body;
    const recipeId = req.params.recipeId;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.savedRecipes.includes(recipeId)) {
            await user.updateOne({ $pull: { savedRecipes: recipeId } });
            res.json({ message: "Recipe unsaved", isSaved: false });
        } else {
            await user.updateOne({ $push: { savedRecipes: recipeId } });
            res.json({ message: "Recipe saved", isSaved: true });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Comment on a recipe
router.post('/comment/:recipeId', async (req, res) => {
    const { userId, text } = req.body;
    const recipeId = req.params.recipeId;

    try {
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ error: "Recipe not found" });

        const newComment = {
            user: userId,
            text,
            date: new Date()
        };

        await recipe.updateOne({ $push: { comments: newComment } });

        // Return the populated comment for frontend
        const populatedRecipe = await Recipe.findById(recipeId).populate('comments.user', 'username profilePicture');
        const addedComment = populatedRecipe.comments[populatedRecipe.comments.length - 1];

        res.json(addedComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get User Profile (with stats and posts)
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ error: "User not found" });

        const posts = await Recipe.find({ createdBy: req.params.id }).sort({ createdAt: -1 });

        res.json({ user, posts });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get suggestions (Users to follow)
router.get('/suggestions/:userId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        // Basic logic: return users not already followed, exclude self
        const suggestions = await User.find({
            _id: { $nin: [...currentUser.following, currentUser._id] }
        }).limit(5).select('username email');

        res.json(suggestions);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Like a recipe
router.post('/like/:recipeId', async (req, res) => {
    try {
        const { userId } = req.body;
        const recipe = await Recipe.findById(req.params.recipeId);

        if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });

        // Check if already liked
        if (recipe.likes.includes(userId)) {
            // Unlike
            await recipe.updateOne({ $pull: { likes: userId } });
            res.json({ msg: 'Recipe unliked', likes: recipe.likes.length - 1, isLiked: false });
        } else {
            // Like
            await recipe.updateOne({ $push: { likes: userId } });
            res.json({ msg: 'Recipe liked', likes: recipe.likes.length + 1, isLiked: true });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
