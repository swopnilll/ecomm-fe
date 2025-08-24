// src/services/api/users.ts
import apiClient from "./client";
import { API_ENDPOINTS } from "../../utils/constants";
import type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UsersListResponse,
  UsersListParams,
  BlockUserRequest,
  ApiResponse,
} from "../../types/user";
import type { EmployeeRegistrationRequest, User } from "../../types/auth";

export const usersApi = {
  // Get all users (Admin only)
  getUsers: async (
    params: UsersListParams = {}
  ): Promise<UsersListResponse> => {
    const response = await apiClient.get<{
      success: boolean;
      data: UserProfile[];
      pagination: UsersListResponse["pagination"];
    }>(API_ENDPOINTS.USERS.BASE, { params });

    const { data, pagination } = response.data;

    return {
      users: data,
      pagination,
    };
  },

  // Get user by ID (Admin only)
  getUserById: async (id: string): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      API_ENDPOINTS.USERS.BY_ID(id)
    );
    return response.data;
  },

  // Register employee (Admin only)
  registerEmployee: async (
    userData: EmployeeRegistrationRequest
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.USERS.EMPLOYEES,
      userData
    );
    return response.data;
  },

  // Update own profile
  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.patch<ApiResponse<UserProfile>>(
      API_ENDPOINTS.USERS.PROFILE,
      data
    );
    return response.data;
  },

  // Change own password
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.patch<ApiResponse<null>>(
      API_ENDPOINTS.USERS.PASSWORD,
      data
    );
    return response.data;
  },

  // Block user (Admin only)
  blockUser: async (
    id: string,
    data: BlockUserRequest = {}
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.patch<ApiResponse<null>>(
      API_ENDPOINTS.USERS.BLOCK(id),
      data
    );
    return response.data;
  },

  // Unblock user (Admin only)
  unblockUser: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.patch<ApiResponse<null>>(
      API_ENDPOINTS.USERS.UNBLOCK(id)
    );
    return response.data;
  },

  // Delete user (Admin only)
  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.USERS.BY_ID(id)
    );
    return response.data;
  },
};
