import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCartItems,
  removeItemFromCart,
  updateItemQuantity,
  clearCartItems,
} from "../../redux/slices/cartSlice";
import { ShoppingCart, X, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items = [], status, error } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user?.user || null);
  const isAuthenticatedRedux = useSelector(
    (state) => state.auth?.isAuthenticated || false
  );

  // Derive isAuthenticated based on user object
  const isAuthenticated = !!user || isAuthenticatedRedux;
  const userId = user?._id || user?.id || user?.userId || null;

  const [isInitialized, setIsInitialized] = useState(false);

  // Placeholder images from Home.jsx for fallback
  const placeholderImages = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
  ];

  // State to track image loading status for each product
  const [imageStatus, setImageStatus] = useState({});

  useEffect(() => {
    if (userId && !isInitialized) {
      dispatch(fetchCartItems(userId));
      setIsInitialized(true);
    }
  }, [userId, dispatch, isInitialized]);

  useEffect(() => {
    setIsInitialized(false); // Reset when userId changes
  }, [userId]);

  const handleImageError = (itemId, index) => {
    setImageStatus((prev) => ({
      ...prev,
      [itemId]: placeholderImages[index % placeholderImages.length],
    }));
  };

  const handleRemoveItem = (productId) => {
    if (!userId || !productId) return;
    dispatch(removeItemFromCart({ userId, productId }));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (!userId || !productId || quantity < 1) return;
    dispatch(updateItemQuantity({ userId, productId, quantity }));
  };

  const handlecheckout = () => {
    navigate("/checkout");
  };

  const handleClearCart = () => {
    if (!userId) return;
    dispatch(clearCartItems(userId));
  };

  const calculateTotal = () => {
    return items
      .reduce((total, item) => {
        const price = item?.productId?.price || 0;
        const quantity = item?.quantity || 0;
        return total + price * quantity;
      }, 0)
      .toFixed(2);
  };

  if (!isAuthenticated || !userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center py-20">
          <ShoppingCart className="w-16 h-16 text-blue-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Please Log In
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Sign in to view your cart and proceed to checkout.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (status === "loading" && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
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
            onClick={() => userId && dispatch(fetchCartItems(userId))}
            className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Add some products to your cart to get started.
            </p>
            <button
              onClick={() => (window.location.href = "/products")}
              className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-lg"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                {items.map((item, index) => {
                  const product = item.productId;
                  const primaryImage =
                    imageStatus[item._id] ||
                    product?.images?.[0]?.url ||
                    product?.images?.[1]?.url ||
                    placeholderImages[index % placeholderImages.length];

                  return (
                    <div
                      key={item._id}
                      className="flex items-center border-b py-6 last:border-b-0 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="relative w-24 h-24 mr-4">
                        <img
                          src={primaryImage}
                          alt={product?.name || "Product"}
                          className="w-full h-full object-cover rounded-md"
                          onError={() => handleImageError(item._id, index)}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                          {product?.name || "Unknown Product"}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {product?.description || "No description available"}
                        </p>
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {product?.ratings || 0} (
                            {product?.numOfReviews || 0})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                product?._id,
                                item.quantity - 1
                              )
                            }
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-full hover:bg-gray-300 transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-4 py-1 bg-gray-100 text-gray-800 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                product?._id,
                                item.quantity + 1
                              )
                            }
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-full hover:bg-gray-300 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        {(product?.isBestseller || product?.isOnSale) && (
                          <div className="mt-2">
                            <span className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-3 py-1 rounded-full text-xs font-medium">
                              {product.isBestseller ? "Bestseller" : "On Sale"}
                            </span>
                          </div>
                        )}
                        {product?.Stock !== undefined && (
                          <div className="mt-2">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                product.Stock > 0
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {product.Stock > 0
                                ? `${product.Stock} in stock`
                                : "Out of stock"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-lg font-semibold text-gray-800">
                          ₹{(product?.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(product?._id)}
                          className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors"
                          title="Remove from cart"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Order Summary
                </h2>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-600">Calculated at checkout</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-800">
                      Total
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      ₹{calculateTotal()}
                    </span>
                  </div>
                  <button
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white py-3 rounded-full hover:from-blue-600 hover:to-teal-500 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                    onClick={handlecheckout}
                    disabled={items.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={handleClearCart}
                    className="w-full bg-red-100 text-red-600 py-3 rounded-full hover:bg-red-200 hover:text-red-700 transition-all duration-300 font-medium mt-3"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
