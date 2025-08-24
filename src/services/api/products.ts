import apiClient from "./client";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductSearchParams,
  ProductsResponse,
  BulkStockUpdate,
  ApiSuccessResponse,
  ApiErrorResponse,
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

// ----------------- Public Endpoints -----------------

export const getPublishedProducts = async (
  params?: ProductSearchParams
): Promise<ProductsResponse> => {
  const query = buildQueryParams(params);
  try {
    const response = await apiClient.get<ProductsResponse>(
      `${PRODUCTS_BASE_URL}${query ? `?${query}` : ""}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch published products.");
  }
};

export const getPublishedProduct = async (id: string): Promise<Product> => {
  try {
    const response = await apiClient.get<ApiSuccessResponse<Product>>(
      `${PRODUCTS_BASE_URL}/${id}`
    );
    return response.data.data;
  } catch (error) {
    throw new Error(`Failed to fetch product with ID: ${id}.`);
  }
};

// ----------------- Employee/Admin Endpoints -----------------

export const getAllProducts = async (
  params?: ProductSearchParams
): Promise<ProductsResponse> => {
  const query = buildQueryParams(params);
  try {
    const response = await apiClient.get<ApiSuccessResponse<ProductsResponse>>(
      `${PRODUCTS_BASE_URL}/all${query ? `?${query}` : ""}`
    );
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch all products.");
  }
};

export const getProduct = async (id: string): Promise<Product> => {
  try {
    const response = await apiClient.get<ApiSuccessResponse<Product>>(
      `${PRODUCTS_BASE_URL}/all/${id}`
    );
    return response.data.data;
  } catch (error) {
    throw new Error(`Failed to fetch product with ID: ${id}.`);
  }
};

export const createProduct = async (
  productData: CreateProductInput
): Promise<Product> => {
  try {
    const response = await apiClient.post<ApiSuccessResponse<Product>>(
      PRODUCTS_BASE_URL,
      productData
    );
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to create product.");
  }
};

export const updateProduct = async (
  id: string,
  productData: UpdateProductInput
): Promise<Product> => {
  try {
    const response = await apiClient.patch<ApiSuccessResponse<Product>>(
      `${PRODUCTS_BASE_URL}/${id}`,
      productData
    );
    return response.data.data;
  } catch (error) {
    throw new Error(`Failed to update product with ID: ${id}.`);
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${PRODUCTS_BASE_URL}/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete product with ID: ${id}.`);
  }
};

export const publishProduct = async (id: string): Promise<Product> => {
  try {
    const response = await apiClient.patch<ApiSuccessResponse<Product>>(
      `${PRODUCTS_BASE_URL}/${id}/publish`
    );
    return response.data.data;
  } catch (error) {
    throw new Error(`Failed to publish product with ID: ${id}.`);
  }
};

export const unpublishProduct = async (id: string): Promise<Product> => {
  try {
    const response = await apiClient.patch<ApiSuccessResponse<Product>>(
      `${PRODUCTS_BASE_URL}/${id}/unpublish`
    );
    return response.data.data;
  } catch (error) {
    throw new Error(`Failed to unpublish product with ID: ${id}.`);
  }
};

export const searchProducts = async (
  searchTerm: string,
  includeUnpublished: boolean = false
): Promise<Product[]> => {
  const endpoint = includeUnpublished
    ? `${PRODUCTS_BASE_URL}/search/all`
    : `${PRODUCTS_BASE_URL}/search`;
  try {
    const response = await apiClient.get<ApiSuccessResponse<Product[]>>(
      `${endpoint}?q=${encodeURIComponent(searchTerm)}`
    );
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to search products.");
  }
};
