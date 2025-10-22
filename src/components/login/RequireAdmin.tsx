// src/components/login/RequireAdmin.tsx
import type { JSX, PropsWithChildren } from 'react'; // ← type-only
import { Navigate } from 'react-router-dom';
import { useMe } from '@/app/api/auth';

export function RequireAdmin({ children }: PropsWithChildren): JSX.Element {
  const { data, isLoading } = useMe();

  if (isLoading) return <div className="p-6">Memuat...</div>;
  if (!data) return <Navigate to="/login" replace />;
  if (data.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <>{children}</>;
}
