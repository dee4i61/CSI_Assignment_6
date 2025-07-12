import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Menu,
  Search,
  Star,
  Heart,
  ArrowRight,
  Zap,
  Shield,
  Truck,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getAllCategories } from "../../services/categoryService";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categorySlide, setCategorySlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const heroSlides = [
    {
      title: "Summer Collection 2025",
      subtitle: "Embrace the Latest Trends",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      cta: "Shop Now",
    },
    {
      title: "Premium Quality",
      subtitle: "Luxury Meets Affordability",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
      cta: "Explore Now",
    },
    {
      title: "Free Shipping",
      subtitle: "On Orders Over ₹100",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
      cta: "Get Started",
    },
  ];

  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: "₹199",
      originalPrice: "₹299",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      rating: 4.8,
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: "₹299",
      originalPrice: "₹399",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      rating: 4.9,
      badge: "New",
    },
    {
      id: 3,
      name: "Leather Jacket",
      price: "₹159",
      originalPrice: "₹219",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
      rating: 4.7,
      badge: "Sale",
    },
    {
      id: 4,
      name: "Sneakers",
      price: "₹129",
      originalPrice: "₹179",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      rating: 4.6,
      badge: "Popular",
    },
  ];

  const categoryImages = [
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
    "https://images.unsplash.com/photo-1599623560574-39d485900c95?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(
          response.map((cat, index) => ({
            name: cat.name,
            description: cat.description,
            isActive: cat.isActive,
            image: categoryImages[index % categoryImages.length], // Cycle through the 4 images
          }))
        );
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategorySlide = (direction) => {
    if (direction === "next") {
      setCategorySlide((prev) => (prev + 1) % Math.ceil(categories.length / 4));
    } else {
      setCategorySlide(
        (prev) =>
          (prev - 1 + Math.ceil(categories.length / 4)) %
          Math.ceil(categories.length / 4)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/60" />
            </div>
            <div className="relative h-full flex items-center justify-center text-center text-white">
              <div className="max-w-4xl mx-auto px-4 transform transition-all duration-500 ease-out translate-y-0 opacity-100">
                <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight animate-fadeInUp">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl mb-8 opacity-90">
                  {slide.subtitle}
                </p>
                <button className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-8 py-3 rounded-full text-lg font-semibold hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-blue-400 scale-125" : "bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                desc: "On all orders over ₹100",
              },
              {
                icon: Shield,
                title: "Secure Payment",
                desc: "100% encrypted transactions",
              },
              {
                icon: Phone,
                title: "24/7 Support",
                desc: "Always here to help",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
                  <feature.icon className="h-7 w-7 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg">
              Explore our curated collections
            </p>
          </div>
          {loading ? (
            <div className="text-center">Loading categories...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${categorySlide * 100}%)` }}
                >
                  {categories.map((category, index) => (
                    <div
                      key={category._id || index}
                      className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-4"
                    >
                      <div className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
                        <div className="relative overflow-hidden rounded-xl shadow-md">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h3 className="text-lg font-semibold mb-1">
                              {category.name}
                            </h3>
                            <p className="text-sm opacity-90 line-clamp-2">
                              {category.description}
                            </p>
                            <p className="text-xs mt-1">
                              Status:{" "}
                              <span
                                className={
                                  category.isActive
                                    ? "text-green-300"
                                    : "text-red-300"
                                }
                              >
                                {category.isActive ? "Active" : "Inactive"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {categories.length > 4 && (
                <>
                  <button
                    onClick={() => handleCategorySlide("prev")}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => handleCategorySlide("next")}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg">Discover our top picks</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {product.badge}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Heart className="h-5 w-5 text-white hover:text-red-400 cursor-pointer" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">
                        {product.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {product.originalPrice}
                      </span>
                    </div>
                    <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
