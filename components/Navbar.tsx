'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User, ShieldCheck, LogOut } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in on client side
    const sessionData = localStorage.getItem('user_session');
    if (sessionData) {
      setUser(JSON.parse(sessionData));
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    setUser(null);
    router.push('/');
  };
  return (
    <nav className="fixed w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <Link href="/" className="text-2xl font-heading font-bold text-gradient tracking-tight">
              MotoRent Malang
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link href="/" className="text-text-main hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
              <Link href="/fleet" className="text-text-main hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Armada Motor</Link>
              <Link href="/about" className="text-text-main hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Tentang Kami</Link>
              
              {user?.role === 'admin' ? (
                <Link href="/admin" className="text-text-muted hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors border border-border-color">Admin Panel</Link>
              ) : user ? (
                <Link href="/my-bookings" className="text-text-main hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Pesanan Saya</Link>
              ) : null}

              {!user ? (
                <Link href="/auth" className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium">
                  <User size={16} />
                  <span>Masuk / Daftar</span>
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-text-muted">Halo, {user.name?.split(' ')[0] || 'User'}</span>
                  <button onClick={handleLogout} className="text-red-400 hover:text-red-300 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <LogOut size={16} />
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-muted hover:text-white p-2 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-border-color animate-fade-in absolute w-full top-20 left-0 bg-background/95 backdrop-blur-xl shadow-2xl h-screen overflow-y-auto">
          <div className="px-4 pt-4 pb-12 space-y-2 sm:px-3 flex flex-col">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-text-main hover:text-primary hover:bg-surface-hover block px-4 py-3 rounded-xl text-base font-medium transition-colors">Home</Link>
            <Link href="/fleet" onClick={() => setIsOpen(false)} className="text-text-main hover:text-primary hover:bg-surface-hover block px-4 py-3 rounded-xl text-base font-medium transition-colors">Armada Motor</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="text-text-main hover:text-primary hover:bg-surface-hover block px-4 py-3 rounded-xl text-base font-medium transition-colors">Tentang Kami</Link>
            
            {user?.role === 'admin' ? (
              <Link href="/admin" onClick={() => setIsOpen(false)} className="text-text-muted hover:text-accent hover:bg-surface-hover block px-4 py-3 rounded-xl text-base font-medium transition-colors border border-border-color">Admin Panel</Link>
            ) : user ? (
              <Link href="/my-bookings" onClick={() => setIsOpen(false)} className="text-text-main hover:text-primary hover:bg-surface-hover block px-4 py-3 rounded-xl text-base font-medium transition-colors">Pesanan Saya</Link>
            ) : null}

            <div className="pt-4">
              {!user ? (
                <Link href="/auth" onClick={() => setIsOpen(false)} className="btn-primary w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold">
                  <User size={18} />
                  <span>Masuk / Daftar</span>
                </Link>
              ) : (
                <div className="space-y-4">
                  <div className="px-4 py-2 text-sm text-text-muted bg-surface/50 rounded-lg">
                    Login sebagai: <span className="font-bold text-text-main">{user.name}</span>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }} 
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold bg-red-500/10 text-red-500 border border-red-500/20"
                  >
                    <LogOut size={18} />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
