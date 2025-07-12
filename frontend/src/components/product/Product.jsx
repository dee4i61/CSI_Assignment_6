import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllProducts } from "../../services/productServices";
import { addItemToCart, fetchCartItems } from "../../redux/slices/cartSlice";
import {
  addProductToWishlist,
  removeProductFromWishlist,
  fetchWishlist,
} from "../../redux/slices/wishlistSlice";
import {
  Heart,
  ShoppingCart,
  Star,
  Package,
  Loader2,
  Filter,
  Search,
} from "lucide-react";
import ProductSidebar from "./ProductSidebar";
import CategoryBar from "./CategoryBar";
import Pagination from "./Pagination";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Fetch products with filters and pagination
  const fetchProducts = async (page = 1, currentFilters = {}, keyword = "") => {
    try {
      setLoading(true);
      const queryParams = {
        page,
        limit: pagination.itemsPerPage,
        ...currentFilters,
        ...(keyword && { keyword }),
      };

      const response = await getAllProducts(queryParams);
      setProducts(response.products || []);
      setPagination((prev) => ({
        ...prev,
        currentPage: response.page || 1,
        totalPages: Math.ceil(response.productsCount / pagination.itemsPerPage),
        totalItems: response.productsCount || 0,
      }));
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load products";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch user's cart and wishlist on component mount
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCartItems(user._id));
      dispatch(fetchWishlist(user._id));
    }
  }, [user?._id, dispatch]);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    fetchProducts(1, newFilters, searchQuery);
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    const newFilters = { ...filters, category: categoryId };
    setFilters(newFilters);
    fetchProducts(1, newFilters, searchQuery);
  };

  // Handle search
  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      fetchProducts(1, filters, searchQuery);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchProducts(page, filters, searchQuery);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const isProductInWishlist = (productId) => {
    return wishlistItems.some(
      (item) =>
        item.productId === productId || item.productId?._id === productId
    );
  };

  const isProductInCart = (productId) => {
    return cartItems.some(
      (item) =>
        item.productId === productId || item.productId?._id === productId
    );
  };

  const handleWishlistToggle = async (e, productId) => {
    e.stopPropagation();

    if (!user?._id) {
      alert("Please login to add products to wishlist");
      return;
    }

    setActionLoading((prev) => ({ ...prev, [`wishlist_${productId}`]: true }));

    try {
      if (isProductInWishlist(productId)) {
        await dispatch(
          removeProductFromWishlist({
            userId: user._id,
            productId,
          })
        ).unwrap();
      } else {
        await dispatch(
          addProductToWishlist({
            userId: user._id,
            productId,
          })
        ).unwrap();
      }
    } catch (error) {
      console.error("Wishlist action failed:", error);
      alert("Failed to update wishlist. Please try again.");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [`wishlist_${productId}`]: false,
      }));
    }
  };

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();

    if (!user?._id) {
      alert("Please login to add products to cart");
      return;
    }

    setActionLoading((prev) => ({ ...prev, [`cart_${productId}`]: true }));

    try {
      await dispatch(
        addItemToCart({
          userId: user._id,
          productId,
          quantity: 1,
        })
      ).unwrap();

      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Failed to add product to cart. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [`cart_${productId}`]: false }));
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-3 h-3 fill-yellow-400/50 text-yellow-400"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />);
    }

    return stars;
  };

  const ProductCard = ({ product }) => (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group"
      onClick={() => handleProductClick(product._id)}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.images?.[0]?.url || undefined}
          alt={product.name}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => handleWishlistToggle(e, product._id)}
          disabled={actionLoading[`wishlist_${product._id}`]}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isProductInWishlist(product._id)
              ? "bg-red-50 text-red-600"
              : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
          }`}
        >
          {actionLoading[`wishlist_${product._id}`] ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Heart
              className={`w-4 h-4 ${
                isProductInWishlist(product._id) ? "fill-current" : ""
              }`}
            />
          )}
        </button>

        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {product.isBestseller && (
            <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
              Bestseller
            </div>
          )}
          {product.isOnSale && (
            <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
              Sale
            </div>
          )}
          {product.Stock <= 5 && product.Stock > 0 && (
            <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
              {product.Stock} left
            </div>
          )}
          {product.Stock === 0 && (
            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              Out of Stock
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center space-x-1">
            {renderStars(product.ratings || 0)}
          </div>
          <span className="text-xs text-gray-500 ml-2">
            ({product.numOfReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-blue-600">
            ₹{product.price?.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">
            {product.Stock} in stock
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => handleAddToCart(e, product._id)}
          disabled={product.Stock === 0 || actionLoading[`cart_${product._id}`]}
          className={`w-full py-2 px-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm ${
            product.Stock === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isProductInCart(product._id)
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {actionLoading[`cart_${product._id}`] ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>
                {product.Stock === 0
                  ? "Out of Stock"
                  : isProductInCart(product._id)
                  ? "In Cart"
                  : "Add to Cart"}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-500 text-lg font-semibold mb-2">Error</div>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Bar */}
      <CategoryBar
        selectedCategory={filters.category}
        onCategoryChange={handleCategoryChange}
      />

      <div className="flex">
        {/* Mobile Sidebar */}
        <ProductSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          isMobile={true}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Header with Search and Filter Toggle */}
          <div className="bg-white px-4 py-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex items-center space-x-2 max-w-md">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearch}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex">
            {/* Desktop Sidebar */}
            <ProductSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={false}
              onToggle={() => {}}
              isMobile={false}
            />

            {/* Desktop Products Grid */}
            <div className="flex-1 p-6">
              {loading && (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              )}

              {!loading && products.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              ) : (
                <>
                  {/* Results Count */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-600">
                      Showing {products.length} of {pagination.totalItems}{" "}
                      products
                    </p>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                      totalItems={pagination.totalItems}
                      itemsPerPage={pagination.itemsPerPage}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden p-4">
            {loading && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            )}

            {!loading && products.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Showing {products.length} of {pagination.totalItems}{" "}
                    products
                  </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-6">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.itemsPerPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
