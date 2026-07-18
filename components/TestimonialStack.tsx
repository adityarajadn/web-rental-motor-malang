'use client';
import { useState, useEffect, useCallback } from 'react';

// Fallback mock data if DB is empty
const defaultTestimonials = [
  {
    id: '1',
    text: "Pelayanan luar biasa, motor sangat terawat!",
    users: { name: "Budi, Wisatawan Jakarta" },
    image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: '2',
    text: "Sangat mudah dan cepat, proses booking ga ribet sama sekali.",
    users: { name: "Siti, Mahasiswa UM" },
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: '3',
    text: "Motornya bersih, helm wangi, pokoknya mantap pol!",
    users: { name: "Andi, Traveler Bandung" },
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop"
  }
];

export default function TestimonialStack({ initialTestimonials = [] }: { initialTestimonials?: any[] }) {
  // Use DB data if available and has items, else use default
  const startingData = initialTestimonials.length > 0 ? initialTestimonials.map((t, i) => ({
    ...t,
    image: defaultTestimonials[i % defaultTestimonials.length].image // fallback image since DB doesn't have it
  })) : defaultTestimonials;

  const [cards, setCards] = useState(startingData);
  const [animating, setAnimating] = useState(false);

  const handleNext = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    
    setTimeout(() => {
      setCards((prev) => {
        const newArray = [...prev];
        const first = newArray.shift();
        if (first) newArray.push(first);
        return newArray;
      });
      setAnimating(false);
    }, 500); // 500ms transition
  }, [animating]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000); // auto slide every 4 seconds

    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <div 
      className="relative h-[400px] w-full cursor-pointer select-none group"
      onClick={handleNext}
    >
      {cards.map((card, index) => {
        const isAnimatingOut = animating && index === 0;
        const isNextTop = animating && index === 1;
        const isNextMiddle = animating && index === 2;

        let scale = 1 - index * 0.05;
        let translateY = index * 15;
        let translateX = 0;
        let opacity = 1 - index * 0.2;
        let rotate = 0;
        let zIndex = cards.length - index;

        if (isAnimatingOut) {
          // Slide left and visually push to the back layer
          translateX = -200;
          scale = 0.85;
          rotate = -15;
          opacity = 0.4;
          zIndex = 0; // Force it behind the other cards during animation
        } else if (isNextTop) {
          scale = 1;
          translateY = 0;
          opacity = 1;
        } else if (isNextMiddle) {
          scale = 0.95;
          translateY = 15;
          opacity = 0.8;
        }

        return (
          <div
            key={card.id}
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl transition-all ease-in-out origin-center"
            style={{
              zIndex: zIndex,
              transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
              opacity: opacity,
              transitionDuration: '500ms'
            }}
          >
            <img
              src={card.image}
              alt={card.users?.name || 'Customer'}
              className="w-full h-full object-cover"
              draggable="false"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 md:p-8">
              <div className="glass w-full p-5 rounded-2xl border-white/20 backdrop-blur-md">
                <p className="font-bold text-lg mb-1 text-text-main">
                  "{card.text}"
                </p>
                <p className="text-text-muted text-sm">
                  - {card.users?.name || 'Customer MotoRent'}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
