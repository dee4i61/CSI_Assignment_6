const { validationResult } = require('express-validator');
const Category = require('../models/categoryModel');   // ← unchanged

exports.createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.mapped() });

  try {
    const category = await Category.create(req.body);
    return res.status(201).json(category);
  } catch (err) {
    return res.status(409).json({ message: 'Category already exists' });
  }
};

exports.getAllCategories = async (_req, res) => {
  const categories = await Category.find().sort('name');
  return res.json(categories);
};

exports.getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Not found' });
  return res.json(category);
};

exports.updateCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.mapped() });

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) return res.status(404).json({ message: 'Not found' });
  return res.json(category);
};

exports.deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Not found' });
  return res.status(204).send();
};
