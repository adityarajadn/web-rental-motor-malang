export type Motor = {
  id: string;
  name: string;
  type: string;
  pricePerDay: number;
  image: string;
  location: string;
  available: boolean;
  specs: {
    cc: number;
    year: number;
    transmission: string;
  };
};

export const motors: Motor[] = [
  {
    id: 'm1',
    name: 'Honda Vario 160',
    type: 'Matic',
    pricePerDay: 85000,
    image: 'https://images.unsplash.com/photo-1621252171501-831fa8c0287a?auto=format&fit=crop&q=80&w=800',
    location: 'Cabang Suhat',
    available: true,
    specs: { cc: 160, year: 2023, transmission: 'Automatic' }
  },
  {
    id: 'm2',
    name: 'Yamaha NMAX 155',
    type: 'Matic',
    pricePerDay: 110000,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
    location: 'Cabang Stasiun',
    available: true,
    specs: { cc: 155, year: 2022, transmission: 'Automatic' }
  },
  {
    id: 'm3',
    name: 'Honda Beat Street',
    type: 'Matic',
    pricePerDay: 70000,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
    location: 'Cabang Suhat',
    available: false,
    specs: { cc: 110, year: 2022, transmission: 'Automatic' }
  },
  {
    id: 'm4',
    name: 'Kawasaki Ninja 250',
    type: 'Sport',
    pricePerDay: 250000,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
    location: 'Cabang Stasiun',
    available: true,
    specs: { cc: 250, year: 2021, transmission: 'Manual' }
  },
  {
    id: 'm5',
    name: 'Vespa Sprint 150',
    type: 'Classic',
    pricePerDay: 150000,
    image: 'https://images.unsplash.com/photo-1616428612140-5e36f4520ee0?auto=format&fit=crop&q=80&w=800',
    location: 'Cabang Suhat',
    available: true,
    specs: { cc: 150, year: 2023, transmission: 'Automatic' }
  },
];
