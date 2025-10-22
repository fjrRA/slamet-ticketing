// src/app/login/RegisterPage.tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/app/api/client';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 huruf'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const navigate = useNavigate();

  async function onSubmit(v: FormValues) {
    try {
      await api('/api/auth/register', { method: 'POST', body: v });
      toast.success('Pendaftaran berhasil');
      navigate('/', { replace: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Gagal mendaftar';
      toast.error(msg);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4 border rounded-2xl p-6 shadow bg-white"
        >
          <h1 className="text-2xl font-semibold text-center">Daftar</h1>

          <div>
            <label className="block text-sm mb-1">Nama</label>
            <input
              {...register('name')}
              placeholder="Nama lengkap"
              className="w-full rounded-lg border border-slate-300 px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/40
                       focus:border-emerald-500"
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              {...register('email')}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/40
                       focus:border-emerald-500"
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">No. HP (opsional)</label>
            <input
              {...register('phone')}
              placeholder="08xxxxxxxxxx"
              className="w-full rounded-lg border border-slate-300 px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/40
                       focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/40
                       focus:border-emerald-500"
            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
          </div>

          <button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 disabled:opacity-60"
            disabled={isSubmitting}
          >
            Daftar
          </button>

          <p className="text-center text-sm">
            Sudah punya akun? <Link to="/login" className="underline">Masuk</Link>
          </p>

          {/* Tombol Home seperti di Login */}
          <Link
            to="/"
            className="block text-center w-full border rounded-xl py-2 hover:bg-slate-50"
          >
            Home
          </Link>
        </form>
      </div>
      {/* Footer di bawah form (match halaman Login) */}
      <footer className="text-sm text-slate-500 border-t p-4 text-center">
        © {new Date().getFullYear()} Slamet Ticketing
      </footer>
    </div>
  );
}
