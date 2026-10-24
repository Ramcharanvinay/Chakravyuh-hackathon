import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
// Accepts the legacy anon key or the newer publishable key (both are safe to ship to the browser).
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// https for hosted projects; plain http only for a local Supabase on this machine.
const isSecureOrLoopback = /^(https:\/\/|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$))/.test(supabaseUrl);

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && isSecureOrLoopback && !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
