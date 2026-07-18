'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Camera, UploadCloud, CheckCircle, CreditCard, Wallet, ShieldCheck, ChevronRight, QrCode, Clock, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function CheckoutForm() {
  const searchParams = useSearchParams();
  const motorId = searchParams.get('motor_id');
  const startDateStr = searchParams.get('start_date');
  const endDateStr = searchParams.get('end_date');
  const location = searchParams.get('location');

  const [motor, setMotor] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingCode, setBookingCode] = useState('MR-00000');

  const [step, setStep] = useState(1);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  
  const [paymentSettings, setPaymentSettings] = useState({
    bankName: 'BCA',
    accountNumber: '1234 5678 9012',
    accountName: 'Rental Motor Malang',
    qrisImage: ''
  });

  useEffect(() => {
    async function fetchData() {
      // Fetch settings
      const { data: settingsData } = await supabase.from('settings').select('*');
      if (settingsData) {
        const newSettings = { ...paymentSettings };
        settingsData.forEach(item => {
          if (item.key === 'bank_name') newSettings.bankName = item.value;
          if (item.key === 'bank_account_number') newSettings.accountNumber = item.value;
          if (item.key === 'bank_account_name') newSettings.accountName = item.value;
          if (item.key === 'qris_image_url') newSettings.qrisImage = item.value;
        });
        setPaymentSettings(newSettings);
      }

      // Fetch motor
      if (motorId) {
        const { data: motorData } = await supabase.from('motors').select('*').eq('id', motorId).single();
        if (motorData) setMotor(motorData);
      }
      setLoadingData(false);
    }
    fetchData();
  }, [motorId]);

  if (loadingData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Loader2 className="animate-spin inline-block mx-auto mb-4 text-text-muted" size={48} />
        <p className="text-text-muted text-lg">Memuat rincian pesanan...</p>
      </div>
    );
  }

  const pricePerDay = motor ? Number(motor.price_per_day) : 0;
  
  let days = 1;
  if (startDateStr && endDateStr) {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    days = diffDays > 0 ? diffDays : 1; // Minimum 1 day
  }
  
  const subtotal = pricePerDay * days;
  const serviceFee = location && location.includes('Stasiun') ? 10000 : location && location.includes('Hotel') ? 25000 : 0;
  const total = subtotal + serviceFee;

  const submitBooking = async () => {
    const sessionData = localStorage.getItem('user_session');
    if (!sessionData) {
      alert('Sesi Anda telah berakhir. Silakan login kembali untuk melanjutkan booking.');
      window.location.href = '/auth';
      return;
    }
    
    if (!proofFile) {
      alert('Harap unggah bukti pembayaran terlebih dahulu!');
      return;
    }

    setSubmitting(true);
    const user = JSON.parse(sessionData);
    const newBookingCode = 'MR-' + Math.floor(10000 + Math.random() * 90000);
    setBookingCode(newBookingCode);

    // Upsert verification data for the user so Admin can see it
    await supabase.from('user_verifications').upsert({
      user_id: user.id,
      identity_type: 'KTP',
      identity_number: '3573000000000000', // Mock KTP number since it's not in the form
      identity_image_url: ktpFile?.name || 'demo_ktp.jpg',
      selfie_image_url: selfieFile?.name || 'demo_selfie.jpg',
      status: 'pending'
    }, { onConflict: 'user_id' });

    const { error: bookingError } = await supabase.from('bookings').insert({
      booking_code: newBookingCode,
      user_id: user.id,
      motor_id: motor.id,
      start_date: startDateStr,
      end_date: endDateStr,
      pickup_location: location || 'Cabang Malang',
      dropoff_location: location || 'Cabang Malang',
      total_days: days,
      total_price: total,
      status: 'awaiting_verification'
    });

    setSubmitting(false);

    if (bookingError) {
      alert('Gagal membuat booking: ' + bookingError.message);
    } else {
      setStep(3);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface -z-10 rounded-full"></div>
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
        
        <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-text-muted'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-surface text-text-muted border border-border-color'}`}>1</div>
          <span className="text-sm font-medium hidden sm:block">Verifikasi Data</span>
        </div>
        <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-text-muted'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-surface text-text-muted border border-border-color'}`}>2</div>
          <span className="text-sm font-medium hidden sm:block">Pembayaran</span>
        </div>
        <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-accent' : 'text-text-muted'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-accent text-white' : 'bg-surface text-text-muted border border-border-color'}`}>3</div>
          <span className="text-sm font-medium hidden sm:block">Selesai</span>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-10 animate-fade-in">
        {step === 1 && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-heading font-bold mb-2">Lengkapi Data & Verifikasi</h2>
              <p className="text-text-muted">Sesuai standar keamanan, mohon unggah dokumen identitas Anda.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <label className="border-2 border-dashed border-border-color hover:border-primary transition-colors rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-surface/50 group">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud size={32} />
                </div>
                <h3 className="font-bold mb-2">Foto KTP</h3>
                <p className="text-sm text-text-muted mb-4">Unggah foto KTP asli yang jelas dan terbaca.</p>
                {ktpFile && (
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                    <CheckCircle size={16} /> {ktpFile.name}
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setKtpFile(e.target.files[0]);
                    }
                  }}
                />
              </label>

              <label className="border-2 border-dashed border-border-color hover:border-primary transition-colors rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-surface/50 group">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <Camera size={32} />
                </div>
                <h3 className="font-bold mb-2">Foto Selfie dengan KTP</h3>
                <p className="text-sm text-text-muted mb-4">Pastikan wajah dan KTP terlihat jelas dalam satu frame.</p>
                {selfieFile && (
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                    <CheckCircle size={16} /> {selfieFile.name}
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setSelfieFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-4 mb-8">
              <ShieldCheck className="text-primary shrink-0" size={24} />
              <p className="text-sm text-text-muted">Data Anda dilindungi dengan enkripsi end-to-end dan hanya digunakan untuk keperluan verifikasi penyewaan motor.</p>
            </div>

            <button 
              onClick={() => {
                if (!ktpFile || !selfieFile) {
                  alert("Harap unggah Foto KTP dan Foto Selfie dengan KTP terlebih dahulu untuk keperluan verifikasi.");
                  return;
                }
                setStep(2);
              }} 
              className="btn-primary w-full py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2"
            >
              Proses Verifikasi Otomatis <ChevronRight />
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-heading font-bold mb-2">Konfirmasi & Pembayaran</h2>
              <p className="text-text-muted">Silakan periksa detail pesanan Anda dan pilih metode pembayaran.</p>
            </div>

            <div className="bg-surface border border-border-color rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">Ringkasan Pesanan</h3>
              <div className="space-y-3 mb-6 pb-6 border-b border-border-color">
                <div className="flex justify-between">
                  <span className="text-text-muted">{motor ? motor.name : 'Motor'} ({days} Hari)</span>
                  <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Biaya Layanan</span>
                  <span className="font-medium">Rp {serviceFee.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total Pembayaran</span>
                <span className="font-bold text-2xl text-primary">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <h3 className="font-bold text-lg mb-4">Metode Pembayaran</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <label 
                className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-colors ${paymentMethod === 'bank' ? 'border-primary bg-primary/5' : 'border-border-color hover:border-primary/50'}`}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={() => setPaymentMethod('bank')}
                  className="accent-primary w-5 h-5" 
                />
                <Wallet className={paymentMethod === 'bank' ? 'text-primary' : 'text-text-muted'} />
                <span className="font-medium">Transfer Bank / Virtual Account</span>
              </label>
              
              <label 
                className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-colors ${paymentMethod === 'qris' ? 'border-primary bg-primary/5' : 'border-border-color hover:border-primary/50'}`}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  value="qris"
                  checked={paymentMethod === 'qris'}
                  onChange={() => setPaymentMethod('qris')}
                  className="accent-primary w-5 h-5" 
                />
                <QrCode className={paymentMethod === 'qris' ? 'text-primary' : 'text-text-muted'} />
                <span className="font-medium">QRIS</span>
              </label>
            </div>

            <div className="bg-surface border border-border-color rounded-2xl p-6 mb-8 animate-fade-in">
              {paymentMethod === 'bank' ? (
                <div>
                  <h4 className="font-bold text-lg mb-2">Informasi Transfer Bank</h4>
                  <p className="text-sm text-text-muted mb-4">Silakan transfer sesuai nominal ke rekening berikut:</p>
                  <div className="bg-background rounded-xl p-4 border border-border-color">
                    <p className="text-sm text-text-muted mb-1">Bank</p>
                    <p className="font-bold text-lg mb-3">{paymentSettings.bankName}</p>
                    <p className="text-sm text-text-muted mb-1">Nomor Rekening</p>
                    <p className="font-bold text-2xl font-mono text-primary mb-3">{paymentSettings.accountNumber}</p>
                    <p className="text-sm text-text-muted mb-1">Atas Nama</p>
                    <p className="font-medium">{paymentSettings.accountName}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h4 className="font-bold text-lg mb-2">Scan QRIS</h4>
                  <p className="text-sm text-text-muted mb-4">Buka aplikasi e-wallet atau m-banking Anda dan scan QR Code di bawah ini:</p>
                  <div className="bg-white p-4 rounded-xl inline-block border border-border-color mb-2">
                    <img src={paymentSettings.qrisImage} alt="QRIS" className="w-48 h-48 object-contain" />
                  </div>
                  <p className="text-sm text-primary font-medium">{paymentSettings.accountName}</p>
                </div>
              )}
            </div>

            <div className="mb-8">
              <label className="text-sm font-medium mb-2 block">Upload Bukti Pembayaran</label>
              <label className="border-2 border-dashed border-border-color hover:border-primary transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-surface/50 group">
                <Upload size={24} className="mb-2 text-text-muted group-hover:text-primary transition-colors" />
                <p className="text-sm text-text-muted mb-2">Klik untuk mengunggah struk/screenshot pembayaran</p>
                {proofFile && (
                  <span className="text-primary font-medium text-sm flex items-center gap-1">
                    <CheckCircle size={14} /> {proofFile.name}
                  </span>
                )}
                <input 
                  type="file" 
                  accept="image/*,application/pdf" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setProofFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="btn-secondary px-6 py-4 rounded-xl font-bold" disabled={submitting}>
                Kembali
              </button>
              <button 
                onClick={submitBooking}
                disabled={submitting}
                className="btn-primary flex-1 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitting ? <Loader2 className="animate-spin" size={24} /> : 'Kirim Bukti Pembayaran'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && !isApproved && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center text-secondary mx-auto mb-6">
              <Clock size={48} className="animate-pulse" />
            </div>
            <h2 className="text-3xl font-heading font-bold mb-4">Menunggu Verifikasi</h2>
            <p className="text-text-muted mb-8 max-w-md mx-auto">
              Bukti pembayaran Anda berhasil diunggah. Admin kami sedang memverifikasi pembayaran Anda. Mohon tunggu sebentar.
            </p>
            
            <div className="bg-surface border border-border-color rounded-2xl p-6 text-left mb-8 max-w-md mx-auto">
              <div className="flex items-center gap-4 text-text-muted">
                <Clock className="text-secondary" /> <span>Estimasi waktu verifikasi: 5-10 menit</span>
              </div>
            </div>

            {/* Tombol simulasi untuk demo */}
            <div className="mt-12 p-4 border border-dashed border-border-color rounded-xl max-w-md mx-auto bg-surface/50">
              <p className="text-xs text-text-muted mb-2 uppercase tracking-wider font-bold">Untuk Keperluan Demo:</p>
              <button 
                onClick={() => setIsApproved(true)} 
                className="w-full bg-accent/10 text-accent hover:bg-accent/20 py-2 rounded-lg font-bold transition-colors"
              >
                Simulasi: Admin Setujui Pembayaran
              </button>
            </div>
          </div>
        )}

        {step === 3 && isApproved && (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center text-accent mx-auto mb-6">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-heading font-bold mb-4">Pembayaran Berhasil!</h2>
            <p className="text-text-muted mb-8 max-w-md mx-auto">
              Booking Anda telah dikonfirmasi. E-tiket dan instruksi pengambilan telah dikirimkan ke email Anda.
            </p>
            
            <div className="bg-surface border border-border-color rounded-2xl p-6 text-left mb-8 max-w-md mx-auto">
              <p className="text-sm text-text-muted mb-1">Kode Booking</p>
              <p className="text-2xl font-bold font-mono tracking-wider mb-4">{bookingCode}</p>
              
              <p className="text-sm text-text-muted mb-1">Jadwal Pengambilan</p>
              <p className="font-medium mb-1">{startDateStr}</p>
              <p className="text-sm text-primary">{location || 'Cabang Malang'}</p>
            </div>

            <div className="flex justify-center gap-4">
              <Link href="/fleet" className="btn-secondary px-8 py-3 rounded-xl font-medium">
                Kembali ke Beranda
              </Link>
              <Link href="/admin" className="btn-primary px-8 py-3 rounded-xl font-medium">
                Lihat di Admin Panel
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Loader2 className="animate-spin inline-block mx-auto mb-4 text-text-muted" size={48} />
        <p className="text-text-muted text-lg">Memuat halaman pembayaran...</p>
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
