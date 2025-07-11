import React, { useState, useEffect } from "react";
import { getAllCategories } from "../../services/categoryService";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  IndianRupee,
  Grid,
  Loader2,
} from "lucide-react";

const ProductSidebar = ({
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
  isMobile = false,
}) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    sort: true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handlePriceChange = (type, value) => {
    const newFilters = { ...filters };
    if (type === "min") {
      newFilters.minPrice = value;
    } else {
      newFilters.maxPrice = value;
    }
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Filters Content */}
      <div
        className="flex-1 p-6 space-y-6 overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitScrollbar: { display: "none" },
        }}
      >
        {/* Category Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection("category")}
            className="flex items-center justify-between w-full group"
          >
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              Category
            </h3>
            <div className="p-1 rounded-full group-hover:bg-gray-100 transition-colors">
              {expandedSections.category ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </button>

          {expandedSections.category && (
            <div className="space-y-2 ml-2">
              {loadingCategories ? (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-600">
                    Loading categories...
                  </span>
                </div>
              ) : (
                <>
                  {/* <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="category"
                      checked={!filters.category}
                      onChange={() => handleFilterChange("category", "")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      All Categories
                    </span>
                  </label> */}
                  {categories.map((category) => (
                    <label
                      key={category._id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category._id}
                        onChange={() =>
                          handleFilterChange("category", category._id)
                        }
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full group"
          >
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              Price Range
            </h3>
            <div className="p-1 rounded-full group-hover:bg-gray-100 transition-colors">
              {expandedSections.price ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </button>

          {expandedSections.price && (
            <div className="space-y-2 ml-2">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg">
                  <IndianRupee className="w-4 h-4 text-gray-600" />
                </div>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ""}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-400 font-medium">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ""}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Quick Price Ranges */}
              <div className="space-y-2">
                {[
                  { label: "Under ₹2,000", min: 0, max: 2000 },
                  { label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
                  { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
                  { label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
                  { label: "Over ₹20,000", min: 20000, max: "" },
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      handlePriceChange("min", range.min);
                      handlePriceChange("max", range.max);
                    }}
                    className={`text-left text-sm p-3 rounded-lg w-full transition-all duration-200 ${
                      filters.minPrice == range.min &&
                      filters.maxPrice == range.max
                        ? "bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 border-2 border-transparent"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rating Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection("rating")}
            className="flex items-center justify-between w-full group"
          >
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              Rating
            </h3>
            <div className="p-1 rounded-full group-hover:bg-gray-100 transition-colors">
              {expandedSections.rating ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </button>

          {expandedSections.rating && (
            <div className="space-y-2 ml-2">
              {[4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.ratings === rating}
                    onChange={() => handleFilterChange("ratings", rating)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderStars(rating)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      & up
                    </span>
                  </div>
                </label>
              ))}
              <label className=" coagulable items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="rating"
                  checked={!filters.ratings}
                  onChange={() => handleFilterChange("ratings", "")}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  All Ratings
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Sort Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection("sort")}
            className="flex items-center justify-between w-full group"
          >
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              Sort By
            </h3>
            <div className="p-1 rounded-full group-hover:bg-gray-100 transition-colors">
              {expandedSections.sort ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </button>

          {expandedSections.sort && (
            <div className="space-y-2 ml-2">
              {[
                { value: "-createdAt", label: "Newest First" },
                { value: "createdAt", label: "Oldest First" },
                { value: "price", label: "Price: Low to High" },
                { value: "-price", label: "Price: High to Low" },
                { value: "-ratings", label: "Highest Rated" },
                { value: "name", label: "Name: A to Z" },
                { value: "-name", label: "Name: Z to A" },
              ].map((sort) => (
                <label
                  key={sort.value}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="sort"
                    checked={filters.sort === sort.value}
                    onChange={() => handleFilterChange("sort", sort.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {sort.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Close button for mobile */}
      {isMobile && (
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onToggle}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 lg:hidden ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          {sidebarContent}
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="hidden lg:block w-80 bg-white shadow-sm h-full">
      {sidebarContent}
    </div>
  );
};

export default ProductSidebar;
