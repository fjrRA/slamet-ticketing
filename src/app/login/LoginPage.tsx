// src/app/login/LoginPage.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin, useMe } from '@/app/api/auth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type FormValues = z.infer<typeof schema>;

function getFromPath(state: unknown): string | null {
  if (state && typeof state === 'object' && 'from' in state) {
    const s = state as { from?: { pathname?: string } };
    const p = s.from?.pathname;
    return typeof p === 'string' ? p : null;
  }
  return null;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const login = useLogin();
  const { data: me } = useMe();
  const navigate = useNavigate();
  const loc = useLocation();

  // sudah login? alihkan sesuai role
  useEffect(() => {
    if (!me) return;
    navigate(me.role === 'ADMIN' ? '/admin' : '/', { replace: true });
  }, [me, navigate]);

  async function onSubmit(values: FormValues) {
    try {
      const u = await login.mutateAsync(values);
      const rawFrom = getFromPath(loc.state);
      let dest = rawFrom && rawFrom !== '/login' ? rawFrom : (u.role === 'ADMIN' ? '/admin' : '/');
      if (rawFrom?.startsWith('/admin') && u.role !== 'ADMIN') dest = '/';
      toast.success('Login berhasil');
      navigate(dest, { replace: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Login gagal';
      toast.error(msg);
    }
  }

  // kelas input supaya box jelas (tidak transparan)
  const inputClass =
    'w-full border border-slate-300 rounded-lg px-3 py-2 bg-white ' +
    'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500';
  const buttonClass =
    'w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 disabled:opacity-60';

  return (
    <div className="min-h-screen flex flex-col">
      {/* form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4 border rounded-2xl p-6 shadow-sm bg-white"
        >
          <h1 className="text-2xl font-semibold text-center">Masuk</h1>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              {...register('email')}
              className={inputClass}
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className={inputClass}
              autoComplete="current-password"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button className={buttonClass} disabled={isSubmitting}>Masuk</button>

          <p className="text-xs text-center text-gray-500">
            Admin? Cukup login di sini juga—hak akses dilihat dari role.
          </p>

          {/* tombol Home */}
          <div className="pt-1">
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full border rounded-xl px-4 py-2 hover:bg-slate-50"
            >
              Home
            </Link>
          </div>
        </form>
      </div>

      {/* footer khusus halaman login */}
      <footer className="text-sm text-slate-500 border-t p-4 text-center">
        © {new Date().getFullYear()} Slamet Ticketing
      </footer>
    </div>
  );
}
