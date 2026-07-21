import { Shield, CheckCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]">
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
          <Shield size={32} />
        </div>
        <h1 className="text-4xl font-heading font-bold mb-4">Syarat & Ketentuan</h1>
        <p className="text-text-muted text-lg">Kebijakan penyewaan motor di MotoRent Malang</p>
      </div>

      <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass-card p-8 rounded-3xl border border-border-color hover:border-primary/50 transition-colors">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><CheckCircle className="text-primary" /> 1. Persyaratan Umum</h2>
          <ul className="space-y-3 text-text-muted list-disc list-inside ml-2">
            <li>Penyewa wajib memiliki KTP asli yang masih berlaku.</li>
            <li>Penyewa wajib memiliki Surat Izin Mengemudi (SIM C) yang masih aktif.</li>
            <li>Usia minimum penyewa adalah 18 tahun.</li>
            <li>Bersedia diambil foto KTP dan foto serah terima saat pengambilan motor.</li>
          </ul>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-border-color hover:border-primary/50 transition-colors">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><CheckCircle className="text-primary" /> 2. Ketentuan Sewa & Pembayaran</h2>
          <ul className="space-y-3 text-text-muted list-disc list-inside ml-2">
            <li>Harga sewa dihitung per hari (24 jam) dan selalu berakhir pada pukul 09:00 WIB.</li>
            <li>Pembayaran dilakukan secara penuh (Lunas) melalui Transfer Bank atau QRIS sebelum konfirmasi admin.</li>
            <li>Deposit (bila ada) akan dikembalikan sepenuhnya setelah motor dikembalikan dalam kondisi baik.</li>
            <li>Pembatalan sewa H-1 akan dikenakan potongan 50%. Pembatalan di hari H tidak mendapatkan refund uang sewa.</li>
          </ul>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-border-color hover:border-primary/50 transition-colors">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><CheckCircle className="text-primary" /> 3. Tanggung Jawab Penyewa</h2>
          <ul className="space-y-3 text-text-muted list-disc list-inside ml-2">
            <li>Motor hanya boleh digunakan di wilayah Malang Raya dan Kota Batu (kecuali ada perjanjian khusus).</li>
            <li>Kerusakan akibat kelalaian penyewa (ban bocor, jatuh, kecelakaan) menjadi tanggung jawab penuh penyewa.</li>
            <li>Apabila motor hilang atau dicuri, penyewa wajib mengganti rugi seharga nilai jual motor tersebut di pasaran.</li>
            <li>Keterlambatan pengembalian motor akan dikenakan <strong className="text-text-main">denda sebesar Rp 2.000 setiap 15 menit</strong>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
