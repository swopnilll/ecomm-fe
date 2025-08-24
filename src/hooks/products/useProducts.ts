import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { productsApi } from "../../services/api/products";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductSearchParams,
  ProductsResponse,
  BulkStockUpdate,
} from "../../types/product";

// Query Keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductSearchParams) =>
    [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  published: () => [...productKeys.all, "published"] as const,
  publishedList: (filters: ProductSearchParams) =>
    [...productKeys.published(), { filters }] as const,
  publishedDetail: (id: string) => [...productKeys.published(), id] as const,
  search: (term: string) => [...productKeys.all, "search", term] as const,
  lowStock: (threshold: number) =>
    [...productKeys.all, "lowStock", threshold] as const,
  priceRange: (min: number, max: number) =>
    [...productKeys.all, "priceRange", { min, max }] as const,
  byCreator: (creatorId: string) =>
    [...productKeys.all, "byCreator", creatorId] as const,
};

// Custom Hooks for Queries

/**
 * Get published products (for customers)
 */
export function usePublishedProducts(
  params?: ProductSearchParams,
  options?: Partial<UseQueryOptions<ProductsResponse>>
) {
  return useQuery({
    queryKey: productKeys.publishedList(params || {}),
    queryFn: () => productsApi.getPublishedProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Get a single published product (for customers)
 */
export function usePublishedProduct(
  id: string,
  options?: Partial<UseQueryOptions<Product>>
) {
  return useQuery({
    queryKey: productKeys.publishedDetail(id),
    queryFn: () => productsApi.getPublishedProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Get all products including drafts (for employees/admins)
 */
export function useAllProducts(
  params?: ProductSearchParams,
  options?: Partial<UseQueryOptions<ProductsResponse>>
) {
  return useQuery({
    queryKey: productKeys.list(params || {}),
    queryFn: () => productsApi.getAllProducts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

/**
 * Get a single product including drafts (for employees/admins)
 */
export function useProduct(
  id: string,
  options?: Partial<UseQueryOptions<Product>>
) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

/**
 * Search products by text
 */
export function useProductSearch(
  searchTerm: string,
  includeUnpublished: boolean = false,
  options?: Partial<UseQueryOptions<Product[]>>
) {
  return useQuery({
    queryKey: productKeys.search(searchTerm + includeUnpublished),
    queryFn: () => productsApi.searchProducts(searchTerm, includeUnpublished),
    enabled: searchTerm.length >= 2, // Only search with 2+ characters
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  });
}

/**
 * Get low stock products
 */
export function useLowStockProducts(
  threshold: number = 5,
  options?: Partial<UseQueryOptions<Product[]>>
) {
  return useQuery({
    queryKey: productKeys.lowStock(threshold),
    queryFn: () => productsApi.getLowStockProducts(threshold),
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  });
}

/**
 * Get products by price range
 */
export function useProductsByPriceRange(
  minPrice: number,
  maxPrice: number,
  includeUnpublished: boolean = false,
  options?: Partial<UseQueryOptions<Product[]>>
) {
  return useQuery({
    queryKey: productKeys.priceRange(minPrice, maxPrice),
    queryFn: () =>
      productsApi.getProductsByPriceRange(
        minPrice,
        maxPrice,
        includeUnpublished
      ),
    enabled: minPrice >= 0 && maxPrice >= minPrice,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

/**
 * Get products by creator
 */
export function useProductsByCreator(
  creatorId: string,
  options?: Partial<UseQueryOptions<Product[]>>
) {
  return useQuery({
    queryKey: productKeys.byCreator(creatorId),
    queryFn: () => productsApi.getProductsByCreator(creatorId),
    enabled: !!creatorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

// Custom Hooks for Mutations

/**
 * Create a new product
 */
export function useCreateProduct(
  options?: UseMutationOptions<Product, Error, CreateProductInput>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.createProduct,
    onSuccess: (data) => {
      // Invalidate and refetch product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.published() });

      // Add the new product to cache
      queryClient.setQueryData(productKeys.detail(data._id), data);

      toast.success("Product created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create product: " + error.message);
    },
    ...options,
  });
}

/**
 * Update an existing product
 */
export function useUpdateProduct(
  options?: UseMutationOptions<
    Product,
    Error,
    { id: string; data: UpdateProductInput }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => productsApi.updateProduct(id, data),
    onSuccess: (data, { id }) => {
      // Update the specific product in cache
      queryClient.setQueryData(productKeys.detail(id), data);

      // Invalidate product lists to ensure they're up-to-date
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.published() });

      toast.success("Product updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update product: " + error.message);
    },
    ...options,
  });
}

/**
 * Delete a product
 */
export function useDeleteProduct(
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.deleteProduct,
    onSuccess: (_, productId) => {
      // Remove the product from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(productId) });

      // Invalidate product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.published() });

      toast.success("Product deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete product: " + error.message);
    },
    ...options,
  });
}

/**
 * Publish a product
 */
export function usePublishProduct(
  options?: UseMutationOptions<Product, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.publishProduct,
    onSuccess: (data, productId) => {
      // Update the product in cache
      queryClient.setQueryData(productKeys.detail(productId), data);

      // Invalidate lists to reflect status change
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.published() });

      toast.success("Product published successfully!");
    },
    onError: (error) => {
      toast.error("Failed to publish product: " + error.message);
    },
    ...options,
  });
}

/**
 * Unpublish a product
 */
export function useUnpublishProduct(
  options?: UseMutationOptions<Product, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.unpublishProduct,
    onSuccess: (data, productId) => {
      // Update the product in cache
      queryClient.setQueryData(productKeys.detail(productId), data);

      // Invalidate lists to reflect status change
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.published() });

      toast.success("Product unpublished successfully!");
    },
    onError: (error) => {
      toast.error("Failed to unpublish product: " + error.message);
    },
    ...options,
  });
}

