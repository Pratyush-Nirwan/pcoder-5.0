import '../../App.css';
import MeshGradient from '../MeshGradient';
import Menu from '../Menu';
import { useState } from 'react';
import { FaCompactDisc } from "react-icons/fa";
import { IoPinSharp } from "react-icons/io5";
function Home() {
    const [selectedPage, setSelectedPage] = useState('home');

    return (
        <>
            <div id='main-body'>
                <div
                    id='bg-main'
                    className={selectedPage}
                >
                    <div id="left-part" className={selectedPage}></div>
                    <div id="right-part" className={selectedPage}>
                        <MeshGradient id="gradient-right" seed={1} frequency={[0.0001, 0.0005]} />
                    </div>
                </div>
                <div id='home-text'>
                    <p id='top-text' className={selectedPage}>DEVELOPER + DESIGNER</p>
                    <h1 className={"reveal-text " + selectedPage} id='main-text'>Hello World! <br />
                        I am Pratyush Nirwan
                    </h1>
                    <h1 className={"page-num " + selectedPage} id='home-num'>00</h1>
                    <h1 className={"lang " + selectedPage}>

                        <div>
                            en-IN
                        </div>
                        <div>
                            ENGLISH
                        </div>
                        <div>
                            hi-IN
                        </div>
                        <div>
                            HINDI
                        </div>
                        <div>
                            mr-IN
                        </div>

                        <div>
                            MARATHI
                        </div>
                    </h1>
                    <div
                        id='circle'
                        className={selectedPage}
                    >
                        <MeshGradient id="gradient-circle" seed={2} frequency={[0.0001, 0.000]} />
                        <FaCompactDisc id='disc' size={100} />
                        <IoPinSharp id='pin' size={70} />
                    </div>
                </div>
            </div>
            <Menu setSelectedPage={setSelectedPage} selectedPage={selectedPage} />
        </>
    );
}

export default Home;
