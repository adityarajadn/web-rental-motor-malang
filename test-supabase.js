import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      booking_code,
      start_date,
      end_date,
      status,
      users ( name, phone ),
      motors ( id, name ),
      payments ( proof_image_url ),
      handovers ( type, condition_notes )
    `)
    .order('created_at', { ascending: false });

  console.log('Error:', error);
  if (data) {
    console.log('Data count:', data.length);
  }
}

testFetch();
