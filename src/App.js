import './App.css';
import Profile from './components/Profile';
import Info from './components/Info';
import { MeshGradientRenderer } from '@johnn-e/react-mesh-gradient';
import getPageViews from './components/umamiService';

const App = () => {
  getPageViews();

  return (
    <>
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
      <div id="page-body">
        <Profile />
        <Info />
      </div>
    </>
  );

}

export default App;
