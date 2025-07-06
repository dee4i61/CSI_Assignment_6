import React, { useState } from "react";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/userSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "Electronics",
    "Clothing & Fashion",
    "Home & Garden",
    "Sports & Outdoors",
    "Books & Media",
    "Beauty & Health",
    "Toys & Games",
    "Automotive",
    "Food & Beverages",
    "Office Supplies",
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const toggleCategories = () => setIsCategoriesOpen(!isCategoriesOpen);

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Add your search logic here
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      // Close any open menus
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      // Navigate to home page or login page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // You can add toast notification here if needed
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate(`/`)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-800 hidden sm:block">
                EcoShop
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            {/* Navigation Links */}
            <button
              onClick={() => navigate("/")}
              className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Home
            </button>

            <button
              onClick={() => navigate("/products")}
              className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Products
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={toggleCategories}
                className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isCategoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => {
                        console.log("Selected category:", category);
                        navigate(
                          `/category/${category
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/&/g, "and")}`
                        );
                        setIsCategoriesOpen(false);
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/about")}
              className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              About Us
            </button>

            <button
              onClick={() => navigate("/contact")}
              className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Contact Us
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg ml-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                />
                <button
                  onClick={handleSearch}
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wishlist */}
            <button
              className="relative p-2 text-gray-700 hover:text-red-500 transition-colors duration-200 group"
              onClick={() => navigate(`/wishlist`)}
            >
              <Heart className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              {/* <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span> */}
            </button>

            {/* Cart */}
            <button
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
              onClick={() => navigate(`/cart`)}
            >
              <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              {/* <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span> */}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center space-x-1 p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                <User className="h-6 w-6" />
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
                    onClick={() => {
                      navigate(`/profile`);
                      setIsProfileOpen(false);
                    }}
                  >
                    <UserCircle className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{loading ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Mobile Categories */}
              <div className="border-b border-gray-200 pb-2 mb-2">
                <button
                  onClick={toggleCategories}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 font-medium flex items-center justify-between"
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isCategoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isCategoriesOpen && (
                  <div className="pl-6 space-y-1">
                    {categories.map((category, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => {
                          console.log("Selected category:", category);
                          setIsMenuOpen(false);
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Action Buttons */}
              <div className="space-y-2">
                <button
                  className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:text-red-500 transition-colors duration-200"
                  onClick={() => {
                    navigate(`/wishlist`);
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
                  </div>
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </button>

                <button
                  className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => {
                    navigate(`/cart`);
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart</span>
                  </div>
                  <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    2
                  </span>
                </button>

                <button
                  className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => {
                    navigate(`/profile`);
                    setIsMenuOpen(false);
                  }}
                >
                  <UserCircle className="h-5 w-5" />
                  <span>Profile</span>
                </button>

                <button
                  className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  <LogOut className="h-5 w-5" />
                  <span>{loading ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for dropdowns */}
      {(isProfileOpen || isCategoriesOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsCategoriesOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
