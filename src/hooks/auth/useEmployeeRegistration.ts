import { useMutation } from '@tanstack/react-query';
import { usersApi } from '../../services/api/users';
import type { EmployeeRegistrationRequest } from '../../types/auth';

export const useEmployeeRegistration = () => {
  return useMutation({
    mutationFn: (userData: EmployeeRegistrationRequest) => usersApi.registerEmployee(userData),
  });
};