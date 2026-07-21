'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Filter, Search, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function FleetPage() {
  const [motors, setMotors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('Semua');
  const [sortOrder, setSortOrder] = useState('default');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    async function fetchMotors() {
      const { data, error } = await supabase
        .from('motors')
        .select(`
          *,
          bookings(id, start_date, end_date, status)
        `)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        const today = new Date();
        today.setHours(0,0,0,0);

        const processedMotors = data.map(m => {
          let isRented = false;
          if (m.bookings) {
            for (const b of m.bookings) {
              if (['pending_payment', 'awaiting_verification', 'confirmed', 'active'].includes(b.status)) {
                const start = new Date(b.start_date);
                const end = new Date(b.end_date);
                start.setHours(0,0,0,0);
                end.setHours(0,0,0,0);
                
                if (today >= start && today <= end) {
                  isRented = true;
                  break;
                }
              }
            }
          }
          return {
            ...m,
            computedStatus: isRented ? 'rented' : m.status
          };
        });
        setMotors(processedMotors);
      }
      setLoading(false);
    }
    fetchMotors();
  }, []);

  const filteredMotors = motors.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'Semua' || m.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedMotors = [...filteredMotors].sort((a, b) => {
    if (sortOrder === 'price_asc') return Number(a.price_per_day) - Number(b.price_per_day);
    if (sortOrder === 'price_desc') return Number(b.price_per_day) - Number(a.price_per_day);
    if (sortOrder === 'available_first') {
      if (a.computedStatus === 'available' && b.computedStatus !== 'available') return -1;
      if (a.computedStatus !== 'available' && b.computedStatus === 'available') return 1;
      return 0;
    }
    return 0; // default (terbaru)
  });
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Armada Motor</h1>
          <p className="text-text-muted">Pilih motor yang sesuai dengan kebutuhan perjalanan Anda.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Cari motor..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border-color rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary text-text-main"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`bg-surface border ${showFilterDropdown ? 'border-primary' : 'border-border-color'} px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-surface-hover transition-colors`}
            >
              <Filter size={18} />
              <span className="hidden md:inline">Urutkan</span>
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border-color rounded-xl shadow-xl z-20 p-2 animate-fade-in">
                <p className="text-xs font-bold text-text-muted mb-2 px-2 uppercase tracking-wider">Urutkan Berdasarkan</p>
                {[
                  { value: 'default', label: 'Terbaru ditambahkan' },
                  { value: 'price_asc', label: 'Harga: Rendah ke Tinggi' },
                  { value: 'price_desc', label: 'Harga: Tinggi ke Rendah' },
                  { value: 'available_first', label: 'Yang Tersedia' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortOrder(option.value);
                      setShowFilterDropdown(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sortOrder === option.value ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-surface-hover'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-4 custom-scrollbar">
        {['Semua', 'Matic', 'Manual', 'Sport'].map(type => (
          <button 
            key={type}
            onClick={() => setFilterType(type)}
            className={`${filterType === type ? 'bg-primary text-white' : 'bg-surface hover:bg-surface-hover text-text-main border border-border-color'} px-6 py-2 rounded-full whitespace-nowrap transition-colors`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-12 text-center text-text-muted">
            <Loader2 className="animate-spin inline-block mx-auto mb-4" size={32} />
            <p>Memuat daftar armada...</p>
          </div>
        ) : sortedMotors.length > 0 ? (
          sortedMotors.map(motor => (
            <div key={motor.id} className="glass-card rounded-2xl overflow-hidden group">
              <div className="relative h-64 overflow-hidden bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={motor.image_url} alt={motor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold border border-white/10">
                  {motor.type}
                </div>
                {motor.computedStatus !== 'available' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                      {motor.computedStatus === 'rented' ? 'Sedang Disewa' : 'Dalam Perawatan'}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold font-heading">{motor.name}</h3>
                </div>
                <div className="flex items-center gap-4 text-text-muted text-sm mb-4">
                  <span>{motor.cc}cc</span>
                  <span>•</span>
                  <span>{motor.transmission}</span>
                  <span>•</span>
                  <span>{motor.year}</span>
                </div>
                <p className="text-sm text-text-muted mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  Tersedia di Kota Malang
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">Rp {Number(motor.price_per_day).toLocaleString('id-ID')}</span>
                    <span className="text-text-muted text-sm">/hari</span>
                  </div>
                  {motor.computedStatus === 'available' ? (
                    <Link href={`/fleet/${motor.id}`} className="btn-primary px-5 py-2 rounded-lg font-medium">
                      Sewa
                    </Link>
                  ) : (
                    <button disabled className="bg-surface text-text-muted border border-border-color px-5 py-2 rounded-lg font-medium cursor-not-allowed">
                      Habis
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-text-muted">
            <p>Tidak ada armada yang sesuai dengan pencarian Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
