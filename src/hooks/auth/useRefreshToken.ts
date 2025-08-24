import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../services/api/auth';

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: () => authApi.refreshToken(),
    onError: (error) => {
      console.error('Token refresh failed:', error);
    },
  });
};