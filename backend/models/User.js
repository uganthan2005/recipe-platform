const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: { type: Object, default: {} },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  dietaryPreferences: [{ type: String }],
  dietaryRestrictions: [{ type: String }],
  collections: [{ name: { type: String, required: true }, recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }] }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bio: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);