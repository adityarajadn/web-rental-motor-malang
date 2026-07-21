'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isLogin) {
      const { data, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (queryError || !data) {
        setError('Email belum terdaftar atau terjadi kesalahan jaringan.');
      } else {
        // Mock password check for demo purposes
        if (data.password_hash === password || password === 'dummy') {
          localStorage.setItem('user_session', JSON.stringify(data));
          
          if (data.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        } else {
          setError('Password yang Anda masukkan salah.');
        }
      }
    } else {
      const { data: newUser, error: insertError } = await supabase.from('users').insert({
        name,
        email,
        phone,
        password_hash: password, // Using raw password just for mock purposes
        role: 'customer'
      }).select().single();
      
      if (insertError || !newUser) {
        setError('Gagal mendaftar: ' + (insertError?.message || 'Unknown error'));
      } else {
        localStorage.setItem('user_session', JSON.stringify(newUser));
        router.push('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-200"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-heading font-extrabold tracking-tight">
              Moto<span className="text-primary">Rent</span>
            </h1>
          </Link>
          <p className="text-text-muted mt-2">
            {isLogin ? 'Selamat datang kembali! Silakan masuk.' : 'Bergabunglah dan mulai perjalanan Anda.'}
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-border-color shadow-2xl backdrop-blur-xl">
          {/* Toggle Tabs */}
          <div className="flex p-1 bg-surface-hover rounded-xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                isLogin ? 'bg-background shadow text-text-main' : 'text-text-muted hover:text-text-main'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                !isLogin ? 'bg-background shadow text-text-main' : 'text-text-muted hover:text-text-main'
              }`}
            >
              Daftar
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-6 animate-fade-in text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="text-sm font-medium mb-1 block">Nama Lengkap</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-surface border border-border-color p-3 pl-10 rounded-xl text-text-main focus:outline-none focus:border-primary transition-colors" 
                      required={!isLogin}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Nomor Telepon</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      type="tel" 
                      placeholder="0812 3456 7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-surface border border-border-color p-3 pl-10 rounded-xl text-text-main focus:outline-none focus:border-primary transition-colors" 
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                  type="email" 
                  placeholder="anda@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface border border-border-color p-3 pl-10 rounded-xl text-text-main focus:outline-none focus:border-primary transition-colors" 
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium block">Password</label>
                {isLogin && (
                  <Link href="#" className="text-xs text-primary hover:underline">
                    Lupa Password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface border border-border-color p-3 pl-10 rounded-xl text-text-main focus:outline-none focus:border-primary transition-colors" 
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>{isLogin ? 'Masuk' : 'Buat Akun'} <ArrowRight size={18} /></>
              )}
            </button>
          </form>


        </div>
        
        <p className="text-center text-sm text-text-muted mt-8">
          Dengan mendaftar, Anda menyetujui <br />
          <Link href="#" className="text-primary hover:underline">Syarat & Ketentuan</Link> dan <Link href="#" className="text-primary hover:underline">Kebijakan Privasi</Link> kami.
        </p>
      </div>
    </div>
  );
}
