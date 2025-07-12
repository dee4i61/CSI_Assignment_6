const express = require("express");
const {
  createOrder,
  getOrder,
  myOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  markCodPaid,
} = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, createOrder);

router
  .route("/order/:id")
  .get(isAuthenticatedUser, getOrder)
  .patch(isAuthenticatedUser, cancelOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .patch(isAuthenticatedUser, authorizeRoles("admin"), updateOrderStatus);

router
  .route("/admin/order/:id/cod-paid")
  .patch(isAuthenticatedUser, authorizeRoles("admin"), markCodPaid);

module.exports = router;
