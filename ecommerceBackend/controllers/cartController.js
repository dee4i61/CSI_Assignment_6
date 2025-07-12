const CartItem = require("../models/cartModel");

// Add to cart
exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Check if item already in cart
    const existing = await CartItem.findOne({ userId, productId });

    if (existing) {
      // Update quantity
      existing.quantity += quantity || 1;
      await existing.save();
      return res.json({ message: "Cart updated", data: existing });
    }

    // Create new cart item
    const cartItem = await CartItem.create({ userId, productId, quantity });
    res.status(201).json({ message: "Added to cart", data: cartItem });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const deleted = await CartItem.findOneAndDelete({ userId, productId });
    if (!deleted)
      return res.status(404).json({ message: "Item not found in cart" });

    res.json({ message: "Removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const updated = await CartItem.findOneAndUpdate(
      { userId, productId },
      { quantity },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Item not found in cart" });

    res.json({ message: "Cart item updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all cart items for a user
exports.getCartItems = async (req, res) => {
  const { userId } = req.params;

  try {
    const items = await CartItem.find({ userId }).populate("productId");
    res.json({ data: items });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Clear all cart items for a user
exports.clearCart = async (req, res) => {
  const { userId } = req.body;

  try {
    await CartItem.deleteMany({ userId });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
