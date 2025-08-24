export interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  basePrice: number;
  taxRate: number;
  status: 'draft' | 'published';
  stockAmount: number;
  createdBy: string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  finalPrice: number;
  isInStock: boolean;
}

export interface CreateProductInput {
  name: string;
  description: string;
  images?: string[];
  basePrice: number;
  taxRate?: number;
  status?: 'draft' | 'published';
  stockAmount?: number;
  createdBy: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  images?: string[];
  basePrice?: number;
  taxRate?: number;
  status?: 'draft' | 'published';
  stockAmount?: number;
}

export interface ProductSearchParams {
  name?: string;
  status?: 'draft' | 'published';
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
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}