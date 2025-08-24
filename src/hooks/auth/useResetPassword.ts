import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../services/api/auth';
import type { ResetPasswordRequest, ForgotPasswordRequest } from '../../types/auth';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
  });
};