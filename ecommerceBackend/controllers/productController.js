const multer = require("multer");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
});

const assertValidCategory = async (categoryId) => {
  if (!categoryId || !categoryId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ErrorHandler("Invalid category ID", 400);
  }
  const category = await Category.findById(categoryId).select("name");
  if (!category) {
    throw new ErrorHandler("Category not found", 400);
  }
  return category;
};

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  upload.array("images", 5)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    await assertValidCategory(req.body.category);

    req.body.user = req.user.id;

    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        public_id: file.filename,
      }));
    }

    const product = await Product.create(req.body);

    res.status(201).json({ success: true, product });
  });
});

exports.getAllProducts = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const keyword = queryObj.keyword;
    delete queryObj.keyword;

    const removeFields = ["page", "limit", "sort"];
    removeFields.forEach((field) => delete queryObj[field]);

    let mongoFilter = JSON.parse(
      JSON.stringify(queryObj).replace(
        /\b(gt|gte|lt|lte)\b/g,
        (match) => `$${match}`
      )
    );

    if (req.query.minPrice || req.query.maxPrice) {
      mongoFilter.price = {};
      if (req.query.minPrice)
        mongoFilter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice)
        mongoFilter.price.$lte = Number(req.query.maxPrice);
    }

    const keywordFilter = keyword
      ? { name: { $regex: keyword, $options: "i" } }
      : {};

    let query = Product.find({ ...keywordFilter, ...mongoFilter });

    if (req.query.sort) {
      query = query.sort(req.query.sort.split(",").join(" "));
    } else {
      query = query.sort("-createdAt");
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    query = query.skip((page - 1) * limit).limit(limit);

    const products = await query;
    const productsCount = await Product.countDocuments({
      ...keywordFilter,
      ...mongoFilter,
    });

    res.status(200).json({
      success: true,
      productsCount,
      results: products.length,
      page,
      limit,
      products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdminProducts = catchAsyncErrors(async (_req, res) => {
  const products = await Product.find();
  res.status(200).json({ success: true, products });
});

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  res.status(200).json({ success: true, product });
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  console.log("req.body:", req.body);
  // Handle file uploads with multer
  upload.array("images", 5)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    // Check if req.body is defined
    if (!req.body) {
      return next(new ErrorHandler("Request body is missing", 400));
    }

    // Validate category if provided
    if (req.body.category) {
      try {
        await assertValidCategory(req.body.category);
      } catch (err) {
        return next(new ErrorHandler(err.message, 400));
      }
    }

    // Handle sale-flag logic
    if (typeof req.body.isOnSale !== "undefined") {
      req.body.isOnSale = !!req.body.isOnSale;

      if (req.body.isOnSale) {
        if (!req.body.salePrice) {
          return next(
            new ErrorHandler("salePrice required when isOnSale=true", 400)
          );
        }
      } else {
        // If turning off sale, clear related fields
        req.body.salePrice = undefined;
        req.body.saleStart = undefined;
        req.body.saleEnd = undefined;
      }
    }

    // Handle images if provided
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        public_id: file.filename,
      }));
    }

    // Find product
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // Update product
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({ success: true, product });
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

  res.status(200).json({ success: true, reviews: product.reviews });
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
    { reviews, ratings, numOfReviews },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

exports.setProductFlags = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { isBestseller, isOnSale, salePrice, saleStart, saleEnd } = req.body;

  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  if (typeof isBestseller !== "undefined")
    product.isBestseller = !!isBestseller;
  if (typeof isOnSale !== "undefined") product.isOnSale = !!isOnSale;

  if (product.isOnSale) {
    if (salePrice) product.salePrice = salePrice;
    if (saleStart) product.saleStart = saleStart;
    if (saleEnd) product.saleEnd = saleEnd;
    if (!product.salePrice)
      return next(
        new ErrorHandler("salePrice required when isOnSale=true", 400)
      );
  } else {
    product.salePrice = undefined;
    product.saleStart = undefined;
    product.saleEnd = undefined;
  }

  await product.save();
  res.status(200).json({ success: true, product });
});
