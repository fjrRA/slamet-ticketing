// src/components/login/RequireAuth.tsx
import type { JSX, PropsWithChildren } from 'react'; // ← type-only
import { Navigate, useLocation } from 'react-router-dom';
import { useMe } from '@/app/api/auth';

export function RequireAuth({ children }: PropsWithChildren): JSX.Element {
  const { data, isLoading } = useMe();
  const loc = useLocation();

  if (isLoading) return <div className="p-6">Memuat...</div>;
  if (!data) return <Navigate to="/login" replace state={{ from: loc }} />;
  return <>{children}</>;
}
