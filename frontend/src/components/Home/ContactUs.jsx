import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
} from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    orderNumber: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        orderNumber: "",
      });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Your message has been sent successfully. We'll get back to you
            within 24 hours.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're here to help! Get in touch with our team for any questions,
          support, or feedback.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Send us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="order-inquiry">Order Inquiry</option>
                  <option value="product-question">Product Question</option>
                  <option value="shipping-delivery">Shipping & Delivery</option>
                  <option value="return-refund">Return & Refund</option>
                  <option value="technical-support">Technical Support</option>
                  <option value="general-feedback">General Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="orderNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Order Number (optional)
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., #12345"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us how we can help you..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">support@yourstore.com</p>
                  <p className="text-sm text-gray-500">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Address
                  </h3>
                  <p className="text-gray-600">
                    123 Commerce Street
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Business Hours
                  </h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: 10:00 AM - 4:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Quick Help
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900">Order Status</h3>
                <p className="text-sm text-gray-600">
                  Track your order using the tracking number sent to your email.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900">Returns</h3>
                <p className="text-sm text-gray-600">
                  Easy returns within 30 days of purchase. No questions asked.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900">Shipping</h3>
                <p className="text-sm text-gray-600">
                  Free shipping on orders over $50. Express delivery available.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-900">Live Chat</h3>
                <p className="text-sm text-gray-600">
                  Available 24/7 for instant help and support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Help Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
        <MessageSquare className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Need Immediate Help?</h2>
        <p className="text-lg mb-6">
          Our live chat support is available 24/7 for urgent questions and
          immediate assistance.
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Start Live Chat
        </button>
      </div>
    </div>
  );
};

export default ContactUs;
