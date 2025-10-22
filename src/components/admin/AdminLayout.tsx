// src/components/admin/AdminLayout.tsx
import { NavLink, Outlet } from "react-router-dom";
import LogoutButton from "../login/LogoutButton";

export default function AdminLayout() {
  const base = "px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors";
  const active = "bg-gray-200";

  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr] bg-gray-50">
      <aside className="p-4 border-r bg-white">
        <h1 className="font-semibold text-lg mb-2">Admin</h1>
        <nav className="flex flex-col gap-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `${base} ${isActive ? active : ""}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/bookings"
            className={({ isActive }) => `${base} ${isActive ? active : ""}`}
          >
            Bookings
          </NavLink>
          <NavLink to="/admin/trails" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
            Trails
          </NavLink>
          <NavLink to="/admin/slots" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
            Slots
          </NavLink>
          <NavLink to="/admin/prices" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
            Prices
          </NavLink>
          <NavLink to="/admin/closures" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
            Closures
          </NavLink>
          <NavLink to="/admin/payments" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
            Payments
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
            Users
          </NavLink>

          <div className="mt-6">
            <LogoutButton />
          </div>
        </nav>
      </aside>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
