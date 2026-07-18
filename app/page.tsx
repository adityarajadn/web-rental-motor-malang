import Link from "next/link";
import { ArrowRight, MapPin, Calendar, ShieldCheck, Zap } from "lucide-react";
import TestimonialStack from "@/components/TestimonialStack";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function Home() {
  const { data: featuredMotors } = await supabase
    .from('motors')
    .select('*')
    .eq('status', 'available')
    .limit(3);

  const { data: testimonialsData } = await supabase
    .from('testimonials')
    .select('id, text, rating, users(name)')
    .eq('is_featured', true);

  const motorsList = featuredMotors || [];
  const testisOnPage = testimonialsData || [];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-200"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 tracking-tight">
            Jelajahi Malang Tanpa Batas <br />
            dengan <span className="text-gradient">MotoRent</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-muted mb-10 max-w-2xl mx-auto font-light">
            Platform penyewaan motor tercepat, aman, dan terpercaya. Pilihan
            armada lengkap dengan harga terbaik di kota Malang.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/fleet"
              className="btn-primary px-8 py-4 rounded-full text-lg font-semibold flex items-center justify-center gap-2 group"
            >
              Sewa Sekarang
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="btn-secondary px-8 py-4 rounded-full text-lg font-semibold flex items-center justify-center"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Search Widget */}
      <section className="w-full max-w-5xl mx-auto px-4 -mt-20 relative z-20">
        <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full">
            <label className="text-sm text-text-muted mb-2 block font-medium">
              Lokasi Pengambilan
            </label>
            <div className="flex items-center bg-surface-hover rounded-xl px-4 py-3 border border-border-color">
              <MapPin className="text-primary mr-3" size={20} />
              <select className="bg-transparent border-none text-text-main w-full focus:outline-none appearance-none">
                <option value="suhat">Cabang Suhat</option>
                <option value="stasiun">Cabang Stasiun Malang</option>
                <option value="bandara">Bandara Abdul Rachman Saleh</option>
              </select>
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="text-sm text-text-muted mb-2 block font-medium">
              Tanggal Mulai
            </label>
            <div className="flex items-center bg-surface-hover rounded-xl px-4 py-3 border border-border-color">
              <Calendar className="text-primary mr-3" size={20} />
              <input
                type="date"
                className="bg-transparent border-none text-text-main w-full focus:outline-none"
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>
          <div className="w-full md:w-auto mt-6 md:mt-7">
            <Link
              href="/fleet"
              className="btn-primary w-full px-8 py-3.5 rounded-xl text-md font-semibold flex items-center justify-center"
            >
              Cari Motor
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Fleet */}
      <section className="w-full max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            Armada Pilihan <span className="text-primary">Kami</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Motor terawat, bersih, dan siap menemani perjalanan Anda di Malang
            dan sekitarnya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {motorsList.map((motor) => (
            <div
              key={motor.id}
              className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={motor.image_url}
                  alt={motor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold border border-white/10">
                  {motor.type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold font-heading mb-2">
                  {motor.name}
                </h3>
                <div className="flex items-center gap-4 text-text-muted text-sm mb-6">
                  <span>{motor.cc}cc</span>
                  <span>•</span>
                  <span>{motor.transmission}</span>
                  <span>•</span>
                  <span>{motor.year}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      Rp {Number(motor.price_per_day).toLocaleString("id-ID")}
                    </span>
                    <span className="text-text-muted text-sm">/hari</span>
                  </div>
                  <Link
                    href={`/fleet/${motor.id}`}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-lg font-medium transition-colors text-white"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/fleet"
            className="text-primary hover:text-primary-dark font-semibold inline-flex items-center gap-2"
          >
            Lihat Semua Armada <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* About Us Preview */}
      <section className="w-full max-w-7xl mx-auto px-4 py-24 border-t border-border-color">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
              Tentang <span className="text-primary">MotoRent</span>
            </h2>
            <p className="text-text-muted text-lg leading-relaxed mb-8">
              Lebih dari 5 tahun kami telah melayani ribuan wisatawan dan
              mahasiswa di Malang. Komitmen kami adalah menyediakan transportasi
              roda dua yang aman, nyaman, dan terjangkau untuk setiap
              petualangan Anda.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-3xl font-bold text-secondary mb-1">
                  10k+
                </div>
                <div className="text-sm text-text-muted font-medium">
                  Pelanggan Puas
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-1">50+</div>
                <div className="text-sm text-text-muted font-medium">
                  Unit Motor
                </div>
              </div>
            </div>
            <Link
              href="/about"
              className="text-primary hover:text-primary-dark font-semibold inline-flex items-center gap-2"
            >
              Lebih Lanjut Tentang Kami <ArrowRight size={18} />
            </Link>
          </div>
          <TestimonialStack initialTestimonials={testisOnPage} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full bg-surface py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
              Kenapa Memilih <span className="text-gradient">Kami?</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-background border border-border-color hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Proses Cepat & Mudah</h3>
              <p className="text-text-muted">
                Booking online dalam hitungan menit. Tanpa ribet, motor langsung
                siap digunakan.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-background border border-border-color hover:border-secondary/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center mb-6 text-secondary group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Aman & Terpercaya</h3>
              <p className="text-text-muted">
                Motor terawat dengan servis rutin, dilengkapi asuransi dan helm
                berkualitas standar SNI.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-background border border-border-color hover:border-accent/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
                <MapPin size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Layanan Antar Jemput</h3>
              <p className="text-text-muted">
                Kami siap mengantar dan menjemput motor di stasiun, terminal,
                atau hotel Anda di Malang.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
