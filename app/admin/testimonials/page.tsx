'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Star, CheckCircle, XCircle, Search } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select(`
        *,
        users (name),
        bookings (motors (name))
      `)
      .order('created_at', { ascending: false });

    if (data) {
      setTestimonials(data);
    }
    setLoading(false);
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_featured: !currentStatus })
      .eq('id', id);

    if (!error) {
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, is_featured: !currentStatus } : t));
    } else {
      alert("Gagal memperbarui status testimoni: " + error.message);
    }
  };

  const filteredTestimonials = testimonials.filter(t => 
    t.users?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">Manajemen Testimoni</h1>
          <p className="text-text-muted">Kelola ulasan pengguna dan pilih yang akan ditampilkan di halaman depan.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-border-color mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama pengguna atau isi ulasan..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border-color rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary text-text-main transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-muted">
          <Loader2 className="animate-spin inline-block mr-2" size={32} /> Memuat testimoni...
        </div>
      ) : filteredTestimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTestimonials.map((testimonial) => {
            const parts = testimonial.text.split('|||IMAGE|||');
            const cleanText = parts[0];
            const imageUrl = parts.length > 1 ? parts[1] : null;

            return (
            <div key={testimonial.id} className="glass-card rounded-2xl p-6 border border-border-color animate-fade-in flex flex-col">
              <div className="flex justify-between items-start mb-4 gap-4">
                <div>
                  <h3 className="font-bold text-lg">{testimonial.users?.name || 'Anonim'}</h3>
                  <p className="text-sm text-text-muted">Motor: {testimonial.bookings?.motors?.name || 'Motor'}</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-sm font-bold shrink-0">
                  <Star size={16} className="fill-yellow-500" /> {testimonial.rating}
                </div>
              </div>

              {imageUrl && (
                <div className="mb-4 w-full h-40 rounded-xl overflow-hidden bg-black/10 border border-border-color">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Testimoni" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="bg-surface/50 rounded-xl p-4 mb-6 flex-1 border border-border-color italic text-text-muted">
                "{cleanText}"
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border-color mt-auto">
                <div className="text-sm text-text-muted">
                  {new Date(testimonial.created_at).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}
                </div>
                <button
                  onClick={() => toggleFeatured(testimonial.id, testimonial.is_featured)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${
                    testimonial.is_featured 
                      ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                      : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                  }`}
                >
                  {testimonial.is_featured ? (
                    <><XCircle size={16} /> Sembunyikan</>
                  ) : (
                    <><CheckCircle size={16} /> Approve & Tampilkan</>
                  )}
                </button>
              </div>
            </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-text-muted glass-card rounded-2xl border border-border-color">
          Belum ada testimoni yang ditemukan.
        </div>
      )}
    </div>
  );
}
