// src/app/api/auth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';

export type Me = { id: string; name: string | null; email: string; role: 'USER'|'ADMIN' } | null;

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => api<Me>('/api/auth/me'),
    staleTime: 5 * 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      api<{ id: string; name: string; role: 'USER'|'ADMIN' }>('/api/auth/login', {
        method: 'POST',
        body: payload,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  });
}
