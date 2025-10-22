// src/app/admin/users/UserTable.tsx
import type { AdminUser } from '@/types/admin';

export default function UserTable({
  items,
  onEdit,
  onToggleRole,
  onResetPassword,
}: {
  items: AdminUser[];
  onEdit: (u: AdminUser) => void;
  onToggleRole: (u: AdminUser) => void;
  onResetPassword: (u: AdminUser) => void;
}) {
  return (
    <div className="overflow-auto border rounded">
      <table className="min-w-[860px] w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Phone</th>
            <th className="p-2 text-center">Role</th>
            <th className="p-2 text-center">Bookings</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.phone ?? '-'}</td>
              <td className="p-2 text-center">{u.role}</td>
              <td className="p-2 text-center">{u._count.bookings}</td>
              <td className="p-2">
                <div className="flex gap-2">
                  <button className="border rounded px-2 py-1" onClick={() => onEdit(u)}>
                    Edit
                  </button>
                  <button className="border rounded px-2 py-1" onClick={() => onToggleRole(u)}>
                    {u.role === 'ADMIN' ? 'Demote to USER' : 'Make ADMIN'}
                  </button>
                  <button className="border rounded px-2 py-1" onClick={() => onResetPassword(u)}>
                    Reset Password
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={6} className="p-6 text-center text-gray-500">Tidak ada data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
