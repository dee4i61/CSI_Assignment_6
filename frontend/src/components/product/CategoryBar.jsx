import React, { useState, useEffect } from "react";
import { getAllCategories } from "../../services/categoryService";
import { Grid, ChevronLeft, ChevronRight } from "lucide-react";

const CategoryBar = ({ selectedCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const container = document.getElementById("category-scroll-container");
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  }, [categories, scrollPosition]);

  const scroll = (direction) => {
    const container = document.getElementById("category-scroll-container");
    if (container) {
      const scrollAmount = 200;
      const newScrollLeft =
        container.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
      setScrollPosition(newScrollLeft);
    }
  };

  const handleScroll = (e) => {
    const container = e.target;
    setScrollPosition(container.scrollLeft);
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-full"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-28 rounded-full"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-36 rounded-full"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm py-6 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative flex items-center justify-center">
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 z-10 p-3 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-all duration-300 border border-gray-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}

          {/* Categories Container */}
          <div
            id="category-scroll-container"
            className="flex items-center justify-center space-x-4 overflow-x-auto px-12"
            onScroll={handleScroll}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitScrollbar: { display: "none" },
            }}
          >
            {/* All Categories */}
            {/* <button
              onClick={() => onCategoryChange("")}
              className={`flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap shadow-sm ${
                !selectedCategory
                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
              }`}
            >
              <Grid className="w-5 h-5" />
              <span className="font-medium text-sm">All Categories</span>
            </button> */}

            {/* Individual Categories */}
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => onCategoryChange(category._id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap shadow-sm ${
                  selectedCategory === category._id
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                }`}
              >
                <span className="font-medium text-sm">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Right Scroll Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 z-10 p-3 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-all duration-300 border border-gray-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
