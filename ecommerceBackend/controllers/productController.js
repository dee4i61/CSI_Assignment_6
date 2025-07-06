const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const products = await Product.find({ ...keyword });

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

exports.getAdminProducts = catchAsyncErrors(async (req, res) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  res.status(200).json({
    success: true,
    product,
  });
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: isReviewed ? "Review updated" : "Review added",
  });
});

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id
  );

  const numOfReviews = reviews.length;

  const ratings =
    reviews.reduce((acc, item) => item.rating + acc, 0) / (numOfReviews || 1);

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
