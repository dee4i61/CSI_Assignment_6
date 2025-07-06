import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  removeProductFromWishlist,
} from "../../redux/slices/wishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();

  // Get user from Redux store (assuming you have a user slice)
  const { user } = useSelector((state) => state.user);

  // Get wishlist state from Redux store
  const {
    items: wishlistItems,
    status,
    error,
  } = useSelector((state) => state.wishlist);

  const loading = status === "loading";
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlist(userId));
    }
  }, [dispatch, userId]);

  const handleRemoveFromWishlist = async (productId) => {
    if (userId) {
      dispatch(removeProductFromWishlist({ userId, productId }));
    }
  };

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="mb-8">
              <svg
                className="w-20 h-20 text-gray-400 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Please Login
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              You need to be logged in to view your wishlist
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="mb-8">
              <svg
                className="w-20 h-20 text-red-400 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-red-500 text-lg font-semibold mb-6">
              Error: {error}
            </p>
            <button
              onClick={() => dispatch(fetchWishlist(userId))}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle the data structure - extract items from data array
  const wishlistData = wishlistItems?.data || wishlistItems || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">My Wishlist</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {wishlistData.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8">
              <svg
                className="w-24 h-24 text-gray-400 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 text-lg mb-8">
              Start adding products you love to your wishlist
            </p>
            <button
              onClick={() => (window.location.href = "/products")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <p className="text-gray-600">
                {wishlistData.length} item{wishlistData.length > 1 ? "s" : ""}{" "}
                in your wishlist
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistData.map((item) => {
                const product = item.productId;
                const primaryImage = product?.images?.[0]?.url;

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-105"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={primaryImage}
                        alt={product?.name || "Product"}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(product?._id)}
                        className="absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100 text-red-500 p-2 rounded-full hover:scale-110 transition-all duration-200 shadow-lg"
                        title="Remove from wishlist"
                        disabled={loading}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>

                      {/* Category badge */}
                      {product?.category && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {product.category}
                        </div>
                      )}

                      {/* Stock indicator */}
                      {product?.Stock && (
                        <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {product.Stock} in stock
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                        {product?.name || "Product Name"}
                      </h3>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-blue-600">
                          ${product?.price || "0.00"}
                        </span>

                        {/* Rating */}
                        <div className="flex items-center space-x-1">
                          <svg
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
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
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-medium"
                      >
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
