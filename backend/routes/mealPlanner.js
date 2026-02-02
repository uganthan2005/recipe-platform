const express = require('express');
const router = express.Router();
const MealPlan = require('../models/MealPlan');
const User = require('../models/User');

// Get all meal plans for a user
router.get('/user/:userId/all', async (req, res) => {
    try {
        const plans = await MealPlan.find({
            $or: [{ owner: req.params.userId }, { collaborators: req.params.userId }]
        })
            .populate('plan.monday.breakfast plan.monday.lunch plan.monday.dinner plan.tuesday.breakfast plan.tuesday.lunch plan.tuesday.dinner plan.wednesday.breakfast plan.wednesday.lunch plan.wednesday.dinner plan.thursday.breakfast plan.thursday.lunch plan.thursday.dinner plan.friday.breakfast plan.friday.lunch plan.friday.dinner plan.saturday.breakfast plan.saturday.lunch plan.saturday.dinner plan.sunday.breakfast plan.sunday.lunch plan.sunday.dinner')
            .sort({ createdAt: -1 });

        res.json(plans);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get a specific meal plan by ID
router.get('/plan/:planId', async (req, res) => {
    try {
        const plan = await MealPlan.findById(req.params.planId)
            .populate('plan.monday.breakfast plan.monday.lunch plan.monday.dinner plan.tuesday.breakfast plan.tuesday.lunch plan.tuesday.dinner plan.wednesday.breakfast plan.wednesday.lunch plan.wednesday.dinner plan.thursday.breakfast plan.thursday.lunch plan.thursday.dinner plan.friday.breakfast plan.friday.lunch plan.friday.dinner plan.saturday.breakfast plan.saturday.lunch plan.saturday.dinner plan.sunday.breakfast plan.sunday.lunch plan.sunday.dinner');

        if (!plan) {
            return res.status(404).json({ error: "Plan not found" });
        }
        res.json(plan);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get current week's plan for a user (kept for backward compatibility)
router.get('/:userId', async (req, res) => {
    try {
        const plan = await MealPlan.findOne({
            $or: [{ owner: req.params.userId }, { collaborators: req.params.userId }]
        })
            .populate('plan.monday.breakfast plan.monday.lunch plan.monday.dinner plan.tuesday.breakfast plan.tuesday.lunch plan.tuesday.dinner plan.wednesday.breakfast plan.wednesday.lunch plan.wednesday.dinner plan.thursday.breakfast plan.thursday.lunch plan.thursday.dinner plan.friday.breakfast plan.friday.lunch plan.friday.dinner plan.saturday.breakfast plan.saturday.lunch plan.saturday.dinner plan.sunday.breakfast plan.sunday.lunch plan.sunday.dinner')
            .sort({ createdAt: -1 });

        if (!plan) {
            return res.json({ message: "No plan found" });
        }
        res.json(plan);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Create or Update Plan
router.post('/', async (req, res) => {
    const { userId, weekStartDate, plan, planId } = req.body;
    try {
        let mealPlan;

        if (planId) {
            // Update existing plan
            mealPlan = await MealPlan.findById(planId);
            if (!mealPlan) {
                return res.status(404).json({ error: "Plan not found" });
            }
            if (weekStartDate) mealPlan.weekStartDate = weekStartDate;
            if (plan) mealPlan.plan = plan;
        } else {
            // Create new plan
            mealPlan = new MealPlan({
                owner: userId,
                weekStartDate: weekStartDate || new Date(),
                plan: plan || {}
            });
        }

        await mealPlan.save();
        res.json(mealPlan);

    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete a meal plan
router.delete('/:id', async (req, res) => {
    try {
        const mealPlan = await MealPlan.findById(req.params.id);

        if (!mealPlan) {
            return res.status(404).json({ error: "Meal plan not found" });
        }

        // Only the owner can delete the plan
        if (mealPlan.owner.toString() !== req.body.userId) {
            return res.status(403).json({ error: "Only the owner can delete this meal plan" });
        }

        await MealPlan.findByIdAndDelete(req.params.id);
        res.json({ message: "Meal plan deleted successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Invite Collaborator
router.post('/:id/invite', async (req, res) => {
    const { userIdToInvite } = req.body;
    try {
        const userToInvite = await User.findById(userIdToInvite);
        if (!userToInvite) return res.status(404).json({ error: "User not found" });

        const mealPlan = await MealPlan.findById(req.params.id);
        if (!mealPlan.collaborators.includes(userToInvite._id)) {
            await mealPlan.updateOne({ $push: { collaborators: userToInvite._id } });
            res.json({ message: "Collaboator added" });
        } else {
            res.status(400).json({ error: "Already a collaborator" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
