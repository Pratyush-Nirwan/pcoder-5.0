import './App.css';
import Profile from './components/Profile';
import Info from './components/Info';
import { MeshGradientRenderer } from '@johnn-e/react-mesh-gradient';
import V1 from './components/Versions';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
const App = () => {
  const location = useLocation();

  const [showBg, setShowBg] = useState(true);

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (['v1.0', 'v2.0', 'v3.0', 'v4.0'].includes(path)) {
      setShowBg(false);
      console.log('pass')
    } else {
      setShowBg(true);
    }
  }, [location.pathname]);

  return (

    <>
      {showBg === true &&
        <MeshGradientRenderer
          className="gradient"
          colors={[
            "#FF6600",
            "#000000",
            "#000000",
            "#000000",
            "#000000"
          ]}
        />
      }
      <div id="page-body">
        <Profile />
        <Info />
      </div>
    </>
  );

}

export default App;
