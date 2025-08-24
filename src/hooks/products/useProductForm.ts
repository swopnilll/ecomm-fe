// src/hooks/products/useProductForm.ts
import { useState, useCallback, useMemo } from "react";
import { z } from "zod";
import {
  ProductFormSchema,
  ImageUploadSchema,
  type ProductFormInput,
  type CreateProductInput,
  type UpdateProductInput,
} from "../../schemas/product";
import { useCreateProduct, useUpdateProduct } from "./useProducts";
import type { Product } from "../../types/product";
import { useAuth } from "../auth/useAuth";

interface UseProductFormOptions {
  initialData?: Partial<ProductFormInput>;
  productId?: string;
  onSuccess?: (product: Product) => void;
  onError?: (error: Error) => void;
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface ImageState {
  url: string;
  isValid: boolean;
  error?: string;
}

export const useProductForm = (options: UseProductFormOptions = {}) => {
  const { user } = useAuth();

  const { initialData, productId, onSuccess, onError } = options;
  const isEditing = Boolean(productId);

  // React Query mutations
  const createProductMutation = useCreateProduct({
    onSuccess: (product) => {
      setIsDirty(false);
      onSuccess?.(product);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  const updateProductMutation = useUpdateProduct({
    onSuccess: (product) => {
      setIsDirty(false);
      onSuccess?.(product);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  // Form state
  const [formData, setFormData] = useState<ProductFormInput>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    basePrice:
      typeof initialData?.basePrice === "number"
        ? initialData.basePrice
        : initialData?.basePrice
        ? parseFloat(initialData.basePrice as string) || 0
        : 0,
    taxRate:
      typeof initialData?.taxRate === "number"
        ? initialData.taxRate
        : initialData?.taxRate
        ? parseFloat(initialData.taxRate as string) || 0
        : 0,
    status: initialData?.status || "draft",
    stockAmount:
      typeof initialData?.stockAmount === "number"
        ? initialData.stockAmount
        : initialData?.stockAmount
        ? parseInt(initialData.stockAmount as string) || 0
        : 0,
    images: initialData?.images || [],
  });

  // Form validation state
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Image management state
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [imageState, setImageState] = useState<ImageState>({
    url: "",
    isValid: true,
  });

  // Get loading state from mutations
  const isSubmitting =
    createProductMutation.isPending || updateProductMutation.isPending;
  const [isDirty, setIsDirty] = useState(false);

  // Validate a single field
  const validateField = useCallback((name: keyof ProductFormInput, value: any) => {
    try {
      const schema =
        ProductFormSchema.shape[name as keyof typeof ProductFormSchema.shape];
      if (schema) {
        schema.parse(value);
        return undefined;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message;
      }
    }
    return undefined;
  }, []);

  // Validate entire form
  const validateForm = useCallback(() => {
    try {
      ProductFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return false;
      }
    }
    return false;
  }, [formData]);

  // Handle field changes
  const handleFieldChange = useCallback(
    (name: string, value: any) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setIsDirty(true);

      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }

      const fieldError = validateField(name as keyof ProductFormInput, value);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    },
    [errors, touched, validateField]
  );

  // Handle field blur
  const handleFieldBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      const value = formData[name as keyof ProductFormInput];
      const fieldError = validateField(name as keyof ProductFormInput, value);

      if (fieldError) {
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
      }
    },
    [formData, validateField]
  );

  // Image URL validation
  const validateImageUrl = useCallback((url: string) => {
    if (!url.trim()) {
      setImageState({ url, isValid: true });
      return;
    }

    try {
      ImageUploadSchema.parse({ url: url.trim() });
      setImageState({ url, isValid: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setImageState({
          url,
          isValid: false,
          error: error.issues[0]?.message,
        });
      }
    }
  }, []);

  // Handle image URL input change
  const handleImageUrlChange = useCallback(
    (url: string) => {
      setCurrentImageUrl(url);
      validateImageUrl(url);
    },
    [validateImageUrl]
  );

  // Add image to product
  const addImage = useCallback(() => {
    if (!imageState.isValid || !currentImageUrl.trim() || imageState.error) {
      return false;
    }

    const trimmedUrl = currentImageUrl.trim();

    // Check if image already exists
    if (formData.images.includes(trimmedUrl)) {
      setImageState({
        url: currentImageUrl,
        isValid: false,
        error: "This image URL is already added",
      });
      return false;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, trimmedUrl],
    }));

