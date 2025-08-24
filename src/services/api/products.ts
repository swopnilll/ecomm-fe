// src/services/api/products.ts
import apiClient from "./client";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductSearchParams,
  ProductsResponse,
  BulkStockUpdate,
  ApiResponse,
} from "../../types/product";

const PRODUCTS_BASE_URL = "/api/v1/products";

/**
 * Helper to convert params object to query string
 */
const buildQueryParams = (params?: Record<string, any>): string => {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};

export const productsApi = {
  // ----------------- Public Endpoints -----------------

  getPublishedProducts: async (
    params?: ProductSearchParams
  ): Promise<ProductsResponse> => {
    const query = buildQueryParams(params);
    const response = await apiClient.get<ApiResponse<ProductsResponse>>(
      `${PRODUCTS_BASE_URL}${query ? `?${query}` : ""}`
    );
    return response.data.data;
  },

  getPublishedProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      `${PRODUCTS_BASE_URL}/${id}`
    );
    return response.data.data;
  },

  // ----------------- Employee/Admin Endpoints -----------------

  getAllProducts: async (
    params?: ProductSearchParams
  ): Promise<ProductsResponse> => {
    const query = buildQueryParams(params);
    const response = await apiClient.get<ApiResponse<ProductsResponse>>(
      `${PRODUCTS_BASE_URL}/all${query ? `?${query}` : ""}`
    );
    return response.data.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      `${PRODUCTS_BASE_URL}/all/${id}`
    );
    return response.data.data;
  },

  createProduct: async (productData: CreateProductInput): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>(
      PRODUCTS_BASE_URL,
      productData
    );
    return response.data.data;
  },

  updateProduct: async (
    id: string,
    productData: UpdateProductInput
  ): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `${PRODUCTS_BASE_URL}/${id}`,
      productData
    );
    return response.data.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`${PRODUCTS_BASE_URL}/${id}`);
  },

  publishProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `${PRODUCTS_BASE_URL}/${id}/publish`
    );
    return response.data.data;
  },

  unpublishProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `${PRODUCTS_BASE_URL}/${id}/unpublish`
    );
    return response.data.data;
  },

  addProductImage: async (id: string, imageUrl: string): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `${PRODUCTS_BASE_URL}/${id}/images`,
      {
        imageUrl,
        action: "add",
      }
    );
    return response.data.data;
  },

  removeProductImage: async (
    id: string,
    imageUrl: string
  ): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `${PRODUCTS_BASE_URL}/${id}/images`,
      {
        imageUrl,
        action: "remove",
      }
    );
    return response.data.data;
  },

  updateProductStock: async (
    id: string,
    stockAmount: number
  ): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `${PRODUCTS_BASE_URL}/${id}/stock`,
      {
        stockAmount,
      }
    );
    return response.data.data;
  },

  bulkUpdateStock: async (updates: BulkStockUpdate[]): Promise<void> => {
    await apiClient.patch(`${PRODUCTS_BASE_URL}/bulk-stock`, { updates });
  },

  getLowStockProducts: async (threshold: number = 5): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      `${PRODUCTS_BASE_URL}/low-stock?threshold=${threshold}`
    );
    return response.data.data;
  },

  searchProducts: async (
    searchTerm: string,
    includeUnpublished: boolean = false
  ): Promise<Product[]> => {
    const endpoint = includeUnpublished
      ? `${PRODUCTS_BASE_URL}/search/all`
      : `${PRODUCTS_BASE_URL}/search`;
    const response = await apiClient.get<ApiResponse<Product[]>>(
      `${endpoint}?q=${encodeURIComponent(searchTerm)}`
    );
    return response.data.data;
  },

  getProductsByPriceRange: async (
    minPrice: number,
    maxPrice: number,
    includeUnpublished: boolean = false
  ): Promise<Product[]> => {
    const endpoint = includeUnpublished
      ? `${PRODUCTS_BASE_URL}/price-range/all`
      : `${PRODUCTS_BASE_URL}/price-range`;
    const response = await apiClient.get<ApiResponse<Product[]>>(
      `${endpoint}?minPrice=${minPrice}&maxPrice=${maxPrice}`
    );
    return response.data.data;
  },

  getProductsByCreator: async (creatorId: string): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      `${PRODUCTS_BASE_URL}/creator/${creatorId}`
    );
    return response.data.data;
  },
};
