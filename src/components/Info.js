
import Menu from "./Menu";
import Spotify from './Spotify';
import PageRoutes from "./PageRoutes";
const Info = () => {


    return (
        <div id="info" className="glass card-outer">
            <Menu />
            <Spotify />
            <div id="info-main" className="card-inner">
                <PageRoutes />
            </div>
        </div>
    );
}

export default Info;