const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone_no: {
      type: String,
      maxlength: 20,
    },
    subject: {
      type: String,
      maxlength: 150,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: 2000,
    },
    responded: {
      type: Boolean,
      default: false,
    },
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
