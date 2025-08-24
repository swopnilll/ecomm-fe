import React from "react";
import {
  Save,
  Plus,
  X,
  AlertCircle,
  DollarSign,
  Package,
  Tag,
} from "lucide-react";
import type { Product } from "../../types/product";
import { useProductForm } from "../../hooks/products/useProductForm";

interface ProductAdditionPageProps {
  initialData?: Partial<Product>;
  productId?: string;
  onSuccess?: (product: Product) => void;
  onError?: (error: Error) => void;
}

const ProductAdditionPage: React.FC<ProductAdditionPageProps> = ({
  initialData,
  productId,
  onSuccess,
  onError,
}) => {
  const {
    formData,
    errors,
    touched,
    currentImageUrl,
    imageState,
    handleFieldChange,
    handleFieldBlur,
    handleImageUrlChange,
    addImage,
    removeImage,
    handleSubmit,
    isSubmitting,
    canSubmit,
    hasImages,
    imageCount,
    mutationError,
    resetForm,
  } = useProductForm({
    initialData,
    productId,
    onSuccess,
    onError,
  });

  console.log({canSubmit, isSubmitting, formData, errors, touched});

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <form>
          <div className="space-y-12">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Add New Product
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Create a new product for your store with detailed information
                and images.
              </p>
            </div>

            {/* Basic Information Section */}
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">
                Basic Information
              </h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                Enter the basic details about your product.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8">
                {/* Product Name */}
                <div className="col-span-full">
                  <label
                    htmlFor="name"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Product Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleFieldChange("name", e.target.value)
                      }
                      onBlur={() => handleFieldBlur("name")}
                      className={`block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6 ${
                        errors.name && touched.name
                          ? "outline-red-300 focus:outline-red-500 bg-red-50"
                          : "outline-gray-300 focus:outline-indigo-600 bg-white"
                      }`}
                      placeholder="Enter product name"
                    />
                    {errors.name && touched.name && (
                      <div className="mt-2 flex items-center text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Description */}
                <div className="col-span-full">
                  <label
                    htmlFor="description"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleFieldChange("description", e.target.value)
                      }
                      onBlur={() => handleFieldBlur("description")}
                      className={`block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6 resize-none ${
                        errors.description && touched.description
                          ? "outline-red-300 focus:outline-red-500 bg-red-50"
                          : "outline-gray-300 focus:outline-indigo-600 bg-white"
                      }`}
                      placeholder="Describe your product in detail..."
                    />
                    {errors.description && touched.description && (
                      <div className="mt-2 flex items-center text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.description}
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-sm/6 text-gray-600">
                    Write a detailed description of your product including key
                    features and benefits.
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing & Inventory Section */}
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">
                Pricing & Inventory
              </h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                Set pricing details and manage inventory for your product.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Base Price */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="basePrice"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Base Price
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                      <div className="flex shrink-0 items-center pl-3">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="basePrice"
                        name="basePrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.basePrice}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleFieldChange("basePrice", e.target.value)
                        }
                        onBlur={() => handleFieldBlur("basePrice")}
                        className="block min-w-0 grow bg-white py-1.5 pr-3 pl-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                        placeholder="0.00"
                      />
                    </div>
                    {errors.basePrice && touched.basePrice && (
                      <div className="mt-2 flex items-center text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.basePrice}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tax Rate */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="taxRate"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Tax Rate (%)
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                      <div className="flex shrink-0 items-center pl-3">
                        <Tag className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="taxRate"
                        name="taxRate"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={formData.taxRate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleFieldChange("taxRate", e.target.value)
                        }
                        onBlur={() => handleFieldBlur("taxRate")}
                        className="block min-w-0 grow bg-white py-1.5 pr-3 pl-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                        placeholder="0"
                      />
                    </div>
                    {errors.taxRate && touched.taxRate && (
                      <div className="mt-2 flex items-center text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.taxRate}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stock Amount */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="stockAmount"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Stock Quantity
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                      <div className="flex shrink-0 items-center pl-3">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="stockAmount"
                        name="stockAmount"
                        type="number"
                        min="0"
                        value={formData.stockAmount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleFieldChange("stockAmount", e.target.value)
                        }
                        onBlur={() => handleFieldBlur("stockAmount")}
                        className="block min-w-0 grow bg-white py-1.5 pr-3 pl-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                        placeholder="0"
                      />
                    </div>
                    {errors.stockAmount && touched.stockAmount && (
                      <div className="mt-2 flex items-center text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.stockAmount}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="status"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Status
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleFieldChange(
                          "status",
                          e.target.value as "draft" | "published"
                        )
                      }
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Images Section */}
            <div className="border-b border-gray-900/10 pb-12">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base/7 font-semibold text-gray-900">
                    Product Images
                  </h2>
                  <p className="mt-1 text-sm/6 text-gray-600">
                    Add images to showcase your product.
                  </p>
                </div>
                {hasImages && (
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/10">
                    {imageCount} image{imageCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="mt-10 space-y-8">
                {/* Add Image URL */}
                <div>
                  <label
                    htmlFor="imageUrl"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Image URL
                  </label>
                  <div className="mt-2 flex gap-4">
                    <div className="flex-1">
                      <input
                        id="imageUrl"
                        name="imageUrl"
                        type="url"
                        value={currentImageUrl}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleImageUrlChange(e.target.value)
                        }
                        className={`block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6 ${
                          imageState.error
                            ? "outline-red-300 focus:outline-red-500 bg-red-50"
                            : "outline-gray-300 focus:outline-indigo-600 bg-white"
                        }`}
                        placeholder="https://example.com/image.jpg"
                      />
                      {imageState.error && (
                        <div className="mt-2 flex items-center text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {imageState.error}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={addImage}
                      disabled={!imageState.isValid || !currentImageUrl.trim()}
                      className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                </div>

                {/* Image Gallery */}
                {hasImages && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                      Added Images
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {formData.images.map((imageUrl, index) => (
                        <div
                          key={index}
                          className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
                        >
                          <img
                            src={imageUrl}
                            alt={`Product image ${index + 1}`}
                            className="h-full w-full object-cover group-hover:opacity-75 transition-opacity"
                            onError={(
                              e: React.SyntheticEvent<HTMLImageElement>
                            ) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMTJMMTEgMTRMMTUgMTBNMjEgMTJDMjEgMTYuOTcwNiAxNi45NzA2IDIxIDEyIDIxQzcuMDI5NDQgMjEgMyAxNi45NzA2IDMgMTJDMyA3LjAyOTQ0IDcuMDI5NDQgMyAxMiAzQzE2Ljk3MDYgMyAyMSA3LjAyOTQ0IDIxIDEyWiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(imageUrl)}
                            className="absolute top-2 right-2 inline-flex items-center rounded-md bg-red-600 p-1 text-white shadow-sm hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                            <p className="text-white text-sm font-medium truncate">
                              Image {index + 1}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              onClick={resetForm}
              className="text-sm/6 font-semibold text-gray-900 hover:text-gray-700"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Product"}
            </button>
          </div>

          {/* Error Display */}
          {mutationError && (
            <div className="mt-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error saving product
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      {mutationError.message ||
                        "An unexpected error occurred. Please try again."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProductAdditionPage;
