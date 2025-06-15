
// Defensive supabase client bootstrap/logger for troubleshooting
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase config missing! VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set.');
}

let supabase: ReturnType<typeof createClient> | null = null;

try {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  // Log basic info
  console.info('Supabase client initialized in src/integrations/supabase/client.ts');
} catch (err) {
  // Log error, but don't throw to prevent blank screen
  console.error('Error initializing Supabase:', err);
}

export { supabase };
