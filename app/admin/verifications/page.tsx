'use client';

import { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, X, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [modalConfig, setModalConfig] = useState<{ type: 'approve' | 'reject' | null, data: any }>({ type: null, data: null });
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    async function fetchVerifications() {
      const { data, error } = await supabase
        .from('user_verifications')
        .select(`
          id,
          identity_image_url,
          selfie_image_url,
          status,
          created_at,
          user_id,
          users!fk_verification_user ( name )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) {
        setFetchError(error.message || JSON.stringify(error));
      } else if (data) {
        setVerifications(data);
      }
      setLoading(false);
    }
    fetchVerifications();
  }, []);

  const handleProcess = async () => {
    if (!modalConfig.data) return;
    
    const newStatus = modalConfig.type === 'approve' ? 'verified' : 'rejected';
    const updateData: any = { 
      status: newStatus, 
      verified_at: new Date().toISOString() 
    };

    // Update the verification record
    await supabase.from('user_verifications').update(updateData).eq('id', modalConfig.data.id);
    
    // Also update their pending booking!
    if (newStatus === 'verified') {
      await supabase.from('bookings')
        .update({ status: 'confirmed' })
        .eq('user_id', modalConfig.data.user_id)
        .eq('status', 'awaiting_verification');
    } else {
      await supabase.from('bookings')
        .update({ status: 'cancelled' })
        .eq('user_id', modalConfig.data.user_id)
        .eq('status', 'awaiting_verification');
    }

    setVerifications(prev => prev.filter(v => v.id !== modalConfig.data.id));

    setModalConfig({ type: null, data: null });
    setRejectionReason('');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">Verifikasi User</h1>
          <p className="text-text-muted">Periksa dan validasi dokumen identitas penyewa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full bg-surface rounded-2xl p-12 text-center border border-border-color">
            <Loader2 className="animate-spin inline-block mx-auto mb-4 text-text-muted" size={32} />
            <p className="text-text-muted">Memuat data verifikasi...</p>
          </div>
        ) : fetchError ? (
          <div className="col-span-full bg-red-500/10 rounded-2xl p-12 text-center border border-red-500/20">
            <h3 className="text-xl font-bold text-red-500 mb-2">Error!</h3>
            <p className="text-red-500/80">{fetchError}</p>
          </div>
        ) : verifications.length > 0 ? (
          verifications.map((verification) => {
            const userName = verification.users?.name || 'User';
            const initials = userName.substring(0, 2).toUpperCase();
            const date = new Date(verification.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

            return (
              <div key={verification.id} className="glass-card rounded-2xl p-6 border border-border-color animate-fade-in">
                <div className="flex items-center justify-between mb-6 border-b border-border-color pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center font-bold text-lg text-text-muted border border-border-color">
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{userName}</h3>
                      <p className="text-sm text-text-muted">ID User: <span className="font-mono text-primary text-xs">{verification.user_id.substring(0,8)}...</span></p>
                    </div>
                  </div>
                  <span className="text-sm text-text-muted">{date} WIB</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm font-medium mb-2">Foto KTP</p>
                    <div className="h-32 bg-surface rounded-xl border border-border-color overflow-hidden flex items-center justify-center text-text-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {verification.identity_image_url ? <img src={verification.identity_image_url} alt="KTP" className="w-full h-full object-cover" /> : '[Tidak Ada KTP]'}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Foto Selfie KTP</p>
                    <div className="h-32 bg-surface rounded-xl border border-border-color overflow-hidden flex items-center justify-center text-text-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {verification.selfie_image_url ? <img src={verification.selfie_image_url} alt="Selfie KTP" className="w-full h-full object-cover" /> : '[Tidak Ada Selfie]'}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    className="flex-1 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors"
                    onClick={() => setModalConfig({ type: 'reject', data: verification })}
                  >
                    <XCircle size={18} /> Tolak Verifikasi
                  </button>
                  <button 
                    className="flex-1 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors"
                    onClick={() => setModalConfig({ type: 'approve', data: verification })}
                  >
                    <CheckCircle size={18} /> Setujui Data
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-surface rounded-2xl p-12 text-center border border-border-color">
            <div className="w-16 h-16 rounded-full bg-accent/20 text-accent flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Semua Selesai!</h3>
            <p className="text-text-muted">Tidak ada lagi dokumen pengguna yang perlu diverifikasi saat ini.</p>
          </div>
        )}
      </div>

      {/* Modal Custom UI */}
      {modalConfig.type && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" 
          onClick={() => setModalConfig({ type: null, data: null })}
        >
          <div 
            className="bg-surface border border-border-color rounded-2xl p-6 max-w-md w-full shadow-2xl relative" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-text-muted hover:text-text-main"
              onClick={() => setModalConfig({ type: null, data: null })}
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto ${modalConfig.type === 'approve' ? 'bg-accent/20 text-accent' : 'bg-secondary/20 text-secondary'}`}>
                {modalConfig.type === 'approve' ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
              </div>
              <h2 className="text-xl font-bold mb-2">
                {modalConfig.type === 'approve' ? 'Setujui Verifikasi?' : 'Tolak Verifikasi?'}
              </h2>
              <p className="text-text-muted mb-6">
                Apakah Anda yakin ingin {modalConfig.type === 'approve' ? 'menyetujui' : 'menolak'} data identitas atas nama <strong>{modalConfig.data.users?.name || 'User'}</strong>?
              </p>

              <div className="flex gap-3">
                <button 
                  className="flex-1 bg-surface border border-border-color hover:bg-surface-hover py-3 rounded-xl font-bold transition-colors"
                  onClick={() => setModalConfig({ type: null, data: null })}
                >
                  Batal
                </button>
                <button 
                  className={`flex-1 text-white py-3 rounded-xl font-bold transition-colors ${modalConfig.type === 'approve' ? 'bg-accent hover:bg-accent/90' : 'bg-secondary hover:bg-secondary/90'}`}
                  onClick={handleProcess}
                >
                  Ya, {modalConfig.type === 'approve' ? 'Setujui' : 'Tolak'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
