// models/CartItem.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Optional: prevent duplicate products in the cart per user
cartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('CartItem', cartItemSchema);
