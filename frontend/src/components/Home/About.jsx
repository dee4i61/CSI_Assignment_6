import React from "react";
import { Heart, Shield, Truck, Users } from "lucide-react";

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're passionate about bringing you the best products with exceptional
          service. Our journey started with a simple idea: make online shopping
          a delightful experience for everyone.
        </p>
      </div>

      {/* Story Section */}
      <div className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2020, we began as a small team with a big vision. We
              noticed that online shopping often felt impersonal and
              complicated. We wanted to change that by creating a platform that
              combines the convenience of online shopping with the personal
              touch of a local store.
            </p>
            <p className="text-gray-600 mb-4">
              Today, we've grown into a trusted destination for thousands of
              customers worldwide. Our commitment to quality, customer service,
              and innovation remains at the heart of everything we do.
            </p>
            <p className="text-gray-600">
              Every product we offer is carefully selected by our team, ensuring
              that our customers receive only the best. We believe that shopping
              should be enjoyable, not stressful.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">50,000+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Our Values
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Quality First
            </h3>
            <p className="text-gray-600">
              We never compromise on quality. Every product is thoroughly tested
              and vetted before it reaches our customers.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Fast Delivery
            </h3>
            <p className="text-gray-600">
              Your time is valuable. We ensure quick processing and reliable
              shipping to get your orders to you as fast as possible.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Customer Care
            </h3>
            <p className="text-gray-600">
              Our dedicated support team is here to help. We believe in building
              lasting relationships with our customers.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            To revolutionize online shopping by providing exceptional products,
            outstanding customer service, and a seamless shopping experience
            that exceeds expectations. We're committed to building trust,
            fostering innovation, and creating value for our customers,
            partners, and communities.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Meet Our Team
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">DJ</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Deepika Jangid
            </h3>
            <p className="text-gray-600 mb-2">CEO & Founder</p>
            <p className="text-sm text-gray-500">
              10+ years in ecommerce, passionate about customer experience and
              innovation.
            </p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">DJ</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Deepika Jangid
            </h3>
            <p className="text-gray-600 mb-2">Head of Operations</p>
            <p className="text-sm text-gray-500">
              Logistics expert ensuring every order is processed efficiently and
              accurately.
            </p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">DJ</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Deepika Jangid
            </h3>
            <p className="text-gray-600 mb-2">Customer Success Manager</p>
            <p className="text-sm text-gray-500">
              Dedicated to ensuring every customer has an amazing experience
              with us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
