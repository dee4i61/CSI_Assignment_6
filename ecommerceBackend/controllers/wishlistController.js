// controllers/wishlistController.js
const Favorite = require("../models/wishlistModel");

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const favorite = await Favorite.create({ userId, productId });
    res.status(201).json({ message: "Added to wishlist", data: favorite });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const result = await Favorite.findOneAndDelete({ userId, productId });
    if (!result) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all wishlist products for a user
exports.getWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const favorites = await Favorite.find({ userId }).populate("productId");
    res.json({ data: favorites });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