export function useToggleProductStatus() {
  const publishMutation = usePublishProduct();
  const unpublishMutation = useUnpublishProduct();

  const toggleStatus = (productId: string, currentStatus: string) => {
    if (currentStatus === "published") {
      unpublishMutation.mutate(productId);
    } else {
      publishMutation.mutate(productId);
    }
  };

  return {
    toggleStatus,
    isLoading: publishMutation.isPending || unpublishMutation.isPending,
  };
}

/**
 * Update product stock
 */
export function useUpdateProductStock(
  options?: UseMutationOptions<
    Product,
    Error,
    { id: string; stockAmount: number }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stockAmount }) =>
      productsApi.updateProductStock(id, stockAmount),
    onSuccess: (data, { id }) => {
      // Update the product in cache
      queryClient.setQueryData(productKeys.detail(id), data);

      // Invalidate lists to reflect stock changes
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.published() });
      queryClient.invalidateQueries({ queryKey: productKeys.lowStock(5) });

      toast.success("Stock updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update stock: " + error.message);
    },
    ...options,
  });
}

/**
 * Bulk update stock for multiple products
 */
export function useBulkUpdateStock(
  options?: UseMutationOptions<void, Error, BulkStockUpdate[]>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.bulkUpdateStock,
    onSuccess: () => {
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: productKeys.all });

      toast.success("Stock updated for all products successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update stock: " + error.message);
    },
    ...options,
  });
}

/**
 * Add image to product
 */
export function useAddProductImage(
  options?: UseMutationOptions<Product, Error, { id: string; imageUrl: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, imageUrl }) => productsApi.addProductImage(id, imageUrl),
    onSuccess: (data, { id }) => {
      // Update the product in cache
      queryClient.setQueryData(productKeys.detail(id), data);

      // Invalidate lists to reflect image changes
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.published() });

      toast.success("Image added successfully!");
    },
    onError: (error) => {
      toast.error("Failed to add image: " + error.message);
    },
    ...options,
  });
}

/**
 * Remove image from product
 */
export function useRemoveProductImage(
  options?: UseMutationOptions<Product, Error, { id: string; imageUrl: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, imageUrl }) =>
      productsApi.removeProductImage(id, imageUrl),
    onSuccess: (data, { id }) => {
      // Update the product in cache
      queryClient.setQueryData(productKeys.detail(id), data);

      // Invalidate lists to reflect image changes
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.published() });

      toast.success("Image removed successfully!");
    },
    onError: (error) => {
      toast.error("Failed to remove image: " + error.message);
    },
    ...options,
  });
}
