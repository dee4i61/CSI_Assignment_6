// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Add item to cart
router.post("/add", cartController.addToCart);

// Remove item from cart
router.delete("/remove", cartController.removeFromCart);

// Update quantity of a cart item
router.put("/update", cartController.updateCartItem);

// Get all cart items for a user
router.get("/:userId", cartController.getCartItems);

// Clear all cart items for a user
router.delete("/clear", cartController.clearCart);

module.exports = router;
