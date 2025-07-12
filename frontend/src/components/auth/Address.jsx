import React, { useState, useEffect } from "react";
import {
  addAddress,
  listAddresses,
  updateAddress,
  deleteAddress,
} from "../../services/addressServices";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
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

  // Fetch addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      setError("");
      setLoading(true);
      try {
        const response = await listAddresses();
        console.log("addresses", response);
        if (response.success) {
          setAddresses(response.addresses);
        } else {
          setError("Failed to load addresses.");
        }
      } catch (err) {
        setError(err.message || "Failed to load addresses.");
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle add or update address
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editAddressId) {
        // Update existing address
        const response = await updateAddress(editAddressId, addressForm);
        console.log("updated address", response);
        if (response.success) {
          setAddresses(
            addresses.map((addr) =>
              addr._id === editAddressId ? response.address : addr
            )
          );
          setSuccess("Address updated successfully!");
        }
      } else {
        // Add new address
        const response = await addAddress(addressForm);
        console.log("added address", response);
        if (response.success) {
          setAddresses([response.address, ...addresses]);
          setSuccess("Address added successfully!");
        }
      }
      setAddressForm({
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
      setShowAddForm(false);
      setEditAddressId(null);
    } catch (err) {
      setError(err.message || "Failed to save address.");
    }
  };

  // Handle delete address
  const handleDelete = async (id) => {
    setError("");
    setSuccess("");
    try {
      const response = await deleteAddress(id);
      console.log("deleted add.", response);
      if (response.success) {
        setAddresses(addresses.filter((addr) => addr._id !== id));
        setSuccess("Address deleted successfully!");
      }
    } catch (err) {
      setError(err.message || "Failed to delete address.");
    }
  };

  // Handle edit address
  const handleEdit = (address) => {
    setAddressForm({
      fullName: address.fullName || "",
      phone: address.phone || "",
      line1: address.line1 || "",
      line2: address.line2 || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "",
      isDefault: address.isDefault || false,
    });
    setEditAddressId(address._id);
    setShowAddForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-gray-200/50">
        <div className="flex items-center space-x-3 mb-8">
          <span className="text-2xl">🏠</span>
          <h1 className="text-3xl font-bold text-gray-800">Manage Addresses</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg">
            <div className="flex">
              <span className="text-red-400 mr-2">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 text-green-700 rounded-lg">
            <div className="flex">
              <span className="text-green-400 mr-2">✅</span>
              <span>{success}</span>
            </div>
          </div>
        )}

        <div className="mb-8">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditAddressId(null);
              setAddressForm({
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
            }}
            className="py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg"
          >
            {showAddForm ? "Cancel" : "Add New Address"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={addressForm.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={addressForm.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="line1"
                  value={addressForm.line1}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter address line 1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="line2"
                  value={addressForm.line2}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter address line 2 (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={addressForm.city}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={addressForm.state}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter state"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={addressForm.postalCode}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter postal code"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={addressForm.country}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter country"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={addressForm.isDefault}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm font-semibold text-gray-700">
                  Set as Default
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg"
            >
              {editAddressId ? "Update Address" : "Add Address"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          <p className="text-gray-600 text-center">No addresses found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`p-6 rounded-xl border shadow-lg ${
                  address.isDefault
                    ? "bg-gradient-to-br from-green-50 to-teal-50 border-green-200"
                    : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {address.isDefault && (
                      <span className="text-green-600 text-sm mr-2">
                        Default
                      </span>
                    )}
                    {address.fullName}
                  </h3>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="text-gray-600">{address.line1}</p>
                {address.line2 && (
                  <p className="text-gray-600">{address.line2}</p>
                )}
                <p className="text-gray-600">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-gray-600">{address.country}</p>
                <p className="text-gray-600">Phone: {address.phone}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;
