const Order = require("../models/orderModel");

exports.createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingInfo,
      paymentInfo,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No items." });
    }

    const order = await Order.create({
      customer_id: req.user._id,
      orderItems,
      shippingInfo,
      paymentInfo,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "customer_id",
      "name email"
    );

    if (!order)
      return res.status(404).json({ success: false, message: "Not found" });

    // Users can only view their own order unless admin
    if (
      order.customer_id._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

exports.myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer_id: req.user._id }).sort(
      "-createdAt"
    );
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ success: false, message: "Not found" });

    if (order.customer_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    if (order.orderStatus === "Cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Already cancelled" });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered orders can’t be cancelled",
      });
    }

    order.orderStatus = "Cancelled";
    order.cancelledAt = new Date();
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort("-createdAt");
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // expect Processing → Shipped → Delivered
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ success: false, message: "Not found" });

    if (!["Processing", "Shipped", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Bad status" });
    }

    order.orderStatus = status;
    if (status === "Delivered") order.deliveredAt = new Date();
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};
