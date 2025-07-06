import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCartItems,
  removeItemFromCart,
  updateItemQuantity,
  clearCartItems,
} from "../../redux/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();

  const { items = [], status, error } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user?.user || null);
  const isAuthenticatedRedux = useSelector(
    (state) => state.auth?.isAuthenticated || false
  );

  // Derive isAuthenticated based on user object
  const isAuthenticated = !!user || isAuthenticatedRedux;
  const userId = user?._id || user?.id || user?.userId || null;

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (userId && !isInitialized) {
      dispatch(fetchCartItems(userId));
      setIsInitialized(true);
    }
  }, [userId, dispatch, isInitialized]);

  useEffect(() => {
    setIsInitialized(false); // Reset when userId changes
  }, [userId]);

  const handleRemoveItem = (productId) => {
    if (!userId || !productId) return;
    dispatch(removeItemFromCart({ userId, productId }));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (!userId || !productId || quantity < 1) return;
    dispatch(updateItemQuantity({ userId, productId, quantity }));
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
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">Please log in to view your cart</p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (status === "loading" && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg font-semibold mb-4">{error}</p>
        <button
          onClick={() => userId && dispatch(fetchCartItems(userId))}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">Add items to your cart</p>
          <button
            onClick={() => (window.location.href = "/products")}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center border-b py-4 last:border-b-0"
                >
                  <img
                    src={
                      item?.productId?.image ||
                      "https://via.placeholder.com/100"
                    }
                    alt={item?.productId?.name || "Product"}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item?.productId?.name || "Unknown Product"}
                    </h3>
                    <p className="text-gray-600">
                      ${item?.productId?.price || 0}
                    </p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item?.productId?._id,
                            item.quantity - 1
                          )
                        }
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l hover:bg-gray-300"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-gray-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item?.productId?._id,
                            item.quantity + 1
                          )
                        }
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="text-lg font-semibold text-gray-800 mr-4">
                      ${(item?.productId?.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item?.productId?._id)}
                      className="text-red-500 hover:text-red-600"
                      title="Remove from cart"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">${calculateTotal()}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800">Calculated at checkout</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-800">
                    Total
                  </span>
                  <span className="text-lg font-semibold text-gray-800">
                    ${calculateTotal()}
                  </span>
                </div>
                <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 mb-4">
                  Proceed to Checkout
                </button>
                <button
                  onClick={handleClearCart}
                  className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
