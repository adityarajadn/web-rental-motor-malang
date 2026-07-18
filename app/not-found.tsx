'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Home, Map } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Visual Background Element */}
      <div className="relative mb-8 w-full max-w-lg flex justify-center">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] w-64 h-64 mx-auto mt-10"></div>
        
        {/* Giant 404 Text */}
        <div className="text-[120px] md:text-[200px] font-black font-heading text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary leading-none select-none relative z-10 animate-fade-in drop-shadow-sm">
          404
        </div>
        
        {/* Decorative badge */}
        <div className="absolute -bottom-2 -right-4 md:right-10 bg-white border border-border-color shadow-xl rounded-2xl px-6 py-3 flex items-center gap-3 z-20 animate-fade-in delay-200">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <AlertTriangle size={20} />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm leading-tight text-text-main">Jalan Buntu</p>
            <p className="text-xs text-text-muted">Rute tidak ditemukan</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 animate-fade-in delay-100 max-w-xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 font-heading text-text-main">
          Wah, Anda Tersesat!
        </h2>
        
        <p className="text-text-muted text-lg mb-10 leading-relaxed">
          Halaman yang Anda cari sepertinya telah dipindahkan, dihapus, atau mungkin Anda salah memasukkan alamat rutenya.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-primary w-full sm:w-auto px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 group">
            <Home size={20} className="group-hover:-translate-y-1 transition-transform" />
            Kembali ke Beranda
          </Link>
          <button 
            onClick={() => router.back()}
            className="btn-secondary w-full sm:w-auto px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>
        </div>
        
        <div className="mt-12 text-sm text-text-muted">
          Atau ingin melihat <Link href="/fleet" className="text-primary font-bold hover:underline">Daftar Armada Kami</Link>?
        </div>
      </div>
    </div>
  );
}
