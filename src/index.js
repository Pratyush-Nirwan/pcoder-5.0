import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Route, Routes } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react';
import { V1, V2, V3, V4 } from './components/Versions';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain="dev-qelqekmb8fkbd0wa.us.auth0.com"
        clientId="j8LcNi5hFbxKeqOZWI0Motzy97aWy2Ib"
        authorizationParams={{
          redirect_uri: window.location.origin + "/guestbook"
        }}
      >
        <Routes>
          <Route path="/projects/rewind/v1.0" element={<V1 />} />
          <Route path="/projects/rewind/v2.0" element={<V2 />} />
          <Route path="/projects/rewind/v3.0" element={<V3 />} />
          <Route path="/projects/rewind/v4.0" element={<V4 />} />
        </Routes>
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
