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
import { Heart, ShoppingCart, Star, Package, Loader2 } from "lucide-react";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        console.log("response", response);
        setProducts(response.products || []);
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

    fetchProducts();
  }, []);

  // Fetch user's cart and wishlist on component mount
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCartItems(user._id));
      dispatch(fetchWishlist(user._id));
    }
  }, [user?._id, dispatch]);

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

      // Show success message
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
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-4 h-4 fill-yellow-400/50 text-yellow-400"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  if (loading) {
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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
        <p className="text-gray-600 text-lg">
          Discover amazing products at great prices
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 cursor-pointer group"
            onClick={() => handleProductClick(product._id)}
          >
            {/* Product Image */}
            <div className="relative overflow-hidden">
              <img
                src={
                  product.images?.[0]?.url || "https://via.placeholder.com/300"
                }
                alt={product.name}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Wishlist Heart Icon */}
              <button
                onClick={(e) => handleWishlistToggle(e, product._id)}
                disabled={actionLoading[`wishlist_${product._id}`]}
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  isProductInWishlist(product._id)
                    ? " text-red-600"
                    : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
                }`}
              >
                {actionLoading[`wishlist_${product._id}`] ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Heart
                    className={`w-5 h-5 ${
                      isProductInWishlist(product._id) ? "fill-current" : ""
                    }`}
                  />
                )}
              </button>

              {/* Stock Badge */}
              {product.Stock <= 5 && product.Stock > 0 && (
                <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Only {product.Stock} left
                </div>
              )}

              {product.Stock === 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h2>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex items-center space-x-1">
                  {renderStars(product.ratings || 0)}
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  ({product.numOfReviews || 0} reviews)
                </span>
              </div>

              {/* Price and Stock */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  ${product.price?.toFixed(2)}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Package className="w-4 h-4 mr-1" />
                  <span>{product.Stock} in stock</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={(e) => handleAddToCart(e, product._id)}
                disabled={
                  product.Stock === 0 || actionLoading[`cart_${product._id}`]
                }
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  product.Stock === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isProductInCart(product._id)
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg"
                }`}
              >
                {actionLoading[`cart_${product._id}`] ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
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
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No products found
          </h3>
          <p className="text-gray-500">Check back later for new products!</p>
        </div>
      )}
    </div>
  );
};

export default Product;
