import { createClient } from '@supabase/supabase-js';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true,
    storageKey: 'sb-auth-token',
    storage: isBrowser ? window.localStorage : undefined,
    // OAuth settings
    auth: {
      autoConfirmEmail: true,
      emailRedirectTo: window.location.origin + '/guestbook',
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'pcoder-guestbook/1.0.0'
    }
  }
});

// Log auth state changes for debugging
if (isBrowser) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Supabase auth state changed:', event, session);
  });
}

// Export auth functions for easier access
export const signInWithGitHub = async () => {
  if (!isBrowser) return { error: { message: 'Not in browser environment' } };
  
  console.log('Initiating GitHub OAuth with redirect to:', window.location.origin + '/guestbook');
  
  return await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: window.location.origin + '/guestbook',
      scopes: 'read:user',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
};

export const signOut = async () => {
  if (!isBrowser) return { error: { message: 'Not in browser environment' } };
  
  return await supabase.auth.signOut();
};

// Helper function to get the current session
export const getSession = async () => {
  if (!isBrowser) return { data: { session: null }, error: null };
  
  const { data, error } = await supabase.auth.getSession();
  console.log('Current session:', data?.session);
  return { data, error };
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  if (!isBrowser) return { data: { user: null }, error: null };
  
  const { data, error } = await supabase.auth.getUser();
  console.log('Current user:', data?.user);
  return { data, error };
};
