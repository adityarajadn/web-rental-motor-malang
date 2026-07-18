'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Save, Building, CreditCard, User, QrCode, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    bankName: 'BCA',
    accountNumber: '1234 5678 9012',
    accountName: 'Rental Motor Malang',
    qrisImage: '',
    contactWhatsapp: '085536952006'
  });
  
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from('settings')
        .select('*');
      
      if (error) {
        setFetchError(error.message);
      } else if (data) {
        const newSettings = { ...settings };
        data.forEach(item => {
          if (item.key === 'bank_name') newSettings.bankName = item.value;
          if (item.key === 'bank_account_number') newSettings.accountNumber = item.value;
          if (item.key === 'bank_account_name') newSettings.accountName = item.value;
          if (item.key === 'qris_image_url') newSettings.qrisImage = item.value;
          if (item.key === 'contact_whatsapp') newSettings.contactWhatsapp = item.value;
        });
        setSettings(newSettings);
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    
    const updates = [
      { key: 'bank_name', value: settings.bankName || '', description: 'Nama bank pembayaran' },
      { key: 'bank_account_number', value: settings.accountNumber || '', description: 'Nomor rekening pembayaran' },
      { key: 'bank_account_name', value: settings.accountName || '', description: 'Atas nama rekening' },
      { key: 'qris_image_url', value: settings.qrisImage || '', description: 'Link gambar QRIS' },
      { key: 'contact_whatsapp', value: settings.contactWhatsapp || '', description: 'Nomor WhatsApp admin' }
    ];

    const { error } = await supabase
      .from('settings')
      .upsert(updates, { onConflict: 'key' });
      
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert("Gagal menyimpan: " + error.message);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-1">Pengaturan Pembayaran</h1>
        <p className="text-text-muted">Kelola rekening bank dan QRIS yang akan ditampilkan pada halaman checkout pengguna.</p>
      </div>

      <div className="max-w-2xl">
        {loading ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-border-color">
            <Loader2 className="animate-spin inline-block mx-auto mb-4 text-text-muted" size={32} />
            <p className="text-text-muted">Memuat pengaturan...</p>
          </div>
        ) : fetchError ? (
          <div className="bg-red-500/10 rounded-2xl p-12 text-center border border-red-500/20 mb-8">
            <h3 className="text-xl font-bold text-red-500 mb-2">Error!</h3>
            <p className="text-red-500/80">{fetchError}</p>
          </div>
        ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-border-color animate-fade-in">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Building className="text-primary" /> Transfer Bank / Virtual Account
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nama Bank</label>
                <div className="relative">
                  <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    type="text" 
                    name="bankName"
                    value={settings.bankName || ''}
                    onChange={handleChange}
                    className="w-full bg-surface border border-border-color p-3 pl-10 rounded-xl text-text-main focus:outline-none focus:border-primary" 
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Nomor Rekening</label>
                <div className="relative">
                  <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    type="text" 
                    name="accountNumber"
                    value={settings.accountNumber || ''}
                    onChange={handleChange}
                    className="w-full bg-surface border border-border-color p-3 pl-10 rounded-xl text-text-main focus:outline-none focus:border-primary font-mono tracking-wider" 
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Atas Nama</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    type="text" 
                    name="accountName"
                    value={settings.accountName || ''}
                    onChange={handleChange}
                    className="w-full bg-surface border border-border-color p-3 pl-10 rounded-xl text-text-main focus:outline-none focus:border-primary" 
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-border-color animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <QrCode className="text-primary" /> Pengaturan QRIS
            </h2>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-white p-4 rounded-xl border border-border-color shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {settings.qrisImage ? (
                  <img src={settings.qrisImage} alt="QRIS Preview" className="w-32 h-32 object-contain" />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center text-text-muted bg-surface/50 text-sm text-center">Belum ada QRIS</div>
                )}
              </div>
              
              <div className="w-full">
                <label className="text-sm font-medium mb-2 block">URL Gambar QRIS Baru</label>
                <input 
                  type="url" 
                  name="qrisImage"
                  value={settings.qrisImage || ''}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-surface border border-border-color p-3 rounded-xl text-text-main focus:outline-none focus:border-primary" 
                />
                <p className="text-xs text-text-muted mt-2">
                  Masukkan tautan (URL) gambar QRIS Anda. Karena penyimpanan cloud belum diatur, gunakan tautan gambar yang sudah diunggah di internet (misal: Imgur, dll).
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-border-color animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="text-primary" /> Kontak & Layanan
            </h2>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Nomor WhatsApp Admin</label>
              <div className="relative">
                <MessageCircle size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                  type="text" 
                  name="contactWhatsapp"
                  value={settings.contactWhatsapp || ''}
                  onChange={handleChange}
                  className="w-full bg-surface border border-border-color p-3 pl-10 rounded-xl text-text-main focus:outline-none focus:border-primary font-mono" 
                  required
                />
              </div>
              <p className="text-xs text-text-muted mt-2">
                Gunakan format yang diawali dengan angka 0 (Contoh: 085536952006)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <button 
              type="submit"
              className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              <Save size={18} /> Simpan Pengaturan
            </button>
            {saved && (
              <span className="text-accent flex items-center gap-2 font-medium animate-fade-in">
                <CheckCircle size={18} /> Tersimpan!
              </span>
            )}
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
