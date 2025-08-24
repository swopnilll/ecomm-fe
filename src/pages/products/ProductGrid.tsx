import { useState } from "react";
import { usePublishedProducts } from "../../hooks/products/useProducts";
import type { Product } from "../../types/product";

export default function ProductGrid() {
  const { data: publishedProducts, isLoading, error } = usePublishedProducts();

  const [showOnlyInStock, setShowOnlyInStock] = useState<boolean>(false);

  // Transform API data to match the component's needs
  const products: Product[] = Array.isArray(publishedProducts)
    ? publishedProducts
    : publishedProducts?.products || [];

  const filteredProducts = products.filter((product) => {
    const stockMatch = !showOnlyInStock || product.stockAmount > 0;
    return stockMatch && !product.isDeleted && product.status === "published";
  });

  const formatPrice = (price: number, taxRate: number) => {
    const priceWithTax = price + (price * taxRate) / 100;
    return `$${priceWithTax.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Loading products...
            </h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center py-16">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error loading products
            </h3>
            <p className="text-gray-600">Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Products
          </h1>
          <p className="text-lg text-gray-600">
            Discover our carefully curated collection of premium items
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex items-center justify-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyInStock}
              onChange={(e) => setShowOnlyInStock(e.target.checked)}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
            />
            <span className="text-sm text-gray-700">In stock only</span>
          </label>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img
                  alt={product.name}
                  src={
                    product.images[0] ||
                    "https://via.placeholder.com/400x400?text=No+Image"
                  }
                  className="aspect-square w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.stockAmount === 0 && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(product.basePrice, product.taxRate)}
                  </p>
                  <span className="text-sm text-gray-500">
                    {product.stockAmount} in stock
                  </span>
                </div>

                <button
                  className="w-full mt-4 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.stockAmount === 0}
                >
                  {product.stockAmount > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
