import './App.css';
import Home from './components/pages/Home';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './lib/supabase';

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Home />
    </SessionContextProvider>
  );
}

export default App;
