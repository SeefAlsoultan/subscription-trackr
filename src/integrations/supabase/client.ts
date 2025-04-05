
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log the URL and key being used (only in development)
if (import.meta.env.DEV) {
  console.log('Supabase URL:', SUPABASE_URL);
  console.log('Using Supabase with credentials:', SUPABASE_URL ? 'URL provided' : 'URL missing', 
    SUPABASE_ANON_KEY ? 'Key provided' : 'Key missing');
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

// Get the current site URL
const getSiteUrl = () => {
  // In development, use a fixed URL (not localhost)
  if (import.meta.env.DEV) {
    // If testing locally with a specific port, update this accordingly
    return 'http://localhost:8080';
  }
  
  // In production, use the current site URL
  return window.location.origin;
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL || '',
  SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'supabase.auth.token',
      storage: localStorage,
      flowType: 'pkce', // Recommended for security
      redirectTo: getSiteUrl() + '/dashboard',
    }
  }
);

// Export a function to test connection
export const testSupabaseConnection = async () => {
  try {
    // Simple ping query to check connection
    const { error } = await supabase.from('subscriptions').select('count()', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Supabase connection error:', err);
    return { success: false, error: err.message };
  }
};
