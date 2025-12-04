import { useQuery } from '@tanstack/react-query';
import { UserService, UserFilters } from '@/services/users';
import { queryKeys } from '@/services/queryKeys';

export const useUsers = (filters?: UserFilters) => {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => UserService.getAll(filters),
  });
};

export const useTechnicians = () => {
  return useQuery({
    queryKey: queryKeys.users.list({ role: 'technician' }),
    queryFn: () => UserService.getTechnicians(),
  });
};


