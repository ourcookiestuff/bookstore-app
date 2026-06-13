import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/authStore';
import { login, register } from '../api/authApi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';

const schema = z.object({
  email: z.string().email('Nieprawidłowy email'),
  password: z.string().min(8, 'Hasło musi mieć minimum 8 znaków'),
});

type FormData = z.infer<typeof schema>;

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const setToken = useAuthStore((s) => s.setToken);
  const setEmail = useAuthStore((s) => s.setEmail);
  const navigate = useNavigate();

  const { register: formRegister, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const response = mode === 'login'
        ? await login(data)
        : await register(data);
      setToken(response.token);
      setEmail(data.email);
      navigate('/');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Coś poszło nie tak');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex flex-col">
      <Navbar />

      <div className="flex-1 bg-[#f4f1ea] flex items-center justify-center py-8">
        <div className="flex rounded-xl overflow-hidden border border-[#c9b99a] shadow-sm">

          {/* Lewa strona */}
          <div className="bg-[#382110] w-60 flex-shrink-0 flex flex-col items-center justify-center gap-6 p-8">
            <div className="flex gap-1.5 items-end">
              {[
                { w: 18, h: 60, bg: '#8b6343' },
                { w: 14, h: 72, bg: '#c9945a' },
                { w: 20, h: 55, bg: '#5c3d1e' },
                { w: 12, h: 68, bg: '#a07040' },
                { w: 16, h: 50, bg: '#e8c99a' },
              ].map((b, i) => (
                <div
                  key={i}
                  style={{ width: b.w, height: b.h, background: b.bg }}
                  className="rounded-sm"
                />
              ))}
            </div>
            <div className="text-center">
              <p className="text-[#f4f1ea] text-xl font-medium">BookStore</p>
              <p className="text-[#c9b99a] text-xs mt-1 leading-relaxed">
                Twoja osobista biblioteka i księgarnia
              </p>
            </div>
          </div>

          {/* Prawa strona */}
          <div className="bg-[#f4f1ea] flex-1 p-8">

            {/* Taby */}
            <div className="flex border-b-2 border-[#c9b99a] mb-6">
              {(['login', 'register'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(null); }}
                  className={`flex-1 py-2 text-sm border-b-2 -mb-0.5 transition-colors cursor-pointer bg-transparent ${
                    mode === m
                      ? 'border-[#382110] text-[#382110] font-medium'
                      : 'border-transparent text-[#7a6248] hover:text-[#382110]'
                  }`}
                >
                  {m === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-[#7a6248] uppercase tracking-wider">
                  Adres email
                </Label>
                <Input
                  id="email"
                  {...formRegister('email')}
                  placeholder="jan@example.com"
                  className={`bg-white text-[#382110] border-[#c9b99a] focus-visible:ring-[#382110] ${
                    errors.email ? 'border-red-400' : ''
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>

              {/* Hasło */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs text-[#7a6248] uppercase tracking-wider">
                  Hasło
                </Label>
                <Input
                  id="password"
                  {...formRegister('password')}
                  type="password"
                  placeholder="••••••••"
                  className={`bg-white text-[#382110] border-[#c9b99a] focus-visible:ring-[#382110] ${
                    errors.password ? 'border-red-400' : ''
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#382110] hover:bg-[#5c3d1e] text-[#f4f1ea] cursor-pointer"
              >
                {isSubmitting
                  ? 'Ładowanie...'
                  : mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
              </Button>
            </form>

            <p className="text-xs text-[#7a6248] text-center mt-4">
              Rejestrując się, akceptujesz regulamin serwisu.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div> 
  );
}