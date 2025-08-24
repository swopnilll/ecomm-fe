import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../../services/api/auth';
import { storage } from '../../utils/storage';
import { QUERY_KEYS } from '../../utils/constants';
import type { LoginRequest, RegisterRequest, User } from '../../types/auth';

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Query to get current user
  const {
    data: user,
    isLoading,
    error,
    refetch: refetchUser,
  } = useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: async () => {
      try {
        const response = await authApi.me();
        return response.data;
      } catch (error) {
        // If API fails, clear stored user
        storage.clearAuth();
        throw error;
      }
    },
    enabled: storage.hasStoredUser(), // Only run if we have a stored user
    retry: false, // Don't retry on 401
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (response) => {
      // Store user in localStorage
      storage.setUser(response.data);
      
      // Update query cache
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, response.data);
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
    },
    onError: (error) => {
      console.error('Login failed:', error);
      storage.clearAuth();
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => authApi.register(userData),
    onSuccess: (response) => {
      // Store user in localStorage
      storage.setUser(response.data);
      
      // Update query cache
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, response.data);
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
    },
    onError: (error) => {
      console.error('Registration failed:', error);
      storage.clearAuth();
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear stored data
      storage.clearAuth();
      
      // Clear all queries
      queryClient.clear();
      
      // Redirect to login (if in browser environment)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Even if API fails, clear local data
      storage.clearAuth();
      queryClient.clear();
    },
  });

  const login = async (credentials: LoginRequest) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (userData: RegisterRequest) => {
    await registerMutation.mutateAsync(userData);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    // User state
    user: user || storage.getUser(),
    isAuthenticated: !!(user || storage.getUser()),
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    
    // Auth actions
    login,
    register,
    logout,
    refetchUser,
    
    // Mutation states
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
    
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};