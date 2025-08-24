import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { usersApi } from "../../services/api/users";
import { type UsersListParams, type BlockUserRequest } from "../../types/user";

// Query keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: UsersListParams) => [...userKeys.lists(), params] as const,
};

// Get users hook
export const useUsers = (params: UsersListParams = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersApi.getUsers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: BlockUserRequest }) =>
      usersApi.blockUser(id, data),
    onSuccess: () => {
      // Update all user lists in cache
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("User blocked successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to block user";
      toast.error(message);
    },
  });
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.unblockUser(id),
    onSuccess: () => {
      // Update all user lists in cache
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User unblocked successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to unblock user';
      toast.error(message);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      // Update all user lists in cache
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete user';
      toast.error(message);
    },
  });
};

export const useToggleUserBlock = () => {
  const blockMutation = useBlockUser();
  const unblockMutation = useUnblockUser();

  const toggleBlock = (userId: string, isCurrentlyBlocked: boolean, reason?: string) => {
    if (isCurrentlyBlocked) {
      return unblockMutation.mutate(userId);
    } else {
      return blockMutation.mutate({ id: userId, data: reason ? { reason } : {} });
    }
  };

  return {
    toggleBlock,
    isLoading: blockMutation.isPending || unblockMutation.isPending,
  };
};