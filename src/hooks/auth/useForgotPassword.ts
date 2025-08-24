import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../services/api/auth';
import type { ForgotPasswordRequest } from '../../types/auth';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
  });
};