import { supabase } from '@/lib/supabase';
import { Star } from 'lucide-react';

export const revalidate = 0;

// Removed DUMMY_PHOTOS and fallbackTestimonials as requested

export default async function TestimonialsPage() {
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('id, text, rating, users(name)')
    .eq('is_featured', true);

  const testimonialsList = testimonials || [];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4 tracking-tight">
          Cerita <span className="text-primary">Perjalanan</span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          Lihat keseruan dan pengalaman tak terlupakan pelanggan kami saat menjelajahi Malang dengan armada MotoRent.
        </p>
      </div>

      {testimonialsList.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonialsList.map((testi: any, i: number) => {
            const parts = testi.text.split('|||IMAGE|||');
            const cleanText = parts[0];
            const customPhoto = parts.length > 1 ? parts[1] : null;

          const username = Array.isArray(testi.users) ? testi.users[0]?.name : testi.users?.name;
          
          return (
            <div key={testi.id} className="relative group rounded-3xl overflow-hidden break-inside-avoid shadow-lg bg-surface min-h-[250px]">
              {customPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={customPhoto} 
                  alt={`Testimonial dari ${username || 'Pelanggan'}`} 
                  className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-100 flex flex-col justify-end p-6">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < testi.rating ? "fill-accent text-accent" : "fill-white/30 text-white/30"} 
                      />
                    ))}
                  </div>
                  <p className="text-white text-lg font-medium leading-snug mb-3">&quot;{cleanText}&quot;</p>
                  <p className="text-white/70 text-sm font-bold">— {username || 'Pengguna'}</p>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-3xl border border-border-color w-full col-span-full">
          <h2 className="text-2xl font-bold mb-2">Belum ada cerita perjalanan</h2>
          <p className="text-text-muted">Jadilah yang pertama membagikan pengalaman seru Anda bersama MotoRent!</p>
        </div>
      )}
    </div>
  );
}
