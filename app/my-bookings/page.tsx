"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Loader2, Calendar, MapPin, Clock, CheckCircle, AlertTriangle, XCircle, Star, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import PenaltyTimer from "@/components/PenaltyTimer";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const [reviewModal, setReviewModal] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchBookings() {
      const sessionData = localStorage.getItem("user_session");
      if (!sessionData) {
        router.push("/auth");
        return;
      }

      const user = JSON.parse(sessionData);

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          motors (name, image_url, license_plate),
          testimonials (id)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setBookings(data);
      }
      setLoading(false);
    }

    fetchBookings();
  }, [router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_payment":
        return <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold"><Clock size={12} /> Menunggu Pembayaran</span>;
      case "awaiting_verification":
        return <span className="flex items-center gap-1 bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full text-xs font-bold"><Clock size={12} /> Menunggu Konfirmasi</span>;
      case "confirmed":
        return <span className="flex items-center gap-1 bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle size={12} /> Disetujui</span>;
      case "active":
        return <span className="flex items-center gap-1 bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-bold"><CheckCircle size={12} /> Sedang Disewa</span>;
      case "completed":
        return <span className="flex items-center gap-1 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold"><CheckCircle size={12} /> Selesai</span>;
      case "cancelled":
        return <span className="flex items-center gap-1 bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-xs font-bold"><XCircle size={12} /> Dibatalkan</span>;
      default:
        return <span className="bg-surface text-text-muted px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModal) return;
    setSubmittingReview(true);
    
    let combinedText = reviewText;
    if (reviewImage) {
      try {
        const base64 = await fileToBase64(reviewImage);
        combinedText = reviewText + '|||IMAGE|||' + base64;
      } catch (err) {
        console.error("Gagal convert foto", err);
      }
    }
    
    const { error } = await supabase.from('testimonials').insert({
      user_id: reviewModal.user_id,
      booking_id: reviewModal.id,
      rating: rating,
      text: combinedText,
      is_featured: false
    });

    setSubmittingReview(false);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === reviewModal.id ? {...b, testimonials: {id: 'new'}} : b));
      setReviewModal(null);
      setRating(5);
      setReviewText("");
      setReviewImage(null);
      alert("Terima kasih atas ulasan Anda!");
    } else {
      alert("Gagal mengirim ulasan: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-text-muted">Memuat data pesanan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-heading font-bold mb-2">Pesanan Saya</h1>
        <p className="text-text-muted">Pantau status penyewaan dan riwayat transaksi Anda di sini.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center text-text-muted mb-4">
            <Calendar size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Belum ada pesanan</h2>
          <p className="text-text-muted mb-6">Anda belum pernah melakukan penyewaan motor. Yuk mulai sewa sekarang!</p>
          <Link href="/fleet" className="btn-primary px-8 py-3 rounded-xl font-bold">
            Lihat Armada
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 border border-border-color animate-fade-in relative overflow-hidden">
              {/* Highlight bar to show status vaguely */}
              <div className={`absolute left-0 top-0 w-1.5 h-full ${
                ['confirmed', 'active', 'completed'].includes(booking.status) ? 'bg-primary' : 
                booking.status === 'cancelled' ? 'bg-red-500' : 'bg-secondary'
              }`}></div>
              
              <div className="w-full md:w-48 h-32 md:h-full shrink-0 bg-surface rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={booking.motors?.image_url} alt={booking.motors?.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold font-heading">{booking.motors?.name}</h3>
                    <p className="text-text-muted text-sm mt-1 font-mono">ID Pesanan: {booking.booking_code}</p>
                  </div>
                  <div>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto mb-4">
                  <div className="bg-surface/50 rounded-lg p-3 border border-border-color">
                    <p className="text-xs text-text-muted mb-1 flex items-center gap-1"><Calendar size={12}/> Mulai</p>
                    <p className="font-semibold text-sm">{new Date(booking.start_date).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})} • 09:00 WIB</p>
                    <p className="text-xs text-text-muted mt-1 flex items-center gap-1 truncate"><MapPin size={12}/> {booking.pickup_location}</p>
                  </div>
                  <div className="bg-surface/50 rounded-lg p-3 border border-border-color">
                    <p className="text-xs text-text-muted mb-1 flex items-center gap-1"><Calendar size={12}/> Selesai</p>
                    <p className="font-semibold text-sm">{new Date(booking.end_date).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})} • 09:00 WIB</p>
                    <p className="text-xs text-text-muted mt-1 flex items-center gap-1 truncate"><MapPin size={12}/> {booking.dropoff_location}</p>
                  </div>
                </div>

                {booking.status === 'active' && (
                  <div className="mb-4">
                    <PenaltyTimer endDateStr={booking.end_date} />
                  </div>
                )}

                <div className="flex justify-between items-end border-t border-border-color pt-4 mt-2">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Total Biaya ({booking.total_days} Hari)</p>
                    <p className="text-lg font-bold text-primary">Rp {Number(booking.total_price).toLocaleString('id-ID')}</p>
                  </div>
                  
                  {booking.status === 'awaiting_verification' && (
                    <span className="text-xs text-secondary animate-pulse">Menunggu konfirmasi admin...</span>
                  )}
                  {booking.status === 'confirmed' && (
                    <span className="text-xs text-green-400">Pesanan disetujui, silakan ambil di lokasi.</span>
                  )}
                  {booking.status === 'completed' && !booking.testimonials && (
                    <button 
                      onClick={() => setReviewModal(booking)}
                      className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                      <Star size={16} className="fill-white" /> Beri Rating
                    </button>
                  )}
                  {booking.status === 'completed' && booking.testimonials && (
                    <span className="text-xs text-text-muted flex items-center gap-1"><CheckCircle size={12}/> Ulasan terkirim</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => setReviewModal(null)}>
          <div className="bg-surface border border-border-color rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-text-muted hover:text-text-main" onClick={() => setReviewModal(null)}>
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-2">Beri Penilaian</h2>
            <p className="text-text-muted mb-6">Bagaimana pengalaman Anda menyewa {reviewModal.motors?.name}?</p>
            
            <form onSubmit={submitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-center">Rating Bintang</label>
                <div className="flex justify-center gap-2">
                  {[1,2,3,4,5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                    >
                      <Star size={36} className={star <= rating ? 'fill-yellow-400' : ''} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ulasan Anda</label>
                <textarea 
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Ceritakan pengalaman menyenangkan Anda..."
                  className="w-full bg-background border border-border-color rounded-xl p-4 text-text-main focus:outline-none focus:border-primary min-h-[120px]"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Foto (Opsional)</label>
                <label className="border-2 border-dashed border-border-color rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-surface transition-colors text-text-muted relative overflow-hidden h-32">
                  {reviewImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={URL.createObjectURL(reviewImage)} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                  ) : (
                    <>
                      <Upload size={24} className="mb-2" />
                      <span className="text-sm">Klik untuk pilih foto pengalaman Anda</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setReviewImage(e.target.files[0]);
                    }
                  }} />
                </label>
              </div>

              <button 
                type="submit" 
                disabled={submittingReview}
                className="w-full btn-primary py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submittingReview ? <Loader2 className="animate-spin" size={20} /> : 'Kirim Ulasan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
