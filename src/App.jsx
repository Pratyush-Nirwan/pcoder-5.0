import './App.css';
import Home from './components/pages/Home';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './lib/supabase';

function App() {
  return (
    <SessionContextProvider 
      supabaseClient={supabase}
      initialSession={null}
      options={{
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        debug: true
      }}
    >
      <Home />
    </SessionContextProvider>
  );
}

export default App;
