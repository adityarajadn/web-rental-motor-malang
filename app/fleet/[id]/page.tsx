import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle, Info } from 'lucide-react';
import BookingForm from '@/components/BookingForm';

export default async function MotorDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const { data: motor, error } = await supabase
    .from('motors')
    .select(`
      *,
      bookings(id, start_date, end_date, status)
    `)
    .eq('id', resolvedParams.id)
    .single();
  
  if (error || !motor) {
    notFound();
  }

  const today = new Date();
  today.setHours(0,0,0,0);
  let isRented = false;
  if (motor.bookings) {
    for (const b of motor.bookings) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/fleet" className="text-text-muted hover:text-primary transition-colors inline-flex items-center gap-2">
          &larr; Kembali ke Daftar Armada
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column - Image & Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-3xl overflow-hidden h-[400px] md:h-[500px] relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={motor.image_url} alt={motor.name} className="w-full h-full object-cover" />
            <div className="absolute top-6 right-6 bg-background/80 backdrop-blur px-4 py-2 rounded-full font-semibold border border-white/10">
              {motor.type}
            </div>
            {isRented && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10">
                <span className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-xl shadow-red-500/20">
                  Sedang Disewa
                </span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-heading font-bold mb-4">{motor.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-8">
              <span className="bg-surface px-4 py-2 rounded-lg border border-border-color flex items-center gap-2">
                <Info size={16} className="text-primary"/> {motor.cc} CC
              </span>
              <span className="bg-surface px-4 py-2 rounded-lg border border-border-color flex items-center gap-2">
                <Info size={16} className="text-secondary"/> {motor.transmission}
              </span>
              <span className="bg-surface px-4 py-2 rounded-lg border border-border-color flex items-center gap-2">
                <Info size={16} className="text-accent"/> Tahun {motor.year}
              </span>
            </div>

            <div className="bg-surface border border-border-color rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Fasilitas Termasuk</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="flex items-center gap-3"><CheckCircle className="text-accent" size={20}/> 2 Helm SNI</li>
                <li className="flex items-center gap-3"><CheckCircle className="text-accent" size={20}/> 2 Jas Hujan</li>
                <li className="flex items-center gap-3"><CheckCircle className="text-accent" size={20}/> Masker Motor (Baru)</li>
                <li className="flex items-center gap-3"><CheckCircle className="text-accent" size={20}/> Gembok Pengaman</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div>
          <div className="glass-card rounded-3xl p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 border-b border-border-color pb-4">Booking Sewa</h2>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-primary">Rp {Number(motor.price_per_day).toLocaleString('id-ID')}</span>
              <span className="text-text-muted">/hari</span>
            </div>

            {isRented ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                <h3 className="font-bold text-red-500 mb-1">Tidak Tersedia</h3>
                <p className="text-sm text-text-muted">Motor ini sedang disewa dan tidak dapat di-booking untuk saat ini.</p>
              </div>
            ) : (
              <BookingForm motorId={motor.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
