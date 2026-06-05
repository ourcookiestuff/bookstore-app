import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/authStore';
import { login, register } from '../api/authApi';

const schema = z.object({
  email: z.string().email('Nieprawidłowy email'),
  password: z.string().min(8, 'Hasło musi mieć minimum 8 znaków'),
});

type FormData = z.infer<typeof schema>;

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const setToken = useAuthStore((s) => s.setToken);
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
      navigate('/');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Coś poszło nie tak');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-cream)',
    }}>
      <div style={{
        display: 'flex',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '0.5px solid var(--color-brown-light)',
        width: '600px',
        boxShadow: '0 4px 24px rgba(56,33,16,0.08)',
      }}>

        {/* Lewa strona */}
        <div style={{
          background: 'var(--color-brown-dark)',
          width: '200px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          gap: '1.5rem',
        }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
            {[
              { w: 18, h: 60, bg: '#8b6343' },
              { w: 14, h: 72, bg: '#c9945a' },
              { w: 20, h: 55, bg: '#5c3d1e' },
              { w: 12, h: 68, bg: '#a07040' },
              { w: 16, h: 50, bg: '#e8c99a' },
            ].map((b, i) => (
              <div key={i} style={{
                width: b.w, height: b.h,
                background: b.bg,
                borderRadius: '2px',
              }} />
            ))}
          </div>
          <div style={{ color: '#f4f1ea', fontSize: '20px', fontWeight: 500, textAlign: 'center', lineHeight: 1.3 }}>
            BookStore
            <div style={{ color: '#e8d5b7', fontSize: '12px', fontWeight: 400, marginTop: '6px' }}>
              Twoja osobista biblioteka i księgarnia
            </div>
          </div>
        </div>

        {/* Prawa strona */}
        <div
          style={{
            background: 'var(--color-cream)',
            flex: 1,
            padding: '2rem 1.75rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '320px',
            }}
          >
          {/* Taby */}
          <div style={{ display: 'flex', borderBottom: '2px solid var(--color-brown-light)', marginBottom: '1.5rem' }}>
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                style={{
                  flex: 1,
                  padding: '8px 20px',
                  fontSize: '14px',
                  background: 'none',
                  border: 'none',
                  borderBottom: mode === m ? '2px solid var(--color-brown-dark)' : '2px solid transparent',
                  marginBottom: '-2px',
                  color: mode === m ? 'var(--color-brown-dark)' : 'var(--color-brown-mid)',
                  fontWeight: mode === m ? 500 : 400,
                  cursor: 'pointer',
                }}
              >
                {m === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-brown-mid)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Adres email
              </label>
              <input
                {...formRegister('email')}
                type="email"
                placeholder="jan@example.com"
                style={{
                  width: '100%', padding: '9px',
                  boxSizing: 'border-box',
                  border: `1px solid ${errors.email ? '#c0392b' : 'var(--color-brown-light)'}`,
                  borderRadius: '4px', background: '#fff',
                  fontSize: '14px', color: 'var(--color-brown-dark)', outline: 'none',
                }}
              />
              {errors.email && <p style={{ color: '#c0392b', fontSize: '12px', marginTop: '3px' }}>{errors.email.message}</p>}
            </div>

            {/* Hasło */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-brown-mid)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Hasło
              </label>
              <input
                {...formRegister('password')}
                type="password"
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '9px',
                  boxSizing: 'border-box',
                  border: `1px solid ${errors.password ? '#c0392b' : 'var(--color-brown-light)'}`,
                  borderRadius: '4px', background: '#fff',
                  fontSize: '14px', color: 'var(--color-brown-dark)', outline: 'none',
                }}
              />
              {errors.password && <p style={{ color: '#c0392b', fontSize: '12px', marginTop: '3px' }}>{errors.password.message}</p>}
            </div>

            {error && (
              <p style={{ color: '#c0392b', fontSize: '13px', marginBottom: '0.75rem', textAlign: 'center' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%', padding: '10px',
                background: 'var(--color-brown-dark)',
                color: 'var(--color-cream)',
                border: 'none', borderRadius: '4px',
                fontSize: '14px', fontWeight: 500,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? 'Ładowanie...' : mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
            </button>
          </form>

          <p style={{ fontSize: '11px', color: 'var(--color-brown-mid)', textAlign: 'center', marginTop: '1.25rem' }}>
            Rejestrując się, akceptujesz regulamin serwisu.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}