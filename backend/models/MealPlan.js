const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    weekStartDate: { type: Date, required: true },
    plan: {
        monday: {
            breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
            lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
            dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
        },
        tuesday: {
            breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
            lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
            dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
        },
        wednesday: {
            breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
            lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
            dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
        },
        thursday: {
            breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
            lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
            dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
        },
        friday: {
            breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
            lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
            dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
        },
        saturday: {
            breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
            lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
            dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
        },
        sunday: {
            breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
            lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
            dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', MealPlanSchema);
