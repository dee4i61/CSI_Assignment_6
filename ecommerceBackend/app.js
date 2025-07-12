const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bodyParser = require("body-parser");

// Import Routes
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoute");
const orderRoutes = require("./routes/orderRoute");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoriesRoutes = require("./routes/categoryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const addressRoutes = require("./routes/addressRoutes");

// Initialize express app
const app = express();

// Connect to DB
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

connectDB();
// Middleware
// app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1", contactRoutes);
app.use("/api/v1/addresses", addressRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
