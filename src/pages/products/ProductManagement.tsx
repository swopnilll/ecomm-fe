import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  TrashIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

import {
  useProduct,
  useDeleteProduct,
  useToggleProductStatus,
  useAllProducts,
} from "../../hooks/products/useProducts";
import type { Product, ProductSearchParams } from "../../types/product";

const ProductManagement = () => {
  const [params, setParams] = useState<ProductSearchParams>({
    page: 1,
    limit: 10,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Query hook
  const {
    data: productsResponse,
    isLoading,
    error,
    refetch,
  } = useAllProducts(params);

  console.log("Products Response:", productsResponse);

  // Mutation hooks
  const { toggleStatus, isLoading: isToggling } = useToggleProductStatus();
  const deleteMutation = useDeleteProduct();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleSearch = () => {
    const newParams: ProductSearchParams = { ...params, page: 1 };
    if (searchTerm) newParams.search = searchTerm;
    if (statusFilter) newParams.status = statusFilter as "draft" | "published";
    setParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setParams({ page: 1, limit: 10 });
  };

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleToggleStatus = (productId: string, currentStatus: string) => {
    toggleStatus(productId, currentStatus);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${productName}? This action cannot be undone.`
      )
    ) {
      deleteMutation.mutate(productId);
    }
  };

  // Extract products and pagination from the response
  const products = productsResponse?.products || [];
  const pagination = productsResponse?.pagination;

  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error Loading Products
          </h3>
          <p className="text-red-600 mb-4">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans antialiased p-4 md:p-8">
      <div className="container mx-auto">
        <div className="bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="px-4 md:px-6 py-5 border-b border-gray-200 bg-white">
            <h2 className="text-2xl font-bold text-gray-900">
              Product Management
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage products, their details, and status
            </p>
          </div>

          {/* Filters */}
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              {/* Search Input */}
              <div className="flex-1 w-full">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Search Products
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or SKU..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-auto">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                >
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full lg:w-auto mt-2 lg:mt-0">
                <button
                  onClick={handleSearch}
                  className="w-full lg:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Search
                </button>
                <button
                  onClick={handleClearFilters}
                  className="w-full lg:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors flex justify-center items-center"
                  title="Clear filters"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Table View (hidden on small screens) */}
          <div className="hidden md:block overflow-x-auto relative">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-gray-500 ml-2">
                          Loading products...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium mb-2">
                          No products found
                        </h3>
                        <p className="text-sm">
                          {searchTerm || statusFilter
                            ? "Try adjusting your search filters"
                            : "Get started by creating your first product"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product.images?.[0] ||
                              "https://placehold.co/40x40/f1f5f9/94a3b8?text=Img"
                            }
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover flex-shrink-0 border"
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        $
                        {product.basePrice
                          ? product.basePrice.toFixed(2)
                          : "N/A"}
                        {product.finalPrice &&
                          product.finalPrice !== product.basePrice && (
                            <div className="text-xs text-gray-500">
                              Final: ${product.finalPrice.toFixed(2)}
                            </div>
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`${
                            product.stockAmount && product.stockAmount <= 5
                              ? "text-red-600 font-medium"
                              : product.stockAmount && product.stockAmount <= 10
                              ? "text-yellow-600"
                              : "text-gray-900"
                          }`}
                        >
                          {product.stockAmount ?? 0}
                        </span>
                        <div className="text-xs text-gray-500">
                          {product.isInStock ? "In Stock" : "Out of Stock"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* Menu Dropdown - custom implementation */}
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === product._id ? null : product._id
                              )
                            }
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isToggling || deleteMutation.isPending}
                            aria-expanded={openMenuId === product._id}
                          >
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </button>

                          {openMenuId === product._id && (
                            <div className="absolute right-0 z-50 mt-2 w-40 bg-white rounded-md shadow-lg border ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="py-1 flex flex-col">
                                <button
                                  onClick={() =>
                                    handleToggleStatus(
                                      product._id,
                                      product.status
                                    )
                                  }
                                  disabled={isToggling}
                                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 text-left"
                                >
                                  {product.status === "published"
                                    ? "Unpublish"
                                    : "Publish"}
                                </button>
                                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                                  <PencilSquareIcon className="h-4 w-4 inline mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(
                                      product._id,
                                      product.name
                                    )
                                  }
                                  disabled={deleteMutation.isPending}
                                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 text-left"
                                >
                                  <TrashIcon className="h-4 w-4 inline mr-2" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (visible on small screens) */}
          <div className="block md:hidden">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="flex justify-center items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-500 ml-2">
                    Loading products...
                  </span>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-gray-500">
                  <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">
                    No products found
                  </h3>
                  <p className="text-sm">
                    {searchTerm || statusFilter
                      ? "Try adjusting your search filters"
                      : "Get started by creating your first product"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="p-4 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={
                          product.images?.[0] ||
                          "https://placehold.co/60x60/f1f5f9/94a3b8?text=Img"
                        }
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover flex-shrink-0 border"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="text-base font-medium text-gray-900 truncate">
                            {product.name}
                          </h3>
                          {/* Menu Dropdown - custom implementation */}
                          <div className="relative inline-block text-left">
                            <button
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === product._id
                                    ? null
                                    : product._id
                                )
                              }
                              className="p-2 text-gray-400 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={isToggling || deleteMutation.isPending}
                              aria-expanded={openMenuId === product._id}
                            >
                              <EllipsisVerticalIcon className="h-5 w-5" />
                            </button>

                            {openMenuId === product._id && (
                              <div className="absolute right-0 z-50 mt-2 w-40 bg-white rounded-md shadow-lg border ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1 flex flex-col">
                                  <button
                                    onClick={() =>
                                      handleToggleStatus(
                                        product._id,
                                        product.status
                                      )
                                    }
                                    disabled={isToggling}
                                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 text-left"
                                  >
                                    {product.status === "published"
                                      ? "Unpublish"
                                      : "Publish"}
                                  </button>
                                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                                    <PencilSquareIcon className="h-4 w-4 inline mr-2" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteProduct(
                                        product._id,
                                        product.name
                                      )
                                    }
                                    disabled={deleteMutation.isPending}
                                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 text-left"
                                  >
                                    <TrashIcon className="h-4 w-4 inline mr-2" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span className="font-medium text-gray-900">
                            $
                            {product.basePrice
                              ? product.basePrice.toFixed(2)
                              : "N/A"}
                          </span>
                          <span
                            className={`${
                              product.stockAmount && product.stockAmount <= 5
                                ? "text-red-600 font-medium"
                                : product.stockAmount &&
                                  product.stockAmount <= 10
                                ? "text-yellow-600"
                                : "text-gray-600"
                            }`}
                          >
                            Stock: {product.stockAmount ?? 0}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              product.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {product.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-6 py-4 border-t border-gray-200 bg-white gap-4">
              <p className="text-sm text-gray-600 text-center sm:text-left">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Previous page"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Next page"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
