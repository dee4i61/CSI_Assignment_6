// routes/wishlistRoutes.js
const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

// Add to wishlist
router.post("/add", wishlistController.addToWishlist);

// Remove from wishlist
router.delete("/remove", wishlistController.removeFromWishlist);

// Get all wishlist items for a user
router.get("/:userId", wishlistController.getWishlist);

module.exports = router;
