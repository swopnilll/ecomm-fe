import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../../services/api/auth';
import { storage } from '../../utils/storage';
import { QUERY_KEYS } from '../../utils/constants';
import type { RegisterRequest } from '../../types/auth';

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => authApi.register(userData),
    onSuccess: (response) => {
      storage.setUser(response.data);
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, response.data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
    },
    onError: () => {
      storage.clearAuth();
    },
  });
};
