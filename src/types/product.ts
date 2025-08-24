// Updated type definitions to be placed in your src/types/product.ts file
export interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  basePrice: number;
  taxRate: number;
  status: "published" | "draft";
  stockAmount: number;
  createdBy: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  isDeleted: boolean;
  createdAt: string; 
  updatedAt: string; 
  __v: number;
}

export interface CreateProductInput {
  name: string;
  description: string;
  images?: string[];
  basePrice: number;
  taxRate?: number;
  status?: "draft" | "published";
  stockAmount?: number;
  createdBy: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  images?: string[];
  basePrice?: number;
  taxRate?: number;
  status?: "draft" | "published";
  stockAmount?: number;
}

export interface ProductSearchParams {
  name?: string;
  status?: "draft" | "published";
  minPrice?: number;
  maxPrice?: number;
  createdBy?: string;
  inStock?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

export interface BulkStockUpdate {
  productId: string;
  stockAmount: number;
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Renamed for clarity to show it's a success response
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}
