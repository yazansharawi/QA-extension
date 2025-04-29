import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your environment variables.');
  throw new Error('Missing Supabase credentials. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
