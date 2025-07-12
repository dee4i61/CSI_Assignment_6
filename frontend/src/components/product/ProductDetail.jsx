import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getProductDetails,
  getProductReviews,
} from "../../services/productServices";
import { addItemToCart, fetchCartItems } from "../../redux/slices/cartSlice";
import {
  addProductToWishlist,
  removeProductFromWishlist,
  fetchWishlist,
} from "../../redux/slices/wishlistSlice";
import ReviewModal from "./ReviewModal";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Package,
  Loader2,
  Plus,
  Minus,
  Share2,
  Shield,
  Truck,
  RotateCcw,
  Calendar,
  User,
  MessageCircle,
  Award,
  Clock,
  Edit3,
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [actionLoading, setActionLoading] = useState({});
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const [productResponse, reviewsResponse] = await Promise.all([
          getProductDetails(id),
          getProductReviews(id),
        ]);
        console.log("reviewsResponse", reviewsResponse);
        setProduct(productResponse.product);
        setReviews(reviewsResponse.reviews || []);
      } catch (err) {
        setError("Product or reviews not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  // Fetch user's cart and wishlist
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCartItems(user._id));
      dispatch(fetchWishlist(user._id));
    }
  }, [user?._id, dispatch]);

  const isProductInWishlist = () => {
    return wishlistItems.some(
      (item) =>
        item.productId === product._id || item.productId?._id === product._id
    );
  };

  const isProductInCart = () => {
    return cartItems.some(
      (item) =>
        item.productId === product._id || item.productId?._id === product._id
    );
  };

  const handleWishlistToggle = async () => {
    if (!user?._id) {
      alert("Please login to add products to wishlist");
      return;
    }

    setActionLoading((prev) => ({ ...prev, wishlist: true }));

    try {
      if (isProductInWishlist()) {
        await dispatch(
          removeProductFromWishlist({
            userId: user._id,
            productId: product._id,
          })
        ).unwrap();
      } else {
        await dispatch(
          addProductToWishlist({
            userId: user._id,
            productId: product._id,
          })
        ).unwrap();
      }
    } catch (error) {
      console.error("Wishlist action failed:", error);
      alert("Failed to update wishlist. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, wishlist: false }));
    }
  };

  const handleAddToCart = async () => {
    if (!user?._id) {
      alert("Please login to add products to cart");
      return;
    }

    if (product.Stock < quantity) {
      alert("Not enough stock available");
      return;
    }

    setActionLoading((prev) => ({ ...prev, cart: true }));

    try {
      await dispatch(
        addItemToCart({
          userId: user._id,
          productId: product._id,
          quantity,
        })
      ).unwrap();

      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Failed to add product to cart. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, cart: false }));
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.Stock) {
      setQuantity(newQuantity);
    }
  };

  const handleWriteReview = () => {
    setIsReviewModalOpen(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Share failed:", error);
        alert("Failed to share product. Please try again.");
      }
    } else {
      alert("Sharing is not supported on this device or browser.");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-4 h-4 fill-yellow-400/50 text-yellow-400"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-500 text-lg font-semibold mb-2">Error</div>
            <p className="text-red-600">{error || "Product not found"}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 mb-6 text-gray-600 hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>

        {/* Product Detail */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform hover:shadow-2xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden group">
                <img
                  src={
                    product.images?.[selectedImage]?.url ||
                    "https://via.placeholder.com/600"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Bestseller and Sale Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {product.isBestseller && (
                    <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full flex items-center space-x-1">
                      <Award className="w-3 h-3" />
                      <span>Bestseller</span>
                    </span>
                  )}
                  {product.isOnSale && (
                    <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                      Sale
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images?.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 transform hover:scale-105 ${
                        selectedImage === index
                          ? "border-blue-500 shadow-lg scale-105"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div className="transform hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <button
                    onClick={handleWishlistToggle}
                    disabled={actionLoading.wishlist}
                    className={`p-3 rounded-full transition-all duration-200 transform hover:scale-110 ${
                      isProductInWishlist()
                        ? "bg-red-50 text-red-600 shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
                    }`}
                  >
                    {actionLoading.wishlist ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Heart
                        className={`w-6 h-6 transition-all duration-200 ${
                          isProductInWishlist()
                            ? "fill-current animate-pulse"
                            : ""
                        }`}
                      />
                    )}
                  </button>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.ratings || 0)}
                    <span className="ml-2 text-lg font-semibold text-gray-800">
                      {product.ratings || 0}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>({reviews.length || 0} reviews)</span>
                  </span>
                </div>

                <div className="text-5xl font-bold text-blue-600 mb-6">
                  ₹{product.price?.toFixed(2)}
                </div>
              </div>

              {/* Quantity Selector */}
              {product.Stock > 0 && (
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.Stock}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.Stock === 0 || actionLoading.cart}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2 ${
                    product.Stock === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : isProductInCart()
                      ? "bg-green-500 text-white hover:bg-green-600 shadow-lg"
                      : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-xl"
                  }`}
                >
                  {actionLoading.cart ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>
                        {product.Stock === 0
                          ? "Out of Stock"
                          : isProductInCart()
                          ? "Added to Cart"
                          : "Add to Cart"}
                      </span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="w-full py-3 px-6 rounded-xl font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-8">
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Product Description
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Product Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{product.category}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-medium">{product.ratings}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-8">
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Customer Reviews
                </h3>
                <p className="text-gray-600 mt-1">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={handleWriteReview}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Edit3 className="w-5 h-5" />
                <span>Write a Review</span>
              </button>
            </div>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div
                    key={review._id || index}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {typeof review.name === "object" &&
                            review.name !== null
                              ? review.name.name
                              : review.name || "Anonymous"}
                          </h4>
                          <div className="flex items-center space-x-1 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-600 ml-2">
                              {review.rating}/5
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No reviews yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Be the first to share your thoughts about this product
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Review Modal */}
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          productId={product._id}
          user={user}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
