import { MdDesignServices } from "react-icons/md";
import { LiaDrawPolygonSolid } from "react-icons/lia";
import { AiFillCode, AiFillVideoCamera } from "react-icons/ai";
import { FaCircle, FaRegCircle } from "react-icons/fa";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { setCookie } from "../utils/cookieUtils";

const About = () => {
    setCookie("page", "about");
    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <meta name="title" content="Pratyush Nirwan" />
                    <meta name="description"
                        content="Get to know the person behind this website - delve into Pratyush's background, interests, and passions." />
                </Helmet>
            </HelmetProvider>
            <div className="page-title-div">
                <h1 className="title page-title">About</h1>
                <hr />
            </div>
            <div className="page-info">
                <div className="info-text">
                    <p className="text">Addicted to music, coding, games, and motorcycling. I like to learn things by hands on experience and try to tell the same to everyone too. Currently pursuing B.tech in Computer Technology at Yeshwantrao Chavhan college of Engineering, Nagpur. <br /> Have something in mind? Hit me up I would love to work together! <br /> Radhe Radhe ♥</p>
                </div>

                <div className="info-grid">
                    <div className=" card-inner info-grid-item">
                        <MdDesignServices size={50} color="ff6600" className="info-icon" />
                        <div>
                            <h3 className="title">Web Design</h3>
                            <h5 className="text">Beautiful websites keep people engaged.</h5>
                        </div>
                    </div>
                    <div className="card-inner info-grid-item">
                        <AiFillCode size={50} color="ff6600" className="info-icon" />
                        <div>
                            <h3 className="title">Front-End Development</h3>
                            <h5 className="text">Highly quailty and fast websites!</h5>
                        </div>
                    </div>
                    <div className=" card-inner info-grid-item">
                        <LiaDrawPolygonSolid size={50} color="ff6600" className="info-icon" />
                        <div>
                            <h3 className="title">Graphics Design</h3>
                            <h5 className="text">I make unique graphics for each project.</h5>
                        </div>
                    </div>
                    <div className=" card-inner info-grid-item">
                        <AiFillVideoCamera size={50} color="ff6600" className="info-icon" />
                        <div>
                            <h3 className="title">Video Editing</h3>
                            <h5 className="text">The best way to present something!</h5>
                        </div>
                    </div>
                </div>

                <div id="roadmap">
                    <div className="milestone" >
                        <FaCircle className="roadmap-dot" />
                        <div className="rightSide">
                            <h2 className="title roadmap-year">2021</h2>
                            <h3 className="title">Started Studying in college</h3>
                            <h6 className="text ls-1">Btech in Computer Technology <br />Yeshwantrao Chavan College of Engineering,<br />Nagpur 441110</h6>
                        </div>
                    </div>
                    <hr className="normal-hr" />
                    <div className="milestone">
                        <FaCircle id="latest-circle" className="roadmap-dot" />
                        <FaRegCircle id="latest" />
                        <div className="leftSide">
                            <h2 className="title roadmap-year">2024</h2>
                            <h3 className="title">Started Freelancing</h3>
                            <h6 className="text ls-1">Front-End developer</h6>
                        </div>
                    </div>
                    <hr className="fading-hr" />

                </div>
            </div>
        </>
    )
}

export default About;