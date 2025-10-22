// src/app/user/ProfilePage.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiGet } from '@/app/api/client';
import { toast } from 'sonner';

type Me = { id: string; name: string; email: string; phone?: string | null };
// /api/auth/me kadang return langsung Me, kadang { user: Me } → terima dua-duanya
type MeEither = Me | { user?: Me } | null;

function unwrapMe(x: MeEither): Me | null {
  if (!x) return null;
  if (typeof x === 'object' && 'user' in x) return (x.user ?? null) as Me | null;
  return x as Me;
}

const profileSchema = z.object({
  name: z.string().min(2, 'Minimal 2 karakter').max(100),
  email: z.string().email('Email tidak valid'),
  phone: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

const passSchema = z.object({
  currentPassword: z.string().min(6, 'Minimal 6 karakter'),
  newPassword: z.string().min(6, 'Minimal 6 karakter'),
});
type PassForm = z.infer<typeof passSchema>;

export default function ProfilePage() {
  const qc = useQueryClient();

  const meQ = useQuery({
    queryKey: ['me'],
    queryFn: () => apiGet<MeEither>('/api/auth/me'),
  });

  const me = unwrapMe(meQ.data ?? null);

  const f = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '', phone: '' },
  });

  // Saat data "me" datang, isi form
  useEffect(() => {
    if (me) f.reset({ name: me.name, email: me.email, phone: me.phone ?? '' });
  }, [me, f]);

  const mUpdate = useMutation({
    mutationFn: (values: ProfileForm) =>
      api('/api/auth/me', { method: 'PATCH', body: values }),
    onSuccess: () => {
      toast.success('Profil diperbarui');
      qc.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : 'Gagal menyimpan profil';
      toast.error(msg);
    },
  });

  const fp = useForm<PassForm>({ resolver: zodResolver(passSchema) });

  const mPass = useMutation({
    mutationFn: (values: PassForm) =>
      api('/api/auth/password', { method: 'PATCH', body: values }),
    onSuccess: () => {
      toast.success('Password diperbarui');
      fp.reset();
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : 'Gagal mengganti password';
      toast.error(msg);
    },
  });

  if (meQ.isLoading) return <div className="p-6">Memuat profil…</div>;
  if (meQ.isError || !me) return <div className="p-6 text-red-600">Gagal memuat profil</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Profil</h1>

      <form className="border rounded-xl p-4 space-y-4"
        onSubmit={f.handleSubmit((v) => mUpdate.mutate(v))}>
        <div>
          <label className="block text-sm mb-1">Nama</label>
          <input {...f.register('name')} className="border rounded px-3 py-2 w-full" />
          {f.formState.errors.name && <div className="text-sm text-red-600">{f.formState.errors.name.message}</div>}
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" {...f.register('email')} className="border rounded px-3 py-2 w-full" />
          {f.formState.errors.email && <div className="text-sm text-red-600">{f.formState.errors.email.message}</div>}
        </div>

        <div>
          <label className="block text-sm mb-1">Telepon</label>
          <input {...f.register('phone')} className="border rounded px-3 py-2 w-full" />
          {f.formState.errors.phone && <div className="text-sm text-red-600">{f.formState.errors.phone.message}</div>}
        </div>

        <button type="submit" disabled={mUpdate.isPending}
          className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-50">
          Simpan Profil
        </button>
      </form>

      <div className="border rounded-xl p-4">
        <h2 className="font-semibold mb-3">Ganti Password</h2>
        <form className="space-y-4" onSubmit={fp.handleSubmit((v) => mPass.mutate(v))}>
          <div>
            <label className="block text-sm mb-1">Password Lama</label>
            <input type="password" {...fp.register('currentPassword')} className="border rounded px-3 py-2 w-full" />
            {fp.formState.errors.currentPassword && (
              <div className="text-sm text-red-600">{fp.formState.errors.currentPassword.message}</div>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">Password Baru</label>
            <input type="password" {...fp.register('newPassword')} className="border rounded px-3 py-2 w-full" />
            {fp.formState.errors.newPassword && (
              <div className="text-sm text-red-600">{fp.formState.errors.newPassword.message}</div>
            )}
          </div>

          <button type="submit" disabled={mPass.isPending}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
