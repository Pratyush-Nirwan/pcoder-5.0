
import Menu from "./Menu";
import Spotify from './Spotify';
import PageRoutes from "./PageRoutes";
import HamburgerBtn from "./HamburgerBtn";
const Info = () => {


    return (
        <div id="info" className="glass card-outer">
            <Menu />
            <Spotify />
            <div id="info-main" className="card-inner">
                <HamburgerBtn />
                <PageRoutes />
            </div>
        </div>
    );
}

export default Info;