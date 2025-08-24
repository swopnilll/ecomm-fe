import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').trim(),
  description: z.string().min(1, 'Product description is required').trim(),
  images: z.array(z.string().url('Invalid image URL')).default([]),
  basePrice: z.number().min(0, 'Base price must be non-negative'),
  taxRate: z
    .number()
    .min(0, 'Tax rate must be non-negative')
    .max(100, 'Tax rate cannot exceed 100%')
    .default(0),
  status: z
    .enum(['draft', 'published'], {
      message: 'Status must be either draft or published',
    })
    .default('draft'),
  stockAmount: z
    .number()
    .int('Stock amount must be an integer')
    .min(0, 'Stock amount must be non-negative')
    .default(0),
  createdBy: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
});

export const CreateProductSchema = ProductSchema.partial({
  images: true,
  taxRate: true,
  status: true,
  stockAmount: true,
});

export const UpdateProductSchema = ProductSchema.partial();

export const ProductSearchSchema = z.object({
  name: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  createdBy: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format').optional(),
  inStock: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const BulkStockUpdateSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID format'),
  stockAmount: z
    .number()
    .int('Stock amount must be an integer')
    .min(0, 'Stock amount must be non-negative'),
});

export const BulkStockUpdatesSchema = z.array(BulkStockUpdateSchema);

// Form validation schemas (for frontend forms)
export const ProductFormSchema = z.object({
  name: z.string().min(1, 'Product name is required').trim(),
  description: z.string().min(1, 'Product description is required').trim(),
  basePrice: z
    .string()
    .min(1, 'Base price is required')
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= 0, 'Base price must be a valid number >= 0'),
  taxRate: z
    .string()
    .optional()
    .transform((val) => (val === '' || val === undefined ? 0 : parseFloat(val)))
    .refine(
      (val) => !isNaN(val) && val >= 0 && val <= 100,
      'Tax rate must be a valid number between 0 and 100'
    ),
  status: z.enum(['draft', 'published']).default('draft'),
  stockAmount: z
    .string()
    .optional()
    .transform((val) => (val === '' || val === undefined ? 0 : parseInt(val)))
    .refine(
      (val) => !isNaN(val) && val >= 0 && Number.isInteger(val),
      'Stock amount must be a valid integer >= 0'
    ),
  images: z.array(z.string().url('Invalid image URL')).default([]),
});

export const ImageUploadSchema = z.object({
  url: z.string().url('Please enter a valid image URL'),
});

export const ProductSearchFormSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  minPrice: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : parseFloat(val ?? '')))
    .refine((val) => val === undefined || (!isNaN(val) && val >= 0), 'Invalid minimum price'),
  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val ?? '') === '' ? undefined : parseFloat(val ?? ''))
    .refine((val) => val === undefined || (!isNaN(val) && val >= 0), 'Invalid maximum price'),
  inStock: z.boolean().optional(),
});

// Type inference
export type ProductInput = z.infer<typeof ProductSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductSearchInput = z.infer<typeof ProductSearchSchema>;
export type BulkStockUpdateInput = z.infer<typeof BulkStockUpdateSchema>;
export type BulkStockUpdatesInput = z.infer<typeof BulkStockUpdatesSchema>;
export type ProductFormInput = z.infer<typeof ProductFormSchema>;
export type ImageUploadInput = z.infer<typeof ImageUploadSchema>;
export type ProductSearchFormInput = z.infer<typeof ProductSearchFormSchema>;