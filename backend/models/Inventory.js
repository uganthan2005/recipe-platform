const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: String, required: true },
  quantity: { type: String, required: true },
  expirationDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);