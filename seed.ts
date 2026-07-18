import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://itjapmjjltwflukqcuty.supabase.co';
const supabaseKey = 'sb_publishable_0BbcIxOlt2OATtiCRC8FkA_k55vPM5f';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding data...');

  // Create an admin user to own testimonials/verifications
  const { data: user, error: userError } = await supabase.from('users').insert({
    name: 'Budi, Wisatawan Jakarta',
    email: 'budi@example.com',
    password_hash: 'dummyhash',
    role: 'customer'
  }).select().single();
  
  const { data: user2 } = await supabase.from('users').insert({
    name: 'Siti, Mahasiswa UM',
    email: 'siti@example.com',
    password_hash: 'dummyhash',
    role: 'customer'
  }).select().single();
  
  const { data: user3 } = await supabase.from('users').insert({
    name: 'Andi, Traveler Bandung',
    email: 'andi@example.com',
    password_hash: 'dummyhash',
    role: 'customer'
  }).select().single();

  if (userError) console.error(userError);

  // Insert motors
  const motors = [
    {
      name: "Honda Vario 160",
      type: "Matic",
      brand: "Honda",
      year: 2023,
      cc: 160,
      transmission: "Automatic",
      license_plate: "N 1234 AB",
      price_per_day: 100000,
      image_url: "https://images.unsplash.com/photo-1621259468943-41bb777cfa90?q=80&w=800&auto=format&fit=crop",
      status: "available"
    },
    {
      name: "Yamaha NMAX",
      type: "Matic",
      brand: "Yamaha",
      year: 2022,
      cc: 155,
      transmission: "Automatic",
      license_plate: "N 5678 CD",
      price_per_day: 150000,
      image_url: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=800&auto=format&fit=crop",
      status: "available"
    },
    {
      name: "Honda Beat",
      type: "Matic",
      brand: "Honda",
      year: 2024,
      cc: 110,
      transmission: "Automatic",
      license_plate: "N 9012 EF",
      price_per_day: 75000,
      image_url: "https://images.unsplash.com/photo-1614165936126-2ed18e471b3b?q=80&w=800&auto=format&fit=crop",
      status: "available"
    }
  ];

  const { data: insertedMotors, error: motorError } = await supabase.from('motors').insert(motors).select();
  if (motorError) console.error(motorError);

  // Insert dummy bookings so we can insert testimonials
  const { data: b1 } = await supabase.from('bookings').insert({
    booking_code: 'MR-001',
    user_id: user.id,
    motor_id: insertedMotors[0].id,
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    pickup_location: 'Suhat',
    dropoff_location: 'Suhat',
    total_days: 1,
    total_price: 100000,
    status: 'completed'
  }).select().single();

  const { data: b2 } = await supabase.from('bookings').insert({
    booking_code: 'MR-002',
    user_id: user2.id,
    motor_id: insertedMotors[1].id,
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    pickup_location: 'Suhat',
    dropoff_location: 'Suhat',
    total_days: 1,
    total_price: 150000,
    status: 'completed'
  }).select().single();

  const { data: b3 } = await supabase.from('bookings').insert({
    booking_code: 'MR-003',
    user_id: user3.id,
    motor_id: insertedMotors[2].id,
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    pickup_location: 'Suhat',
    dropoff_location: 'Suhat',
    total_days: 1,
    total_price: 75000,
    status: 'completed'
  }).select().single();

  // Insert Testimonials
  const testimonials = [
    {
      user_id: user.id,
      booking_id: b1.id,
      rating: 5,
      text: "Pelayanan luar biasa, motor sangat terawat!",
      is_featured: true
    },
    {
      user_id: user2.id,
      booking_id: b2.id,
      rating: 5,
      text: "Sangat mudah dan cepat, proses booking ga ribet sama sekali.",
      is_featured: true
    },
    {
      user_id: user3.id,
      booking_id: b3.id,
      rating: 5,
      text: "Motornya bersih, helm wangi, pokoknya mantap pol!",
      is_featured: true
    }
  ];

  const { error: testiError } = await supabase.from('testimonials').insert(testimonials);
  if (testiError) console.error(testiError);

  console.log('Seeding complete!');
}

seed();
