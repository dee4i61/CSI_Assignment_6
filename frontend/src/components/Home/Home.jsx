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
} from "lucide-react";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const heroSlides = [
    {
      title: "Summer Collection 2024",
      subtitle: "Discover the latest trends",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      cta: "Shop Now",
    },
    {
      title: "Premium Quality",
      subtitle: "Luxury at your fingertips",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
      cta: "Explore",
    },
    {
      title: "Free Shipping",
      subtitle: "On orders over $100",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
      cta: "Get Started",
    },
  ];

  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: "$199",
      originalPrice: "$299",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      rating: 4.8,
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: "$299",
      originalPrice: "$399",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      rating: 4.9,
      badge: "New",
    },
    {
      id: 3,
      name: "Leather Jacket",
      price: "$159",
      originalPrice: "$219",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
      rating: 4.7,
      badge: "Sale",
    },
    {
      id: 4,
      name: "Sneakers",
      price: "$129",
      originalPrice: "$179",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      rating: 4.6,
      badge: "Popular",
    },
  ];

  const categories = [
    {
      name: "Electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop",
      count: "120+ items",
    },
    {
      name: "Fashion",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop",
      count: "85+ items",
    },
    {
      name: "Home & Garden",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
      count: "95+ items",
    },
    {
      name: "Sports",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      count: "65+ items",
    },
  ];

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="relative h-full flex items-center justify-center text-center text-white">
              <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-6xl md:text-8xl font-bold mb-6 animate-pulse">
                  {slide.title}
                </h2>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  {slide.subtitle}
                </p>
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform shadow-2xl">
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">
                Free shipping on all orders over $100
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                100% secure and encrypted transactions
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg">
              Discover our wide range of premium products
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm opacity-90">{category.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg">
              Hand-picked items just for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {product.badge}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-6 w-6 text-white hover:text-red-500 cursor-pointer" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
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
                      <span className="text-2xl font-bold text-gray-900">
                        {product.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {product.originalPrice}
                      </span>
                    </div>
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-full hover:scale-110 transition-transform">
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Zap className="h-12 w-12 text-white mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Stay in the Loop
            </h2>
            <p className="text-xl text-white/90">
              Get exclusive deals and the latest updates delivered to your inbox
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
              Subscribe
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
