// src/App.tsx
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import LoginPage from '@/app/login/LoginPage';
import RegisterPage from '@/app/login/RegisterPage';

// USER pages
import UserLayout from '@/app/user/UserLayout';
import HomePage from '@/app/user/HomePage';
import TrailsListPage from '@/app/user/TrailsListPage';
import CheckQuotaPage from '@/app/user/check-quota/CheckQuotaPage';
import OrderFindPage from '@/app/user/OrderFindPage';
import OrderDetailPage from '@/app/user/OrderDetailPage';
import MyBookingsPage from '@/app/user/MyBookingsPage';
import ProfilePage from '@/app/user/ProfilePage';

// ADMIN (lazy)
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'));
const DashboardPage = lazy(() => import('@/app/admin/DashboardPage'));
const BookingsPage = lazy(() => import('@/app/admin/BookingsPage'));
const BookingDetailPage = lazy(() => import('@/app/admin/BookingDetailPage'));
const TrailsPage = lazy(() => import('@/app/admin/TrailsPage'));
const TimeSlotsPage = lazy(() => import('@/app/admin/TimeSlotsPage'));
const PricesPage = lazy(() => import('@/app/admin/PricesPage'));
const ClosuresPage = lazy(() => import('@/app/admin/ClosuresPage'));
const PaymentsPage = lazy(() => import('@/app/admin/PaymentsPage'));
const UsersPage = lazy(() => import('@/app/admin/UsersPage'));
import { RequireAdmin } from '@/components/login/RequireAdmin';

function NotFound() {
  return <div className="p-6">404 — Halaman tidak ditemukan</div>;
}

const qc = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <Suspense fallback={<div className="p-4">Loading…</div>}>
        <Routes>
          {/* PUBLIC (dengan layout user) */}
          <Route element={<UserLayout />}>
            <Route index element={<HomePage />} />
            <Route path="trails" element={<TrailsListPage />} />
            <Route path="book" element={<CheckQuotaPage />} />

            {/* /order dan /order/:orderId */}
            <Route path="order">
              <Route index element={<OrderFindPage />} /> {/* /order */}
              <Route path=":orderId" element={<OrderDetailPage />} /> {/* /order/:orderId */}
            </Route>

            {/* /me/bookings */}
            <Route path="me">
              <Route index element={<ProfilePage />} />
              <Route path="bookings" element={<MyBookingsPage />} />
            </Route>
          </Route>

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ADMIN (guarded) */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="bookings/:id" element={<BookingDetailPage />} />
            <Route path="trails" element={<TrailsPage />} />
            <Route path="slots" element={<TimeSlotsPage />} />
            <Route path="prices" element={<PricesPage />} />
            <Route path="closures" element={<ClosuresPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster richColors />
    </QueryClientProvider>
  );
}
