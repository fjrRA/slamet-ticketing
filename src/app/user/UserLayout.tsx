// src/app/user/UserLayout.tsx
import Navbar from '@/components/user/Navbar';
import { Outlet } from 'react-router-dom';

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="text-sm text-slate-500 border-t p-4 text-center">
        © {new Date().getFullYear()} Slamet Ticketing
      </footer>
    </div>
  );
}
