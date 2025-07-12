// routes/addressRoutes.js
const express = require("express");
const router = express.Router();

const addressController = require("../controllers/addressController");
const { isAuthenticatedUser } = require("../middlewares/auth");

router.use(isAuthenticatedUser);

router.post("/", addressController.addAddress);
router.get("/", addressController.listAddresses);
router.patch("/:id", addressController.updateAddress);
router.delete("/:id", addressController.deleteAddress);

module.exports = router;
