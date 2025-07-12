import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Plus,
  CreditCard,
  Truck,
  ArrowLeft,
  Check,
  X,
  User,
  Phone,
  Home,
} from "lucide-react";
import { listAddresses, addAddress } from "../../services/addressServices";
import { createOrder } from "../../services/orderServices";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items = [] } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user?.user || null);
  const userId = user?._id || user?.id || user?.userId || null;

  // State management
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [error, setError] = useState("");

  // New address form state
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });

  // Load addresses on component mount
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setAddressesLoading(true);
      const response = await listAddresses();
      console.log("listAddresses", response);
      if (response.success) {
        setAddresses(response.addresses || []);
        // Auto-select default address if available
        const defaultAddress = response.addresses?.find(
          (addr) => addr.isDefault
        );
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    } catch (error) {
      setError("Failed to load addresses");
      console.error("Error loading addresses:", error);
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (
      !newAddress.fullName ||
      !newAddress.phone ||
      !newAddress.line1 ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.postalCode
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await addAddress(newAddress);
      console.log("addAddress", response);
      if (response.success) {
        setAddresses([...addresses, response.address]);
        setNewAddress({
          fullName: "",
          phone: "",
          line1: "",
          line2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          isDefault: false,
        });
        setShowAddAddressForm(false);
        setError("");
      }
    } catch (error) {
      setError(error.message || "Failed to add address");
      console.error("Error adding address:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOrderSummary = () => {
    const subtotal = items.reduce((total, item) => {
      const price = item?.productId?.price || 0;
      const quantity = item?.quantity || 0;
      return total + price * quantity;
    }, 0);

    const taxPrice = subtotal * 0.18; // 18% GST
    const shippingPrice = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
    const totalPrice = subtotal + taxPrice + shippingPrice;

    return {
      subtotal,
      taxPrice,
      shippingPrice,
      totalPrice,
    };
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a shipping address");
      return;
    }

    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const orderSummary = calculateOrderSummary();

      // Prepare order items
      const orderItems = items.map((item) => ({
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        image: item.productId.images?.[0]?.url || "",
        product: item.productId._id,
      }));

      // Prepare shipping info
      const shippingInfo = {
        address: selectedAddress.line1,
        city: selectedAddress.city,
        state: selectedAddress.state,
        country: selectedAddress.country,
        postalCode: selectedAddress.postalCode,
        phoneNo: selectedAddress.phone,
        name: selectedAddress.fullName,
      };

      // Prepare payment info
      const paymentInfo = {
        method: paymentMethod,
        ...(paymentMethod === "COD" && { codPaid: false }),
      };

      const orderData = {
        orderItems,
        shippingInfo,
        paymentInfo,
        taxPrice: orderSummary.taxPrice,
        shippingPrice: orderSummary.shippingPrice,
        totalPrice: orderSummary.totalPrice,
      };

      const response = await createOrder(orderData);
      console.log("order created!", response);

      if (response.success) {
        navigate(`/orders`);
      }
    } catch (error) {
      setError(error.message || "Failed to place order");
      console.error("Error placing order:", error);
    } finally {
      setLoading(false);
    }
  };

  const orderSummary = calculateOrderSummary();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add some products to proceed with checkout
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-800 ml-8">Checkout</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <X className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </h2>
                <button
                  onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Address
                </button>
              </div>

              {addressesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {/* Add Address Form */}
                  {showAddAddressForm && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Add New Address
                      </h3>
                      <form onSubmit={handleAddAddress} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={newAddress.fullName}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  fullName: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              value={newAddress.phone}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  phone: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 1 *
                          </label>
                          <input
                            type="text"
                            value={newAddress.line1}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                line1: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            value={newAddress.line2}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                line2: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Optional"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City *
                            </label>
                            <input
                              type="text"
                              value={newAddress.city}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  city: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              State *
                            </label>
                            <input
                              type="text"
                              value={newAddress.state}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  state: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Postal Code *
                            </label>
                            <input
                              type="text"
                              value={newAddress.postalCode}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  postalCode: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                          </label>
                          <input
                            type="text"
                            value={newAddress.country}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                country: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="India"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isDefault"
                            checked={newAddress.isDefault}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                isDefault: e.target.checked,
                              })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="isDefault"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Make this my default address
                          </label>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                          >
                            {loading ? "Adding..." : "Add Address"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddAddressForm(false)}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Address List */}
                  <div className="space-y-3">
                    {addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No addresses found. Please add an address.
                        </p>
                      </div>
                    ) : (
                      addresses.map((address) => (
                        <div
                          key={address._id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedAddress?._id === address._id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedAddress(address)}
                        >
                          <div className="flex items-start">
                            <div
                              className={`w-5 h-5 rounded-full border-2 mr-3 mt-1 flex items-center justify-center ${
                                selectedAddress?._id === address._id
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedAddress?._id === address._id && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="font-medium text-gray-800">
                                  {address.fullName}
                                </span>
                                {address.isDefault && (
                                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mb-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600">
                                  {address.phone}
                                </span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                <span className="text-gray-600">
                                  {address.line1}
                                  {address.line2 && `, ${address.line2}`},{" "}
                                  {address.city}, {address.state}{" "}
                                  {address.postalCode}
                                  {address.country && `, ${address.country}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("COD")}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        paymentMethod === "COD"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "COD" && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        Cash on Delivery
                      </div>
                      <div className="text-sm text-gray-600">
                        Pay when you receive your order
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === "Online"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("Online")}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        paymentMethod === "Online"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "Online" && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        Online Payment
                      </div>
                      <div className="text-sm text-gray-600">
                        Pay securely online (Coming Soon)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {paymentMethod === "Online" && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    Online payment functionality is coming soon. Please use Cash
                    on Delivery for now.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-3">
                    <img
                      src={
                        item.productId.images?.[0]?.url || "/placeholder.jpg"
                      }
                      alt={item.productId.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 line-clamp-1">
                        {item.productId.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-800">
                      ₹{(item.productId.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">
                    ₹{orderSummary.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="text-gray-800">
                    ₹{orderSummary.taxPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">
                    {orderSummary.shippingPrice === 0
                      ? "Free"
                      : `₹${orderSummary.shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-gray-800">Total</span>
                    <span className="text-gray-800">
                      ₹{orderSummary.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={
                  loading || !selectedAddress || paymentMethod === "Online"
                }
                className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white py-3 rounded-full hover:from-blue-600 hover:to-teal-500 transition-all duration-300 shadow-md hover:shadow-lg font-medium mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Truck className="w-5 h-5 mr-2" />
                    Place Order
                  </>
                )}
              </button>

              {orderSummary.shippingPrice === 0 && (
                <p className="text-center text-xs text-green-600 mt-2">
                  🎉 You get free shipping!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
