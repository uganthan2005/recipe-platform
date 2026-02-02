const mongoose = require('mongoose');

const SocialSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  mealPlan: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('Social', SocialSchema);