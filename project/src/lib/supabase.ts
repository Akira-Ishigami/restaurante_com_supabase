import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper function to check if we're in demo mode
export const isDemoMode = !supabaseUrl || 
  supabaseUrl === 'your_supabase_project_url' || 
  supabaseUrl === 'https://demo.supabase.co' ||
  !supabaseAnonKey || 
  supabaseAnonKey === 'your_supabase_anon_key' ||
  supabaseAnonKey === 'demo-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Mock API delay for demo purposes
export const mockApiDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));