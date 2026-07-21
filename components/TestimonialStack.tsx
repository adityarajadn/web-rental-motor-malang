'use client';
import { useState, useEffect, useCallback } from 'react';

// Removed defaultTestimonials

export default function TestimonialStack({ initialTestimonials = [] }: { initialTestimonials?: any[] }) {
  const startingData = (initialTestimonials || []).map((t, i) => {
    let cleanText = t.text;
    let customImage = null;
    if (t.text && typeof t.text === 'string' && t.text.includes('|||IMAGE|||')) {
      const parts = t.text.split('|||IMAGE|||');
      cleanText = parts[0];
      customImage = parts.length > 1 ? parts[1] : null;
    }
    return {
      ...t,
      text: cleanText,
      image: customImage // if null, we render a gradient below
    };
  });

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

  if (cards.length === 0) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-surface border border-border-color rounded-3xl p-8 text-center">
        <div>
          <p className="text-xl font-bold mb-2">Belum Ada Ulasan</p>
          <p className="text-text-muted">Jadilah yang pertama menyewa dan bagikan pengalaman Anda!</p>
        </div>
      </div>
    );
  }

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
            {card.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={card.image}
                alt={card.users?.name || 'Customer'}
                className="w-full h-full object-cover absolute inset-0"
                draggable="false"
              />
            ) : (
              <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 flex items-end p-6 md:p-8">
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
