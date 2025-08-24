import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../services/api/auth";
import { storage } from "../../utils/storage";
import { QUERY_KEYS } from "../../utils/constants";
import type { LoginRequest } from "../../types/auth";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (response) => {
      // Store user in localStorage
      storage.setUser(response.data);

      // Update query cache
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, response.data);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });

      console.log("Login successful:", response.data);
    },
    onError: (error: any) => {
      // Don't clear auth on login failure - user might just have wrong credentials
      console.error("Login failed:", error);

      // Only clear auth if it's a specific auth-related error
      if (
        error?.message?.includes("token") ||
        error?.message?.includes("session")
      ) {
        storage.clearAuth();
      }
    },
    retry: false, // Don't retry login attempts
  });
};
