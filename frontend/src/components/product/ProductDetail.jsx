// src/components/product/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails } from "../../services/productServices";
import { addItemToCart, fetchCartItems } from "../../redux/slices/cartSlice";
import {
  addProductToWishlist,
  removeProductFromWishlist,
  fetchWishlist,
} from "../../redux/slices/wishlistSlice";
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
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductDetails(id);
        setProduct(response.product);
      } catch (err) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-5 h-5 fill-yellow-400/50 text-yellow-400"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }

    return stars;
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 mb-6 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>

        {/* Product Detail */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
                <img
                  src={
                    product.images[selectedImage]?.url ||
                    "https://via.placeholder.com/600"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-blue-500 shadow-lg"
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
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <button
                    onClick={handleWishlistToggle}
                    disabled={actionLoading.wishlist}
                    className={`p-2 rounded-full transition-all ${
                      isProductInWishlist()
                        ? "text-red-600"
                        : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
                    }`}
                  >
                    {actionLoading.wishlist ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Heart
                        className={`w-6 h-6 ${
                          isProductInWishlist() ? "fill-current" : ""
                        }`}
                      />
                    )}
                  </button>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.ratings || 0)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.numOfReviews || 0} reviews)
                  </span>
                </div>

                <div className="text-4xl font-bold text-blue-600 mb-4">
                  ${product.price?.toFixed(2)}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {product.Stock > 0
                    ? `${product.Stock} in stock`
                    : "Out of stock"}
                </span>
                {product.Stock <= 5 && product.Stock > 0 && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    Only {product.Stock} left
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              {product.Stock > 0 && (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.Stock}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className={`w-full py-4 px-6 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                    product.Stock === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : isProductInCart()
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg"
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
                  onClick={() => alert("Share functionality not implemented")}
                  className="w-full py-3 px-6 rounded-xl font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Product</span>
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-600">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
