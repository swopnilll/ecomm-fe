import React from "react";

export default function About() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* About Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Our Company
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are dedicated to providing high-quality products and an
            exceptional shopping experience.
          </p>
        </div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              Founded in 2025, we have a simple idea: to create a
              marketplace without advertisements.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You will only find famous tech gadgets and accessories that we
              love and trust.
            </p>
          </div>

          {/* Placeholder Image */}
          <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <img
              src="https://placehold.co/600x400/F3F4F6/9CA3AF?text=Our+Team"
              alt="Our Team"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Mission Statement Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            To inspire and delight our customers by offering a seamless blend of
            curated products, exceptional service, and a community built on
            trust and passion.
          </p>
        </div>
      </div>
    </div>
  );
}
