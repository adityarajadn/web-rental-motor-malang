import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  console.error("Loaded env keys containing SUPABASE:", Object.keys(process.env).filter(k => k.includes('SUPABASE')));
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables. Make sure .env.local is loaded.");
}

export const supabase = createClient(supabaseUrl, supabaseKey || '');
