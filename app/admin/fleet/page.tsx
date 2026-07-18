'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, AlertTriangle, Settings, Upload, Search, Filter, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminFleetPage() {
  const [motorsList, setMotorsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const [modalConfig, setModalConfig] = useState<{ type: 'add' | 'edit' | 'delete' | null, data: any }>({ type: null, data: null });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  useEffect(() => {
    async function fetchMotors() {
      const { data, error } = await supabase
        .from('motors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setFetchError(error.message || JSON.stringify(error));
      } else if (data) {
        setMotorsList(data);
      }
      setLoading(false);
    }
    fetchMotors();
  }, []);

  const filteredMotors = motorsList.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'Semua' || m.type === filterType;
    const matchesStatus = filterStatus === 'Semua' || m.status === (filterStatus === 'Tersedia' ? 'available' : 'rented');
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = async () => {
    if (modalConfig.data) {
      await supabase.from('motors').delete().eq('id', modalConfig.data.id);
      setMotorsList(prev => prev.filter(m => m.id !== modalConfig.data.id));
    }
    setModalConfig({ type: null, data: null });
    setSelectedImage(null);
  };

  const openModal = (type: 'add' | 'edit' | 'delete', data: any) => {
    setModalConfig({ type, data });
    setSelectedImage(null);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Default image if none provided. Normally you would upload to Supabase Storage.
    let imageUrl = modalConfig.data?.image_url || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80';
    if (selectedImage) {
      // Just a placeholder since we don't have a storage bucket set up yet
      imageUrl = URL.createObjectURL(selectedImage);
    }

    const newMotor = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      brand: formData.get('brand') as string || 'Honda',
      year: Number(formData.get('year')) || 2024,
      cc: Number(formData.get('cc')) || 150,
      transmission: formData.get('transmission') as string || 'Automatic',
      license_plate: formData.get('license_plate') as string || `N ${Math.floor(Math.random()*9000)+1000} AB`,
      price_per_day: Number(formData.get('price_per_day')) || 100000,
      status: formData.get('status') === 'available' ? 'available' : 'rented',
      image_url: imageUrl,
    };

    if (modalConfig.type === 'add') {
      const { data, error } = await supabase.from('motors').insert(newMotor).select().single();
      if (!error && data) {
        setMotorsList(prev => [data, ...prev]);
      }
    } else {
      const { data, error } = await supabase.from('motors').update(newMotor).eq('id', modalConfig.data.id).select().single();
      if (!error && data) {
        setMotorsList(prev => prev.map(m => m.id === data.id ? data : m));
      }
    }
    setModalConfig({ type: null, data: null });
    setSelectedImage(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">Armada Motor</h1>
          <p className="text-text-muted">Kelola ketersediaan dan detail armada motor.</p>
        </div>
        <button 
          className="btn-primary px-4 py-2.5 rounded-xl flex items-center gap-2"
          onClick={() => openModal('add', null)}
        >
          <Plus size={18} /> Tambah Armada
        </button>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-border-color mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama motor..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border-color rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary text-text-main transition-colors"
            />
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <div className="relative w-full sm:w-auto">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <Filter size={18} />
              </div>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full sm:w-auto bg-surface border border-border-color pl-10 pr-10 py-2.5 rounded-xl appearance-none focus:outline-none focus:border-primary text-text-main cursor-pointer"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Matic">Matic</option>
                <option value="Manual">Manual</option>
                <option value="Sport">Sport</option>
              </select>
            </div>
            <div className="relative w-full sm:w-auto">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <Filter size={18} />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto bg-surface border border-border-color pl-10 pr-10 py-2.5 rounded-xl appearance-none focus:outline-none focus:border-primary text-text-main cursor-pointer"
              >
                <option value="Semua">Semua Status</option>
                <option value="Tersedia">Tersedia</option>
                <option value="Disewa">Sedang Disewa</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-text-muted">
            <Loader2 className="animate-spin inline-block mr-2" size={24} /> Memuat data armada...
          </div>
        ) : fetchError ? (
          <div className="col-span-full text-center py-12 text-red-500 font-bold bg-red-500/10 rounded-xl">
            Error: {fetchError}
          </div>
        ) : filteredMotors.length > 0 ? (
          filteredMotors.map(motor => (
            <div key={motor.id} className="glass-card rounded-2xl p-5 border border-border-color animate-fade-in group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">{motor.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${motor.status === 'available' ? 'bg-accent/20 text-accent' : motor.status === 'maintenance' ? 'bg-orange-500/20 text-orange-500' : 'bg-secondary/20 text-secondary'}`}>
                  {motor.status === 'available' ? 'Tersedia' : motor.status === 'maintenance' ? 'Perawatan' : 'Disewa'}
                </span>
              </div>
              
              <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={motor.image_url} alt={motor.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Brand / Tipe</span>
                  <span className="font-medium">{motor.brand} - {motor.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Plat Nomor</span>
                  <span className="font-medium font-mono">{motor.license_plate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Harga/Hari</span>
                  <span className="font-medium text-primary">Rp {Number(motor.price_per_day).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  className="flex-1 bg-surface hover:bg-surface-hover border border-border-color py-2 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors"
                  onClick={() => openModal('edit', motor)}
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button 
                  className="flex-none bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 px-3 py-2 rounded-lg transition-colors"
                  onClick={() => openModal('delete', motor)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-text-muted">
            Belum ada armada yang cocok.
          </div>
        )}
      </div>

      {/* Modal Custom UI */}
      {modalConfig.type && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" 
          onClick={() => openModal(null as any, null)}
        >
          <div 
            className="bg-surface border border-border-color rounded-2xl p-6 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-text-muted hover:text-text-main"
              onClick={() => openModal(null as any, null)}
            >
              <X size={20} />
            </button>

            {(modalConfig.type === 'add' || modalConfig.type === 'edit') && (
              <form onSubmit={handleSave}>
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                  <Settings size={24} />
                </div>
                <h2 className="text-xl font-bold mb-2">
                  {modalConfig.type === 'add' ? 'Tambah Armada Baru' : 'Edit Armada'}
                </h2>
                <p className="text-text-muted mb-6">
                  {modalConfig.type === 'add' ? 'Masukkan detail spesifikasi armada motor yang baru.' : 'Ubah spesifikasi atau status armada ini.'}
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nama Motor</label>
                      <input 
                        name="name"
                        type="text" 
                        defaultValue={modalConfig.data?.name || ''} 
                        placeholder="Cth: Vario 160"
                        required
                        className="w-full bg-background border border-border-color p-3 rounded-xl text-text-main focus:outline-none focus:border-primary" 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Brand</label>
                      <input 
                        name="brand"
                        type="text" 
                        defaultValue={modalConfig.data?.brand || ''} 
                        placeholder="Cth: Honda"
                        required
                        className="w-full bg-background border border-border-color p-3 rounded-xl text-text-main focus:outline-none focus:border-primary" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">URL Foto Motor</label>
                    <input 
                      type="url"
                      name="image_url"
                      defaultValue={modalConfig.data?.image_url || ''} 
                      placeholder="https://..."
                      className="w-full bg-background border border-border-color p-3 rounded-xl text-text-main focus:outline-none focus:border-primary" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Tipe</label>
                      <select 
                        name="type"
                        defaultValue={modalConfig.data?.type || 'Matic'}
                        className="w-full bg-background border border-border-color p-3 rounded-xl text-text-main focus:outline-none focus:border-primary"
                      >
                        <option value="Matic">Matic</option>
                        <option value="Manual">Manual</option>
                        <option value="Sport">Sport</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Harga/Hari</label>
                      <input 
                        name="price_per_day"
                        type="number" 
                        defaultValue={modalConfig.data?.price_per_day || ''} 
                        placeholder="Rp"
                        required
                        className="w-full bg-background border border-border-color p-3 rounded-xl text-text-main focus:outline-none focus:border-primary" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Plat Nomor</label>
                      <input 
                        name="license_plate"
                        type="text" 
                        defaultValue={modalConfig.data?.license_plate || ''} 
                        placeholder="Cth: N 1234 AB"
                        required
                        className="w-full bg-background border border-border-color p-3 rounded-xl text-text-main focus:outline-none focus:border-primary" 
                      />
                    </div>
                  </div>

                  {/* Detail Spesifikasi */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Kapasitas Mesin</label>
                      <div className="relative">
                        <input 
                          name="cc"
                          type="number" 
                          defaultValue={modalConfig.data?.cc || 150} 
                          placeholder="Cth: 155"
                          required
                          className="w-full bg-background border border-border-color p-3 pr-12 rounded-xl text-text-main focus:outline-none focus:border-primary" 
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium">CC</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Transmisi</label>
                      <select 
                        name="transmission"
                        defaultValue={modalConfig.data?.transmission || 'Automatic'}
                        className="w-full bg-background border border-border-color p-3 rounded-xl text-text-main focus:outline-none focus:border-primary"
                      >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Tahun</label>
                      <input 
                        name="year"
                        type="number" 
                        defaultValue={modalConfig.data?.year || new Date().getFullYear()} 
                        placeholder="Cth: 2023"
                        required
                        className="w-full bg-background border border-border-color p-3 rounded-xl text-text-main focus:outline-none focus:border-primary" 
                      />
                    </div>
                  </div>

                  {/* Checklist Fasilitas */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Fasilitas Termasuk</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-3 p-3 border border-border-color rounded-xl cursor-pointer hover:bg-surface transition-colors">
                        <input type="checkbox" name="facilities" value="helm" defaultChecked className="accent-primary w-5 h-5 rounded border-border-color" />
                        <span className="text-sm font-medium">2 Helm SNI</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-border-color rounded-xl cursor-pointer hover:bg-surface transition-colors">
                        <input type="checkbox" name="facilities" value="jas_hujan" defaultChecked className="accent-primary w-5 h-5 rounded border-border-color" />
                        <span className="text-sm font-medium">2 Jas Hujan</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-border-color rounded-xl cursor-pointer hover:bg-surface transition-colors">
                        <input type="checkbox" name="facilities" value="masker" defaultChecked className="accent-primary w-5 h-5 rounded border-border-color" />
                        <span className="text-sm font-medium">Masker Motor (Baru)</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-border-color rounded-xl cursor-pointer hover:bg-surface transition-colors">
                        <input type="checkbox" name="facilities" value="gembok" defaultChecked className="accent-primary w-5 h-5 rounded border-border-color" />
                        <span className="text-sm font-medium">Gembok Pengaman</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status Ketersediaan</label>
                    <select 
                      name="status"
                      defaultValue={modalConfig.data?.status || 'available'}
                      className="w-full bg-background border border-border-color p-3 rounded-xl text-text-main focus:outline-none focus:border-primary"
                    >
                      <option value="available">Tersedia</option>
                      <option value="rented">Sedang Disewa</option>
                      <option value="maintenance">Perawatan</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button 
                    type="button"
                    className="flex-1 bg-surface border border-border-color hover:bg-surface-hover py-3 rounded-xl font-bold transition-colors"
                    onClick={() => openModal(null as any, null)}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 btn-primary py-3 rounded-xl font-bold"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            )}

            {modalConfig.type === 'delete' && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mb-4 mx-auto">
                  <AlertTriangle size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2">Hapus Armada?</h2>
                <p className="text-text-muted mb-6">
                  Apakah Anda yakin ingin menghapus <strong>{modalConfig.data?.name}</strong> dari daftar armada? Data ini tidak bisa dikembalikan.
                </p>
                <div className="flex gap-3">
                  <button 
                    className="flex-1 bg-surface border border-border-color hover:bg-surface-hover py-3 rounded-xl font-bold transition-colors"
                    onClick={() => setModalConfig({ type: null, data: null })}
                  >
                    Kembali
                  </button>
                  <button 
                    className="flex-1 bg-secondary hover:bg-secondary/90 text-white py-3 rounded-xl font-bold transition-colors"
                    onClick={handleDelete}
                  >
                    Ya, Hapus
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
