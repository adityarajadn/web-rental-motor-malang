'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, X, AlertTriangle, Info, Edit3, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Booking = {
  id: string;
  booking_code: string;
  start_date: string;
  end_date: string;
  status: string;
  users: { 
    name: string; 
    phone: string | null;
    user_verifications?: { identity_image_url: string; selfie_image_url: string }[];
  } | null;
  motors: { name: string } | null;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // State untuk modal
  const [modalConfig, setModalConfig] = useState<{ type: 'detail' | 'edit' | 'cancel' | null, bookingId: string | null }>({ type: null, bookingId: null });

  useEffect(() => {
    async function fetchBookings() {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_code,
          start_date,
          end_date,
          status,
          users ( name, phone, user_verifications!fk_verification_user ( identity_image_url, selfie_image_url ) ),
          motors ( name )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        setFetchError(error.message || JSON.stringify(error));
      } else if (data) {
        setBookings(data as any);
      }
      setLoading(false);
    }
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = b.booking_code.toLowerCase().includes(searchLower) || (b.users?.name || '').toLowerCase().includes(searchLower);
    const matchesFilter = filterStatus === 'Semua' || b.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'active':
        return <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-bold">{status.toUpperCase()}</span>;
      case 'pending_payment':
      case 'awaiting_verification':
        return <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-xs font-bold">{status.toUpperCase()}</span>;
      case 'completed':
        return <span className="bg-surface text-text-muted border border-border-color px-3 py-1 rounded-full text-xs font-bold">{status.toUpperCase()}</span>;
      case 'cancelled':
        return <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-xs font-bold">CANCELLED</span>;
      default:
        return <span className="bg-surface text-text-muted border border-border-color px-3 py-1 rounded-full text-xs font-bold">{status.toUpperCase()}</span>;
    }
  };

  const handleCancelConfirm = async () => {
    if (modalConfig.bookingId) {
      await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', modalConfig.bookingId);
      setBookings(prev => prev.map(b => b.id === modalConfig.bookingId ? { ...b, status: 'cancelled' } : b));
    }
    setModalConfig({ type: null, bookingId: null });
  };

  return (
    <div className="p-8" onClick={() => setActiveDropdown(null)}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">Manajemen Booking</h1>
          <p className="text-text-muted">Kelola semua pesanan penyewaan motor.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-border-color">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Cari ID Booking atau Nama..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border-color rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary text-text-main transition-colors"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              <Filter size={18} />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-auto bg-surface border border-border-color pl-10 pr-10 py-2.5 rounded-xl appearance-none focus:outline-none focus:border-primary text-text-main cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="awaiting_verification">Awaiting Verification</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-visible pb-32">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-color">
                <th className="pb-4 font-medium text-text-muted">ID Booking</th>
                <th className="pb-4 font-medium text-text-muted">Pelanggan</th>
                <th className="pb-4 font-medium text-text-muted">Motor</th>
                <th className="pb-4 font-medium text-text-muted">Tanggal Sewa</th>
                <th className="pb-4 font-medium text-text-muted">Status</th>
                <th className="pb-4 font-medium text-text-muted text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-muted">
                    <Loader2 className="animate-spin inline-block mr-2" size={20} />
                    Memuat data...
                  </td>
                </tr>
              ) : fetchError ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-red-500 font-bold bg-red-500/10">
                    Error fetching data from Supabase: {fetchError}
                  </td>
                </tr>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr 
                    key={booking.id} 
                    className={`animate-fade-in group ${activeDropdown === booking.id ? 'relative z-50' : ''}`}
                  >
                    <td className="py-4 font-mono text-primary">#{booking.booking_code}</td>
                    <td className="py-4 font-medium">{booking.users?.name || 'User'}</td>
                    <td className="py-4">{booking.motors?.name || 'Motor'}</td>
                    <td className="py-4">{new Date(booking.start_date).toLocaleDateString('id-ID')} - {new Date(booking.end_date).toLocaleDateString('id-ID')}</td>
                    <td className="py-4">{getStatusBadge(booking.status)}</td>
                    <td className="py-4 text-right relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === booking.id ? null : booking.id);
                        }}
                        className={`text-text-muted hover:text-primary transition-colors p-2 rounded-lg hover:bg-surface-hover ${activeDropdown === booking.id ? 'bg-surface-hover text-primary' : ''}`}
                      >
                        <MoreVertical size={20}/>
                      </button>
                      
                      {activeDropdown === booking.id && (
                        <div className="absolute right-0 top-12 w-48 bg-surface border border-border-color rounded-xl shadow-xl z-50 py-2 overflow-hidden animate-fade-in text-left">
                          <button 
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-hover transition-colors font-medium text-text-main" 
                            onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); setModalConfig({ type: 'detail', bookingId: booking.id }); }}
                          >
                            Lihat Detail
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-hover transition-colors font-medium text-text-main" 
                            onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); setModalConfig({ type: 'edit', bookingId: booking.id }); }}
                          >
                            Edit Booking
                          </button>
                          <div className="h-px w-full bg-border-color my-1"></div>
                          <button 
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/10 text-secondary transition-colors font-medium" 
                            onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); setModalConfig({ type: 'cancel', bookingId: booking.id }); }}
                          >
                            Batalkan Pesanan
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-muted">
                    Tidak ada data booking yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Custom UI */}
      {modalConfig.type && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" 
          onClick={() => setModalConfig({ type: null, bookingId: null })}
        >
          <div 
            className="bg-surface border border-border-color rounded-2xl p-6 max-w-md w-full shadow-2xl relative" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-text-muted hover:text-text-main"
              onClick={() => setModalConfig({ type: null, bookingId: null })}
            >
              <X size={20} />
            </button>

            {modalConfig.type === 'detail' && (
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                  <Info size={24} />
                </div>
                <h2 className="text-xl font-bold mb-2">Detail Booking #{modalConfig.bookingId}</h2>
                <p className="text-text-muted mb-6">Berikut adalah informasi lengkap mengenai pesanan ini.</p>
                
                <div className="space-y-3 bg-background rounded-xl p-4 border border-border-color mb-6">
                  <div className="flex justify-between"><span className="text-text-muted">Nama</span> <span className="font-medium">{bookings.find(b => b.id === modalConfig.bookingId)?.users?.name || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">No. HP</span> <span className="font-medium">{bookings.find(b => b.id === modalConfig.bookingId)?.users?.phone || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Motor</span> <span className="font-medium">{bookings.find(b => b.id === modalConfig.bookingId)?.motors?.name || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Waktu</span> <span className="font-medium">{new Date(bookings.find(b => b.id === modalConfig.bookingId)?.start_date || '').toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})} • 09:00 WIB</span></div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold mb-3">Dokumen Pelanggan</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background rounded-xl p-3 border border-border-color text-center">
                      <p className="text-xs text-text-muted mb-2 font-bold uppercase tracking-wider">Foto KTP</p>
                      <div className="w-full h-24 bg-surface rounded-lg flex items-center justify-center border border-dashed border-border-color overflow-hidden">
                        {bookings.find(b => b.id === modalConfig.bookingId)?.users?.user_verifications?.[0]?.identity_image_url ? (
                          <span className="text-xs text-primary font-bold break-all p-2">{bookings.find(b => b.id === modalConfig.bookingId)?.users?.user_verifications?.[0]?.identity_image_url}</span>
                        ) : (
                          <span className="text-xs text-text-muted">Belum ada</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-background rounded-xl p-3 border border-border-color text-center">
                      <p className="text-xs text-text-muted mb-2 font-bold uppercase tracking-wider">Selfie KTP</p>
                      <div className="w-full h-24 bg-surface rounded-lg flex items-center justify-center border border-dashed border-border-color overflow-hidden">
                        {bookings.find(b => b.id === modalConfig.bookingId)?.users?.user_verifications?.[0]?.selfie_image_url ? (
                          <span className="text-xs text-primary font-bold break-all p-2">{bookings.find(b => b.id === modalConfig.bookingId)?.users?.user_verifications?.[0]?.selfie_image_url}</span>
                        ) : (
                          <span className="text-xs text-text-muted">Belum ada</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  {bookings.find(b => b.id === modalConfig.bookingId)?.status === 'awaiting_verification' && (
                    <button 
                      className="flex-1 bg-accent hover:bg-accent/90 text-white py-3 rounded-xl font-bold transition-colors"
                      onClick={async () => {
                        await supabase.from('bookings').update({ status: 'active' }).eq('id', modalConfig.bookingId);
                        setBookings(prev => prev.map(b => b.id === modalConfig.bookingId ? { ...b, status: 'active' } : b));
                        setModalConfig({ type: null, bookingId: null });
                      }}
                    >
                      Verifikasi & Check In (Ambil Motor)
                    </button>
                  )}
                  {bookings.find(b => b.id === modalConfig.bookingId)?.status === 'active' && (
                    <button 
                      className="flex-1 bg-secondary hover:bg-secondary/90 text-white py-3 rounded-xl font-bold transition-colors"
                      onClick={async () => {
                        await supabase.from('bookings').update({ status: 'completed' }).eq('id', modalConfig.bookingId);
                        setBookings(prev => prev.map(b => b.id === modalConfig.bookingId ? { ...b, status: 'completed' } : b));
                        setModalConfig({ type: null, bookingId: null });
                      }}
                    >
                      Check Out (Kembali Motor)
                    </button>
                  )}
                  <button 
                    className="flex-1 bg-surface border border-border-color py-3 rounded-xl font-bold hover:bg-surface-hover"
                    onClick={() => setModalConfig({ type: null, bookingId: null })}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}

            {modalConfig.type === 'edit' && (
              <div>
                <div className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center mb-4">
                  <Edit3 size={24} />
                </div>
                <h2 className="text-xl font-bold mb-2">Edit Booking #{modalConfig.bookingId}</h2>
                <p className="text-text-muted mb-6">Silakan ubah detail pesanan yang diperlukan.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status Booking</label>
                    <select 
                      className="w-full bg-background border border-border-color p-3 rounded-xl text-text-main"
                      defaultValue={bookings.find(b => b.id === modalConfig.bookingId)?.status || 'pending_payment'}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        if (modalConfig.bookingId) {
                          await supabase.from('bookings').update({ status: newStatus }).eq('id', modalConfig.bookingId);
                          setBookings(prev => prev.map(b => b.id === modalConfig.bookingId ? { ...b, status: newStatus } : b));
                        }
                      }}
                    >
                      <option value="pending_payment">Pending Payment</option>
                      <option value="awaiting_verification">Awaiting Verification</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    className="flex-1 bg-surface border border-border-color hover:bg-surface-hover py-3 rounded-xl font-bold transition-colors"
                    onClick={() => setModalConfig({ type: null, bookingId: null })}
                  >
                    Batal
                  </button>
                  <button 
                    className="flex-1 btn-primary py-3 rounded-xl font-bold"
                    onClick={() => setModalConfig({ type: null, bookingId: null })}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            )}

            {modalConfig.type === 'cancel' && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mb-4 mx-auto">
                  <AlertTriangle size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2">Batalkan Pesanan?</h2>
                <p className="text-text-muted mb-6">
                  Apakah Anda yakin ingin membatalkan booking <span className="font-mono text-primary">#{modalConfig.bookingId}</span>? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-3">
                  <button 
                    className="flex-1 bg-surface border border-border-color hover:bg-surface-hover py-3 rounded-xl font-bold transition-colors"
                    onClick={() => setModalConfig({ type: null, bookingId: null })}
                  >
                    Kembali
                  </button>
                  <button 
                    className="flex-1 bg-secondary hover:bg-secondary/90 text-white py-3 rounded-xl font-bold transition-colors"
                    onClick={handleCancelConfirm}
                  >
                    Ya, Batalkan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
