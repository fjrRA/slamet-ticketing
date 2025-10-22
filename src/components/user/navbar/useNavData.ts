// src/components/user/navbar/useNavData.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/api/client';

export type Trail = { id: string; name: string; basecamp?: string | null; isActive?: boolean };
type RespEither = { ok?: boolean; data?: Trail[] } | Trail[];

function unwrap(resp: RespEither | undefined): Trail[] {
  if (!resp) return [];
  return Array.isArray(resp) ? resp : (resp.data ?? []);
}

export function useNavData() {
  const trails = useQuery({
    queryKey: ['nav-trails'],
    queryFn: () => api<RespEither>('/api/trails?active=1'),
    staleTime: 60_000,
  });

  const hasAlert = false;

  return {
    trailList: unwrap(trails.data),
    hasAlert,
    loading: trails.isLoading,
  };
}
