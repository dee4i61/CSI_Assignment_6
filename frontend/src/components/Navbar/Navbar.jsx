import React, { useState, useEffect } from "react";
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
  LogIn,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import { getAllCategories } from "../../services/categoryService";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        setCategoryError(error.message || "Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

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

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-blue-50 shadow-md border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* First Row: Logo, Search, and Action Icons */}
        <div className="flex justify-between items-center mb-3">
          {/* Left: Logo */}
          <div className="flex items-center">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base">P</span>
              </div>
              <span className="text-xl font-semibold text-blue-900 hidden sm:block">
                PopMart
              </span>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="relative hidden md:block flex-1 mx-4 max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search products..."
              className="w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-blue-50 text-blue-900 placeholder-blue-400 text-sm"
            />
            <button
              onClick={handleSearch}
              className="absolute left-3 top-2.5 text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Right: Action Icons */}
          <div className="flex items-center space-x-4">
            <button
              className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
              onClick={() => navigate("/wishlist")}
            >
              <Heart className="h-5 w-5 group-hover:scale-105 transition-transform duration-200" />
            </button>
            <button
              className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5 group-hover:scale-105 transition-transform duration-200" />
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-1 p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  <User className="h-5 w-5" />
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-blue-100 py-2 z-50">
                    <button
                      className="w-full text-left px-4 py-2 text-blue-700 hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 flex items-center space-x-2 text-sm"
                      onClick={() => {
                        navigate("/profile");
                        setIsProfileOpen(false);
                      }}
                    >
                      <UserCircle className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-blue-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center space-x-2 text-sm disabled:opacity-50"
                      onClick={handleLogout}
                      disabled={loading}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{loading ? "Logging out..." : "Logout"}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  className="text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors duration-200"
                  onClick={() => navigate("/login")}
                >
                  <span className="hidden sm:inline">Login</span>
                  <LogIn className="h-5 w-5 sm:hidden" />
                </button>
                <span className="text-blue-500">/</span>
                <button
                  className="text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors duration-200"
                  onClick={() => navigate("/signup")}
                >
                  <span className="hidden sm:inline">Signup</span>
                  <UserCircle className="h-5 w-5 sm:hidden" />
                </button>
              </div>
            )}
            <button
              className="md:hidden p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Second Row: Navigation Links and Categories */}
        <div className="hidden md:flex justify-center space-x-6">
          <div className="relative">
            <button
              onClick={toggleCategories}
              className="flex items-center space-x-1 py-2 text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors duration-200 border-b-2 border-transparent hover:border-blue-500"
            >
              <span>Categories</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isCategoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isCategoriesOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-blue-100 py-2 z-50">
                {categoryError ? (
                  <div className="px-4 py-2 text-red-600 text-sm">
                    Error: {categoryError}
                  </div>
                ) : categories.length === 0 ? (
                  <div className="px-4 py-2 text-blue-600 text-sm">
                    Loading categories...
                  </div>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category._id}
                      className="w-full text-left px-4 py-2 text-blue-700 hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 text-sm"
                      onClick={() => {
                        navigate(
                          `/category/${category.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/&/g, "and")}`
                        );
                        setIsCategoriesOpen(false);
                      }}
                    >
                      {category.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => navigate("/")}
            className="py-2 text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors duration-200 border-b-2 border-transparent hover:border-blue-500"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/products")}
            className="py-2 text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors duration-200 border-b-2 border-transparent hover:border-blue-500"
          >
            Products
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="py-2 text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors duration-200 border-b-2 border-transparent hover:border-blue-500"
          >
            Orders
          </button>
          <button
            onClick={() => navigate("/about")}
            className="py-2 text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors duration-200 border-b-2 border-transparent hover:border-blue-500"
          >
            About Us
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="py-2 text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors duration-200 border-b-2 border-transparent hover:border-blue-500"
          >
            Contact Us
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-50 border-t border-blue-200 py-3">
            <div className="px-4 space-y-3">
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-blue-50 text-blue-900 placeholder-blue-400 text-sm"
                />
                <button
                  onClick={handleSearch}
                  className="absolute left-3 top-2.5 text-blue-500 hover:text-blue-700 transition-colors duration-200"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                <div className="border-t border-blue-200 pt-2">
                  <button
                    onClick={toggleCategories}
                    className="w-full text-left px-4 py-2 text-blue-700 hover:text-blue-900 font-medium text-sm flex items-center justify-between"
                  >
                    <span>Categories</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isCategoriesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isCategoriesOpen && (
                    <div className="pl-6 space-y-2 mt-2">
                      {categoryError ? (
                        <div className="px-4 py-2 text-red-600 text-sm">
                          Error: {categoryError}
                        </div>
                      ) : categories.length === 0 ? (
                        <div className="px-4 py-2 text-blue-600 text-sm">
                          Loading categories...
                        </div>
                      ) : (
                        categories.map((category) => (
                          <button
                            key={category._id}
                            className="w-full text-left px-4 py-2 text-blue-600 hover:text-blue-900 text-sm transition-colors duration-200"
                            onClick={() => {
                              navigate(
                                `/category/${category.name
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")
                                  .replace(/&/g, "and")}`
                              );
                              setIsMenuOpen(false);
                              setIsCategoriesOpen(false);
                            }}
                          >
                            {category.name}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <button
                  className="w-full text-left px-4 py-2 text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors duration-200"
                  onClick={() => {
                    navigate("/");
                    setIsMenuOpen(false);
                  }}
                >
                  Home
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors duration-200"
                  onClick={() => {
                    navigate("/products");
                    setIsMenuOpen(false);
                  }}
                >
                  Products
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors duration-200"
                  onClick={() => {
                    navigate("/orders");
                    setIsMenuOpen(false);
                  }}
                >
                  Orders
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors duration-200"
                  onClick={() => {
                    navigate("/about");
                    setIsMenuOpen(false);
                  }}
                >
                  About Us
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors duration-200"
                  onClick={() => {
                    navigate("/contact");
                    setIsMenuOpen(false);
                  }}
                >
                  Contact Us
                </button>
              </div>

              {/* Mobile Action Buttons */}
              <div className="border-t border-blue-200 pt-3 space-y-2">
                <button
                  className="w-full flex items-center space-x-2 px-4 py-2 text-blue-700 hover:text-red-500 text-sm transition-colors duration-200"
                  onClick={() => {
                    navigate("/wishlist");
                    setIsMenuOpen(false);
                  }}
                >
                  <Heart className="h-4 w-4" />
                  <span>Wishlist</span>
                </button>
                <button
                  className="w-full flex items-center space-x-2 px-4 py-2 text-blue-700 hover:text-blue-900 text-sm transition-colors duration-200"
                  onClick={() => {
                    navigate("/cart");
                    setIsMenuOpen(false);
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart</span>
                </button>
                {user ? (
                  <>
                    <button
                      className="w-full flex items-center space-x-2 px-4 py-2 text-blue-700 hover:text-blue-900 text-sm transition-colors duration-200"
                      onClick={() => {
                        navigate("/virtual-assistant");
                        setIsMenuOpen(false);
                      }}
                    >
                      <UserCircle className="h-4 w-4" />
                      <span>Virtual Assistant</span>
                    </button>
                    <button
                      className="w-full flex items-center space-x-2 px-4 py-2 text-blue-700 hover:text-blue-900 text-sm transition-colors duration-200"
                      onClick={() => {
                        navigate("/profile");
                        setIsMenuOpen(false);
                      }}
                    >
                      <UserCircle className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      className="w-full flex items-center space-x-2 px-4 py-2 text-blue-700 hover:text-red-600 text-sm transition-colors duration-200 disabled:opacity-50"
                      onClick={handleLogout}
                      disabled={loading}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{loading ? "Logging out..." : "Logout"}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="w-full flex items-center space-x-2 px-4 py-2 text-blue-700 hover:text-blue-900 text-sm transition-colors duration-200"
                      onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Login</span>
                    </button>
                    <button
                      className="w-full flex items-center space-x-2 px-4 py-2 text-blue-700 hover:text-blue-900 text-sm transition-colors duration-200"
                      onClick={() => {
                        navigate("/signup");
                        setIsMenuOpen(false);
                      }}
                    >
                      <UserCircle className="h-4 w-4" />
                      <span>Signup</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
