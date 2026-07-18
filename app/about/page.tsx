import Link from "next/link";
import { Target, Users, Heart, Shield, MapPin, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full py-32 flex items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-200"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold mb-6 tracking-tight">
            Tentang <span className="text-gradient">MotoRent</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto font-light leading-relaxed">
            Mitra perjalanan terpercaya Anda untuk mengeksplorasi keindahan kota
            Malang. Kami hadir untuk memberikan kebebasan dan kenyamanan di
            setiap perjalanan Anda.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full max-w-7xl mx-auto px-4 -mt-10 relative z-20 mb-24">
        <div className="glass-card rounded-3xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border-color">
          <div className="py-4 md:py-0">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
              5+
            </div>
            <div className="text-sm text-text-muted font-medium uppercase tracking-wider">
              Tahun Pengalaman
            </div>
          </div>
          <div className="py-4 md:py-0">
            <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">
              10k+
            </div>
            <div className="text-sm text-text-muted font-medium uppercase tracking-wider">
              Pelanggan Puas
            </div>
          </div>
          <div className="py-4 md:py-0">
            <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
              50+
            </div>
            <div className="text-sm text-text-muted font-medium uppercase tracking-wider">
              Armada Motor
            </div>
          </div>
          <div className="py-4 md:py-0">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
              24/7
            </div>
            <div className="text-sm text-text-muted font-medium uppercase tracking-wider">
              Dukungan Pelanggan
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="w-full max-w-7xl mx-auto px-4 py-12 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=1000&auto=format&fit=crop"
              alt="Riding in Malang"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Misi Kami
            </h2>
            <p className="text-text-muted text-lg leading-relaxed mb-8">
              Di MotoRent Malang, misi kami sederhana: memberikan pengalaman
              penyewaan motor yang mulus, aman, dan tanpa hambatan. Kami percaya
              bahwa setiap orang berhak menikmati keindahan Malang dengan cara
              yang paling fleksibel dan terjangkau.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-1">
                  <Target size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">
                    Kualitas Armada Prioritas
                  </h4>
                  <p className="text-text-muted">
                    Setiap armada kami dirawat dengan standar dealer resmi
                    secara berkala demi menjamin keamanan Anda di jalan.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center shrink-0 mt-1">
                  <Heart size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">
                    Pelayanan Sepenuh Hati
                  </h4>
                  <p className="text-text-muted">
                    Tim kami berdedikasi untuk memberikan dukungan penuh selama
                    masa sewa, memastikan Anda bebas dari rasa khawatir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full max-w-5xl mx-auto px-4 mb-32">
        <div className="bg-surface border border-border-color rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]"></div>

          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 relative z-10">
            Siap Mulai Petualangan Anda?
          </h2>
          <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto relative z-10">
            Pesan motor Anda hari ini dan rasakan kemudahan mengeksplorasi kota
            Malang bersama MotoRent.
          </p>
          <div className="flex justify-center relative z-10">
            <Link
              href="/fleet"
              className="btn-primary px-8 py-4 rounded-xl text-lg font-bold flex items-center gap-2"
            >
              Lihat Armada Kami <Zap size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