    setCurrentImageUrl("");
    setImageState({ url: "", isValid: true });
    setIsDirty(true);

    return true;
  }, [imageState, currentImageUrl, formData.images]);

  // Remove image from product
  const removeImage = useCallback((urlToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((url) => url !== urlToRemove),
    }));
    setIsDirty(true);
  }, []);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData({
      name: initialData?.name || "",
      description: initialData?.description || "",
      basePrice:
        typeof initialData?.basePrice === "number"
          ? initialData.basePrice
          : initialData?.basePrice
          ? parseFloat(initialData.basePrice as string) || 0
          : 0,
      taxRate:
        typeof initialData?.taxRate === "number"
          ? initialData.taxRate
          : initialData?.taxRate
          ? parseFloat(initialData.taxRate as string) || 0
          : 0,
      status: initialData?.status || "draft",
      stockAmount:
        typeof initialData?.stockAmount === "number"
          ? initialData.stockAmount
          : initialData?.stockAmount
          ? parseInt(initialData.stockAmount as string) || 0
          : 0,
      images: initialData?.images || [],
    });
    setErrors({});
    setTouched({});
    setCurrentImageUrl("");
    setImageState({ url: "", isValid: true });
    setIsDirty(false);
  }, [initialData]);

  // Transform form data for API
  const transformFormDataForAPI = useCallback((data: ProductFormInput) => {
    const baseData = {
      name: data.name,
      description: data.description,
      images: data.images,
      basePrice:
        typeof data.basePrice === "string"
          ? parseFloat(data.basePrice)
          : data.basePrice,
      taxRate:
        typeof data.taxRate === "string"
          ? data.taxRate === ""
            ? 0
            : parseFloat(data.taxRate)
          : data.taxRate || 0,
      status: data.status,
      stockAmount:
        typeof data.stockAmount === "string"
          ? data.stockAmount === ""
            ? 0
            : parseInt(data.stockAmount)
          : data.stockAmount || 0,
    };

    return baseData;
  }, []);

  // Submit form
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (isSubmitting) return;

      // Validate form before submission
      if (!validateForm()) {
        // Mark all fields as touched to show validation errors
        const allFields = Object.keys(ProductFormSchema.shape);
        const touchedState = allFields.reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setTouched(touchedState);
        return;
      }

      const apiData = transformFormDataForAPI(formData);

      if (isEditing && productId) {
        updateProductMutation.mutate({
          id: productId,
          data: apiData as UpdateProductInput,
        });
      } else {
        const createData: CreateProductInput = {
          ...apiData,
          createdBy: user?._id ?? "",
        };
        createProductMutation.mutate(createData);
      }
    },
    [
      isSubmitting,
      validateForm,
      transformFormDataForAPI,
      formData,
      isEditing,
      productId,
      updateProductMutation,
      createProductMutation,
    ]
  );

  // Check if form is valid
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Check if form can be submitted
  const canSubmit = useMemo(() => {
    if (isSubmitting) return false;

    if (!isDirty) return false;

    try {
      ProductFormSchema.parse(formData);
      return true;
    } catch {
      return false;
    }
  }, [formData, isDirty, isSubmitting]);

  return {
    // Form data
    formData,
    errors,
    touched,
    isDirty,
    isValid,
    canSubmit,

    // Loading states
    isSubmitting,

    // Image management
    currentImageUrl,
    imageState,

    // Form actions
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    resetForm,
    validateForm,

    // Image actions
    handleImageUrlChange,
    addImage,
    removeImage,

    // Computed properties
    hasImages: formData.images.length > 0,
    imageCount: formData.images.length,
    isEditing,

    // Mutation states for additional info
    createError: createProductMutation.error,
    updateError: updateProductMutation.error,
    mutationError: isEditing
      ? updateProductMutation.error
      : createProductMutation.error,
  };
};
