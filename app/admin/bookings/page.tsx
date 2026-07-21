'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, X, AlertTriangle, Info, Edit3, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import PenaltyTimer from '@/components/PenaltyTimer';

type Booking = {
  id: string;
  booking_code: string;
  start_date: string;
  end_date: string;
  status: string;
  users: { 
    name: string; 
    phone: string | null;
  } | null;
  motors: { id: string; name: string } | null;
  payments: { proof_image_url: string }[] | { proof_image_url: string } | null;
  handovers: { type: string, condition_notes: string | null }[] | null;
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
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  
  // State untuk checklist pengembalian
  const [returnChecklist, setReturnChecklist] = useState({
    helmet: false,
    stnk: false,
    key: false,
    condition: false
  });

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
          users ( name, phone ),
          motors ( id, name ),
          payments ( proof_image_url ),
          handovers ( type, condition_notes )
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
    setReturnChecklist({ helmet: false, stnk: false, key: false, condition: false });
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
                    <td className="py-4 text-sm whitespace-nowrap">{new Date(booking.start_date).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})} • 09:00 WIB<br/>s/d<br/>{new Date(booking.end_date).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})} • 09:00 WIB</td>
                    <td className="py-4">{getStatusBadge(booking.status)}</td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => setModalConfig({ type: 'detail', bookingId: booking.id })}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${booking.status === 'awaiting_verification' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-surface border border-border-color text-text-main hover:bg-surface-hover'}`}
                      >
                        {booking.status === 'awaiting_verification' ? 'Konfirmasi Booking' : 'Lihat Detail'}
                      </button>
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

            {modalConfig.type === 'detail' && (() => {
              const activeBooking = bookings.find(b => b.id === modalConfig.bookingId);
              const payments = activeBooking?.payments;
              const proofImage = Array.isArray(payments) ? payments[0]?.proof_image_url : payments?.proof_image_url;
              return (
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                  <Info size={24} />
                </div>
                <h2 className="text-xl font-bold mb-2">Detail Booking #{modalConfig.bookingId}</h2>
                <p className="text-text-muted mb-6">Berikut adalah informasi lengkap mengenai pesanan ini.</p>
                
                <div className="space-y-3 bg-background rounded-xl p-4 border border-border-color mb-6">
                  <div className="flex justify-between"><span className="text-text-muted">Nama</span> <span className="font-medium">{activeBooking?.users?.name || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">No. HP</span> <span className="font-medium">{activeBooking?.users?.phone || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Motor</span> <span className="font-medium">{activeBooking?.motors?.name || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Waktu</span> <span className="font-medium">{new Date(activeBooking?.start_date || '').toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})} • 09:00 WIB</span></div>
                </div>

                {proofImage && (
                  <div className="mb-6">
                    <p className="text-sm font-medium mb-2">Bukti Pembayaran</p>
                    <div className="w-full h-48 rounded-xl overflow-hidden bg-black/5 border border-border-color relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={proofImage} alt="Bukti Pembayaran" className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => setFullscreenImage(proofImage)} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none flex items-center justify-center">
                        <span className="bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Perbesar</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {(() => {
                  const pickupHandover = activeBooking?.handovers?.find(h => h.type === 'pickup');
                  if (!pickupHandover?.condition_notes) return null;
                  try {
                    const notes = JSON.parse(pickupHandover.condition_notes);
                    if (!notes.ktp_image && !notes.handover_image) return null;
                    return (
                      <div className="mb-6">
                        <p className="text-sm font-medium mb-3">Dokumen Check-In</p>
                        <div className="grid grid-cols-2 gap-4">
                          {notes.ktp_image && (
                            <div>
                              <p className="text-xs text-text-muted mb-1">KTP Customer</p>
                              <div className="w-full h-32 rounded-xl overflow-hidden bg-black/5 border border-border-color relative group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={notes.ktp_image} alt="KTP" className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => setFullscreenImage(notes.ktp_image)} />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none flex items-center justify-center">
                                  <span className="bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Perbesar</span>
                                </div>
                              </div>
                            </div>
                          )}
                          {notes.handover_image && (
                            <div>
                              <p className="text-xs text-text-muted mb-1">Foto Serah Terima</p>
                              <div className="w-full h-32 rounded-xl overflow-hidden bg-black/5 border border-border-color relative group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={notes.handover_image} alt="Serah Terima" className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => setFullscreenImage(notes.handover_image)} />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none flex items-center justify-center">
                                  <span className="bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Perbesar</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  } catch(e) { return null; }
                })()}

                {activeBooking?.status === 'active' && (
                  <div className="mb-6 space-y-4">
                    <PenaltyTimer endDateStr={activeBooking.end_date} />
                    
                    <div className="p-4 border border-border-color rounded-xl bg-surface">
                      <p className="text-sm font-bold mb-3">Ceklis Kelengkapan Pengembalian</p>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" checked={returnChecklist.helmet} onChange={(e) => setReturnChecklist(prev => ({...prev, helmet: e.target.checked}))} />
                          <span className="text-sm font-medium">Helm (2 buah) kembali lengkap</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" checked={returnChecklist.stnk} onChange={(e) => setReturnChecklist(prev => ({...prev, stnk: e.target.checked}))} />
                          <span className="text-sm font-medium">STNK asli ada & tidak hilang</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" checked={returnChecklist.key} onChange={(e) => setReturnChecklist(prev => ({...prev, key: e.target.checked}))} />
                          <span className="text-sm font-medium">Kunci motor diserahkan normal</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" checked={returnChecklist.condition} onChange={(e) => setReturnChecklist(prev => ({...prev, condition: e.target.checked}))} />
                          <span className="text-sm font-medium">Kondisi motor sesuai saat Check-In</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  {bookings.find(b => b.id === modalConfig.bookingId)?.status === 'awaiting_verification' && (
                    <button 
                      className="flex-1 bg-accent hover:bg-accent/90 text-white py-3 rounded-xl font-bold transition-colors"
                      onClick={async () => {
                        await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', modalConfig.bookingId);
                        setBookings(prev => prev.map(b => b.id === modalConfig.bookingId ? { ...b, status: 'confirmed' } : b));
                        setModalConfig({ type: null, bookingId: null });
                      }}
                    >
                      Konfirmasi Booking
                    </button>
                  )}
                  {activeBooking?.status === 'active' && (
                    <button 
                      className="flex-1 bg-secondary hover:bg-secondary/90 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!returnChecklist.helmet || !returnChecklist.stnk || !returnChecklist.key || !returnChecklist.condition}
                      onClick={async () => {
                        await supabase.from('bookings').update({ status: 'completed' }).eq('id', modalConfig.bookingId);
                        
                        // Kembalikan status motor ke available
                        const motorId = activeBooking.motors?.id;
                        if (motorId) {
                           await supabase.from('motors').update({ status: 'available' }).eq('id', motorId);
                        }

                        setBookings(prev => prev.map(b => b.id === modalConfig.bookingId ? { ...b, status: 'completed' } : b));
                        setModalConfig({ type: null, bookingId: null });
                        setReturnChecklist({ helmet: false, stnk: false, key: false, condition: false });
                      }}
                    >
                      Check Out (Kembali Motor)
                    </button>
                  )}
                  <button 
                    className="flex-1 bg-surface border border-border-color py-3 rounded-xl font-bold hover:bg-surface-hover"
                    onClick={() => {
                      setModalConfig({ type: null, bookingId: null });
                      setReturnChecklist({ helmet: false, stnk: false, key: false, condition: false });
                    }}
                  >
                    Tutup
                  </button>
                </div>
              </div>
              );
            })()}

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
      {/* Fullscreen Image Lightbox */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setFullscreenImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors bg-black/50 p-2 rounded-full"
            onClick={() => setFullscreenImage(null)}
          >
            <X size={24} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={fullscreenImage} 
            alt="Fullscreen Proof" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
