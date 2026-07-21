'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, Activity, Calendar, LogOut, Key, Map, Settings, Menu, X, Star, Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROLE } from '@/constants';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const sessionStr = localStorage.getItem('user_session');
    if (!sessionStr) {
      router.replace('/auth');
      return;
    }

    try {
      const user = JSON.parse(sessionStr);
      if (user.role !== ROLE.ADMIN) {
        router.replace('/');
        return;
      }
      setIsAuthorized(true);
    } catch (e) {
      router.replace('/auth');
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-background w-full">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: Activity },
    { name: 'Manajemen Booking', path: '/admin/bookings', icon: Calendar },
    { name: 'Serah Terima & Kembali', path: '/admin/handovers', icon: Key },
    { name: 'Armada Motor', path: '/admin/fleet', icon: Map },
    { name: 'Manajemen Testimoni', path: '/admin/testimonials', icon: Star },
    { name: 'Pengaturan', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-[calc(100vh-80px)] bg-background border-t border-border-color relative w-full overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 top-20 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-surface border-r border-border-color flex-col overflow-y-auto fixed md:static top-20 left-0 h-[calc(100vh-80px)] z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:flex ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-border-color flex justify-between items-center">
          <h2 className="text-xl font-heading font-bold text-primary">Admin Panel</h2>
          <button className="md:hidden text-text-muted hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
                }`}
              >
                <Icon size={20} /> {item.name}
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col w-full">
        {/* Mobile Header Bar */}
        <div className="md:hidden p-4 border-b border-border-color bg-surface flex items-center gap-3 sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-text-muted hover:text-primary p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-heading font-bold">Admin Menu</h2>
        </div>
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
