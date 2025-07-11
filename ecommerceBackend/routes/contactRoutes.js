const express = require("express");
const {
  createContactMessage,
  getAllContacts,
  respondToContact,
} = require("../controllers/contactController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.route("/contact").post(createContactMessage);

// Admin endpoints
router
  .route("/admin/contacts")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllContacts);

router
  .route("/admin/contact/:id/respond")
  .patch(isAuthenticatedUser, authorizeRoles("admin"), respondToContact);

module.exports = router;
