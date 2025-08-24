export interface UserProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'employee' | 'customer';
  isBlocked: boolean;
  orderCount: number;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UsersListResponse {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
}

export interface UsersListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'admin' | 'employee' | 'customer';
  status?: 'active' | 'blocked';
}

export interface BlockUserRequest {
  reason?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}