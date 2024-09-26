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
console.log.apply(console, ["%c Designed and Coded by Pratyush Nirwan ", "color: black; background: #ff6600; padding:5px 0; border-radius: 5px; font-weight: bold",]);
console.log("What are you doing here? Wanna see the code? Go to https://github.com/Pratyush-Nirwan/pcoder-5.0 and may be give me a star while you are there!")
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
