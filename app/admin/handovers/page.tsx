'use client';

import { useState, useEffect } from 'react';
import { Key, ArrowRightLeft, CheckSquare, X, Info, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminHandoversPage() {
  const [checkouts, setCheckouts] = useState<any[]>([]);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [modalConfig, setModalConfig] = useState<{ type: 'checkout' | 'checkin' | null, data: any }>({ type: null, data: null });
  const [returnChecklist, setReturnChecklist] = useState({
    helmet: false,
    stnk: false,
    key: false,
    condition: false
  });
  
  // State untuk file upload saat check-in (pickup)
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [handoverFile, setHandoverFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchHandovers() {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_code,
          pickup_location,
          dropoff_location,
          start_date,
          end_date,
          status,
          users ( name ),
          motors ( id, name, license_plate )
        `)
        .in('status', ['confirmed', 'active'])
        .order('start_date', { ascending: true });

      if (error) {
        setFetchError(error.message || JSON.stringify(error));
      } else if (data) {
        setCheckouts(data.filter(b => b.status === 'confirmed'));
        setCheckins(data.filter(b => b.status === 'active'));
      }
      setLoading(false);
    }
    fetchHandovers();
  }, []);

  const handleProcess = async () => {
    if (!modalConfig.data) return;

    if (modalConfig.type === 'checkout') {
      // Pickup complete -> booking becomes 'active'
      await supabase.from('bookings').update({ status: 'active' }).eq('id', modalConfig.data.id);
      
      // Save images as base64 in handovers table
      if (ktpFile && handoverFile) {
        const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
        
        try {
          const ktpBase64 = await toBase64(ktpFile);
          const handoverBase64 = await toBase64(handoverFile);
          
          await supabase.from('handovers').insert({
            booking_id: modalConfig.data.id,
            type: 'pickup',
            location: modalConfig.data.pickup_location,
            scheduled_time: modalConfig.data.start_date,
            actual_time: new Date().toISOString(),
            status: 'completed',
            condition_notes: JSON.stringify({ ktp_image: ktpBase64, handover_image: handoverBase64 })
          });
        } catch (e) {
          console.error("Failed to save photos to handovers", e);
        }
      }
      
      setCheckouts(prev => prev.filter(c => c.id !== modalConfig.data.id));
    } else if (modalConfig.type === 'checkin') {
      // Dropoff complete -> booking becomes 'completed'
      await supabase.from('bookings').update({ status: 'completed' }).eq('id', modalConfig.data.id);
      
      const motorId = modalConfig.data.motors?.id;
      if (motorId) {
        await supabase.from('motors').update({ status: 'available' }).eq('id', motorId);
      }

      setCheckins(prev => prev.filter(c => c.id !== modalConfig.data.id));
    }
    setModalConfig({ type: null, data: null });
    setReturnChecklist({ helmet: false, stnk: false, key: false, condition: false });
    setKtpFile(null);
    setHandoverFile(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">Serah Terima & Kembali</h1>
          <p className="text-text-muted">Jadwal pengambilan dan pengembalian armada motor.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kolom Check-out */}
        <div className="glass-card rounded-2xl p-6 border border-border-color">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center">
              <Key size={20} />
            </div>
            <h2 className="text-xl font-bold font-heading">Jadwal Pengambilan (Check-in)</h2>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-text-muted">
                <Loader2 className="animate-spin inline-block mr-2" size={20} />
                Memuat data...
              </div>
            ) : fetchError ? (
              <div className="text-center py-8 text-red-500 bg-red-500/10 rounded-xl font-bold">
                Error: {fetchError}
              </div>
            ) : checkouts.length > 0 ? (
              checkouts.map((h) => (
                <div key={h.id} className="bg-surface rounded-xl p-4 border border-border-color flex flex-col gap-4 animate-fade-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{h.motors?.name} <span className="text-sm font-normal text-text-muted">({h.motors?.license_plate})</span></h3>
                      <p className="text-text-muted text-sm flex flex-col gap-1">
                        <span>Penyewa: <span className="font-medium text-text-main">{h.users?.name}</span></span>
                        <span>Booking ID: <span className="font-mono text-xs">{h.booking_code}</span></span>
                        <span>Tgl Pengambilan: <span className="font-medium">{new Date(h.start_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} • 09:00 WIB</span></span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-3 text-sm flex flex-col gap-2 border border-border-color">
                    <p className="font-medium text-accent">Lokasi Pengambilan:</p>
                    <p>{h.pickup_location}</p>
                  </div>
                  <button 
                    onClick={() => setModalConfig({ type: 'checkout', data: h })}
                    className="btn-primary w-full py-2.5 rounded-lg font-bold flex justify-center gap-2"
                  >
                    <CheckSquare size={18} /> Proses Serah Terima
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-text-muted">
                Tidak ada jadwal pengambilan motor saat ini.
              </div>
            )}
          </div>
        </div>

        {/* Kolom Check-in */}
        <div className="glass-card rounded-2xl p-6 border border-border-color">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
              <ArrowRightLeft size={20} />
            </div>
            <h2 className="text-xl font-bold font-heading">Jadwal Pengembalian (Check-out)</h2>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-text-muted">
                <Loader2 className="animate-spin inline-block mr-2" size={20} />
                Memuat data...
              </div>
            ) : fetchError ? (
              <div className="text-center py-8 text-red-500 bg-red-500/10 rounded-xl font-bold">
                Error: {fetchError}
              </div>
            ) : checkins.length > 0 ? (
              checkins.map((h) => (
                <div key={h.id} className="bg-surface rounded-xl p-4 border border-border-color flex flex-col gap-4 animate-fade-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{h.motors?.name} <span className="text-sm font-normal text-text-muted">({h.motors?.license_plate})</span></h3>
                      <p className="text-text-muted text-sm flex flex-col gap-1">
                        <span>Penyewa: <span className="font-medium text-text-main">{h.users?.name}</span></span>
                        <span>Booking ID: <span className="font-mono text-xs">{h.booking_code}</span></span>
                        <span>Tgl Pengembalian: <span className="font-medium">{new Date(h.end_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} • 09:00 WIB</span></span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-3 text-sm flex flex-col gap-2 border border-border-color">
                    <p className="font-medium text-secondary">Lokasi Pengembalian:</p>
                    <p>{h.dropoff_location}</p>
                  </div>
                  <button 
                    onClick={() => setModalConfig({ type: 'checkin', data: h })}
                    className="btn-primary w-full py-2.5 rounded-lg font-bold flex justify-center gap-2 bg-secondary hover:bg-secondary/90"
                  >
                    <CheckSquare size={18} /> Proses Pengembalian
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-text-muted">
                Tidak ada jadwal pengembalian motor saat ini.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Custom UI */}
      {modalConfig.type && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" 
          onClick={() => {
            setModalConfig({ type: null, data: null });
            setReturnChecklist({ helmet: false, stnk: false, key: false, condition: false });
            setKtpFile(null);
            setHandoverFile(null);
          }}
        >
          <div 
            className="bg-surface border border-border-color rounded-2xl p-6 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-text-muted hover:text-text-main"
              onClick={() => {
                setModalConfig({ type: null, data: null });
                setReturnChecklist({ helmet: false, stnk: false, key: false, condition: false });
                setKtpFile(null);
                setHandoverFile(null);
              }}
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto ${modalConfig.type === 'checkout' ? 'bg-accent/20 text-accent' : 'bg-secondary/20 text-secondary'}`}>
                {modalConfig.type === 'checkout' ? <Key size={32} /> : <ArrowRightLeft size={32} />}
              </div>
              <h2 className="text-xl font-bold mb-2">
                Konfirmasi {modalConfig.type === 'checkout' ? 'Pengambilan' : 'Pengembalian'}
              </h2>
              <p className="text-text-muted mb-6">
                Apakah Anda yakin ingin memproses status untuk pesanan <span className="font-mono text-primary">#{modalConfig.data.booking_code}</span> atas nama <strong>{modalConfig.data.users?.name}</strong>?
              </p>
              
              <div className="space-y-3 bg-background rounded-xl p-4 border border-border-color mb-6">
                <div className="flex justify-between"><span className="text-text-muted">Nama</span> <span className="font-medium">{modalConfig.data?.users?.name || 'User'}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Booking</span> <span className="font-medium text-primary font-mono">#{modalConfig.data?.booking_code}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Waktu</span> <span className="font-medium">{modalConfig.data && new Date(modalConfig.type === 'checkout' ? modalConfig.data.start_date : modalConfig.data.end_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} • 09:00 WIB</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Motor</span> <span className="font-medium text-right">{modalConfig.data?.motors?.name} ({modalConfig.data?.motors?.license_plate})</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Lokasi</span> <span className="font-medium text-right">{modalConfig.type === 'checkout' ? modalConfig.data?.pickup_location : modalConfig.data?.dropoff_location}</span></div>
              </div>

              {/* Form Upload & Ceklis untuk Check-in (Pickup) */}
              {modalConfig.type === 'checkout' && (
                <div className="mb-6 p-4 border border-border-color rounded-xl bg-surface text-left space-y-5">
                  <div>
                    <label className="text-sm font-bold block mb-2">Upload KTP Customer</label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => setKtpFile(e.target.files?.[0] || null)}
                          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                      </div>
                      {ktpFile && (
                        <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-border-color">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={URL.createObjectURL(ktpFile)} alt="Preview KTP" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold block mb-2">Upload Foto Serah Terima</label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => setHandoverFile(e.target.files?.[0] || null)}
                          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                      </div>
                      {handoverFile && (
                        <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-border-color">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={URL.createObjectURL(handoverFile)} alt="Preview Serah Terima" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm font-bold mb-3">Ceklis Kelengkapan Check-In</p>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" checked={returnChecklist.helmet} onChange={(e) => setReturnChecklist(prev => ({...prev, helmet: e.target.checked}))} />
                        <span className="text-sm font-medium">Helm (2 buah) lengkap</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" checked={returnChecklist.stnk} onChange={(e) => setReturnChecklist(prev => ({...prev, stnk: e.target.checked}))} />
                        <span className="text-sm font-medium">STNK asli diserahkan</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" checked={returnChecklist.key} onChange={(e) => setReturnChecklist(prev => ({...prev, key: e.target.checked}))} />
                        <span className="text-sm font-medium">Kunci motor diserahkan normal</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" checked={returnChecklist.condition} onChange={(e) => setReturnChecklist(prev => ({...prev, condition: e.target.checked}))} />
                        <span className="text-sm font-medium">Kondisi motor prima (telah dicek)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {modalConfig.type === 'checkin' && (
                <div className="mb-6 p-4 border border-border-color rounded-xl bg-surface text-left">
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
              )}

              <div className="flex gap-3">
                <button 
                  className="flex-1 bg-surface border border-border-color hover:bg-surface-hover py-3 rounded-xl font-bold transition-colors"
                  onClick={() => {
                    setModalConfig({ type: null, data: null });
                    setReturnChecklist({ helmet: false, stnk: false, key: false, condition: false });
                    setKtpFile(null);
                    setHandoverFile(null);
                  }}
                >
                  Batal
                </button>
                <button 
                  className={`flex-1 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${modalConfig.type === 'checkout' ? 'bg-primary hover:bg-primary-hover' : 'bg-secondary hover:bg-secondary/90'}`}
                  disabled={
                    (modalConfig.type === 'checkin' && (!returnChecklist.helmet || !returnChecklist.stnk || !returnChecklist.key || !returnChecklist.condition)) ||
                    (modalConfig.type === 'checkout' && (!returnChecklist.helmet || !returnChecklist.stnk || !returnChecklist.key || !returnChecklist.condition || !ktpFile || !handoverFile))
                  }
                  onClick={handleProcess}
                >
                  Ya, Proses Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
