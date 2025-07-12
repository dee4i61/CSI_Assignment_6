import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  removeProductFromWishlist,
} from "../../redux/slices/wishlistSlice";
import { Heart, ShoppingCart, Star, X } from "lucide-react";

const Wishlist = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const {
    items: wishlistItems,
    status,
    error,
  } = useSelector((state) => state.wishlist);

  const loading = status === "loading";
  const userId = user?._id || user?.id;

  const placeholderImages = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1599623560574-39d485900c95?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  // State to track image loading status for each product
  const [imageStatus, setImageStatus] = useState({});

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlist(userId));
    }
  }, [dispatch, userId]);

  // Handle image load errors
  const handleImageError = (itemId, index) => {
    setImageStatus((prev) => ({
      ...prev,
      [itemId]: placeholderImages[index % placeholderImages.length],
    }));
  };

  const handleRemoveFromWishlist = async (productId) => {
    if (userId) {
      dispatch(removeProductFromWishlist({ userId, productId }));
    }
  };

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Please Log In
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Sign in to view your wishlist and save your favorite products.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-lg"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <svg
              className="w-16 h-16 text-red-400 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-red-500 text-lg font-semibold mb-6">
              Error: {error}
            </p>
            <button
              onClick={() => dispatch(fetchWishlist(userId))}
              className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const wishlistData = wishlistItems?.data || wishlistItems || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">My Wishlist</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto rounded-full"></div>
        </div>

        {wishlistData.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Start adding products you love to your wishlist.
            </p>
            <button
              onClick={() => (window.location.href = "/products")}
              className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-lg"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg">
                {wishlistData.length} item{wishlistData.length > 1 ? "s" : ""}{" "}
                in your wishlist
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistData.map((item, index) => {
                const product = item.productId;
                const primaryImage =
                  imageStatus[item._id] ||
                  product?.images?.[0]?.url ||
                  product?.images?.[1]?.url ||
                  placeholderImages[index % placeholderImages.length];

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={primaryImage}
                        alt={product?.name || "Product"}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={() => handleImageError(item._id, index)}
                      />

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(product?._id)}
                        className="absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100 text-red-500 p-2 rounded-full hover:scale-110 transition-all duration-200 shadow-sm"
                        title="Remove from wishlist"
                        disabled={loading}
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Bestseller/Sale badge */}
                      {(product?.isBestseller || product?.isOnSale) && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {product.isBestseller ? "Bestseller" : "On Sale"}
                        </div>
                      )}

                      {/* Stock indicator */}
                      {product?.Stock !== undefined && (
                        <div
                          className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                            product.Stock > 0
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {product.Stock > 0
                            ? `${product.Stock} in stock`
                            : "Out of stock"}
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {product?.name || "Product Name"}
                      </h3>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-gray-900">
                          ₹{product?.price?.toFixed(2) || "0.00"}
                        </span>

                        {/* Rating */}
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {product?.ratings || 0} (
                            {product?.numOfReviews || 0})
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product?.description || "No description available"}
                      </p>

                      <button
                        onClick={() =>
                          (window.location.href = `/product/${product?._id}`)
                        }
                        className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white py-2 rounded-full hover:from-blue-600 hover:to-teal-500 transition-all duration-300 shadow-sm hover:shadow-md font-medium flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        View Product
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
