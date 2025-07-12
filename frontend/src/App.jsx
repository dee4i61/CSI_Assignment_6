import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { Provider } from "react-redux";
import store from "./redux/store";
import { fetchUser } from "./redux/slices/userSlice";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Product from "./components/product/Product";
import Profile from "./components/auth/Profile";
import ProductDetail from "./components/product/ProductDetail";
import Navbar from "./components/Navbar/Navbar";
import Wishlist from "./components/wishlist/Wishlist";
import Home from "./components/Home/Home";
import Cart from "./components/Cart/Cart";
import Footer from "./components/Footer/Footer";
import About from "./components/Home/About";
import ContactUs from "./components/Home/ContactUs";
import Orders from "./components/order/Orders";
import OrderDetails from "./components/order/OrderDetails";
import Checkout from "./components/Cart/Checkout";

// Wrapper to allow use of hooks inside Router
const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Routes where Navbar and Footer should be hidden
  const hiddenPaths = ["/login", "/register"];
  const shouldShowLayout = !hiddenPaths.includes(location.pathname);

  return (
    <div className="App min-h-screen flex flex-col">
      {shouldShowLayout && <Navbar />}

      <div className="flex-grow">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/products" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>

      {shouldShowLayout && <Footer />}
    </div>
  );
};

const InnerApp = () => (
  <Router>
    <AppContent />
  </Router>
);

const App = () => (
  <Provider store={store}>
    <InnerApp />
  </Provider>
);

export default App;
