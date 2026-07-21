'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "Apa saja syarat menyewa motor di MotoRent Malang?",
    a: "Anda hanya perlu menyiapkan KTP asli dan SIM C yang masih aktif. Saat pengambilan motor, kami akan melakukan pengecekan dokumen fisik dan mengambil foto serah terima sebagai jaminan."
  },
  {
    q: "Apakah bisa sewa harian, mingguan, atau bulanan?",
    a: "Saat ini kami fokus pada penyewaan harian. Harga yang tertera adalah harga sewa per 24 jam. Jika Anda ingin sewa mingguan atau bulanan, silakan hubungi admin kami via WhatsApp untuk mendapatkan harga khusus."
  },
  {
    q: "Bagaimana jika saya terlambat mengembalikan motor?",
    a: "Kami menerapkan sistem denda otomatis yang transparan. Setiap 15 menit keterlambatan (melewati batas waktu deadline jam 09:00 WIB di hari pengembalian), Anda akan dikenakan denda sebesar Rp 2.000."
  },
  {
    q: "Apa fasilitas yang saya dapatkan saat menyewa?",
    a: "Setiap penyewaan motor sudah termasuk perlengkapan berkendara gratis: 2 buah Helm SNI yang bersih, 2 Jas Hujan, Masker medis, dan Gembok Pengaman tambahan."
  },
  {
    q: "Apakah ada layanan antar jemput motor?",
    a: "Tentu saja! Kami melayani antar jemput motor ke Stasiun Malang Kota Baru, Terminal Arjosari, Bandara Abdul Rachman Saleh, dan berbagai titik strategis atau hotel di Kota Malang. Biaya tambahan antar/jemput mungkin berlaku tergantung jarak."
  },
  {
    q: "Bagaimana cara pembayarannya?",
    a: "Pembayaran 100% dilakukan secara non-tunai melalui sistem kami setelah Anda membuat pesanan. Kami menerima Transfer Bank langsung atau Scan QRIS yang sangat praktis."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 min-h-[75vh]">
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
          <HelpCircle size={32} />
        </div>
        <h1 className="text-4xl font-heading font-bold mb-4">FAQ</h1>
        <p className="text-text-muted text-lg">Pertanyaan yang sering diajukan seputar layanan kami</p>
      </div>

      <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className={`glass-card border border-border-color rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-xl border-primary/30 bg-surface/80' : 'hover:border-primary/20'}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
            >
              <span className={`font-bold text-lg pr-4 transition-colors ${openIndex === index ? 'text-primary' : 'group-hover:text-primary/80'}`}>
                {faq.q}
              </span>
              <ChevronDown 
                className={`text-text-muted shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary' : 'group-hover:text-primary/50'}`} 
                size={24} 
              />
            </button>
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="w-full h-px bg-border-color mb-4"></div>
              <p className="text-text-muted leading-relaxed">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
