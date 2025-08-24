import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters long')
    .max(50, 'First name must be less than 50 characters')
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters long')
    .max(50, 'Last name must be less than 50 characters')
    .optional(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const usersListParamsSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  role: z.enum(['admin', 'employee', 'customer']).optional(),
  status: z.enum(['active', 'blocked']).optional(),
});

export const blockUserSchema = z.object({
  reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),
});

// Type inference from schemas
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UsersListParamsData = z.infer<typeof usersListParamsSchema>;
export type BlockUserFormData = z.infer<typeof blockUserSchema>;