const express = require("express");
const { body, param } = require("express-validator");
const categoryCtrl = require("../controllers/categoryController");

const router = express.Router();

router.post(
  "/",
  body("name").trim().isLength({ min: 2 }),
  categoryCtrl.createCategory
);

router.get("/", categoryCtrl.getAllCategories);

router.get("/:id", param("id").isMongoId(), categoryCtrl.getCategoryById);

router.put(
  "/:id",
  param("id").isMongoId(),
  body("name").optional().isLength({ min: 2 }),
  categoryCtrl.updateCategory
);

router.delete("/:id", param("id").isMongoId(), categoryCtrl.deleteCategory);

module.exports = router;
