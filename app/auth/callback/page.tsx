'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { ROLE } from '@/constants';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase-js automatically parses the URL hash and creates a session
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError) throw authError;
        
        if (session && session.user) {
          const email = session.user.email;
          const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User Google';
          
          if (!email) throw new Error('Email tidak ditemukan dari akun Google');

          // Cek apakah user sudah ada di tabel public.users
          let { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

          let userData = existingUser;

          if (!existingUser) {
            // Jika belum ada, kita otomatis register
            const { data: newUser, error: insertError } = await supabase
              .from('users')
              .insert({
                name,
                email,
                password_hash: 'GOOGLE_OAUTH', // Tanda bahwa dia login via google
                role: ROLE.USER,
                phone: '-'
              })
              .select()
              .single();

            if (insertError) throw insertError;
            userData = newUser;
          }

          // Simpan session mock kita agar sistem lama tetap jalan
          localStorage.setItem('user_session', JSON.stringify(userData));
          
          if (userData.role === ROLE.ADMIN) {
            router.push('/admin');
          } else {
            router.push('/');
          }
        } else {
          throw new Error('Sesi tidak ditemukan.');
        }
      } catch (err: any) {
        setError(err.message || 'Gagal memproses autentikasi Google.');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {error ? (
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">!</div>
          <h1 className="text-2xl font-bold mb-2">Login Gagal</h1>
          <p className="text-text-muted mb-6">{error}</p>
          <button 
            onClick={() => router.push('/auth')}
            className="btn-primary px-6 py-2 rounded-xl"
          >
            Kembali ke Login
          </button>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Memproses Login Google...</h1>
          <p className="text-text-muted">Mohon tunggu sebentar, Anda akan segera dialihkan.</p>
        </div>
      )}
    </div>
  );
}
