import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProjectsAll from "../components/ProjectsAll";
import ProjectsPersonal from "../components/ProjectPersonal";
import ProjectsFreelance from "../components/ProjectsFreelance";
import Rewind from "../components/Rewind";
import { FaClockRotateLeft } from "react-icons/fa6";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { setCookie } from "../utils/cookieUtils";

const Projects = () => {

    setCookie("page", "projects");

    const location = useLocation();
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState('all');

    useEffect(() => {
        const path = location.pathname.split('/').pop(); // Get the last part of the URL
        if (['all', 'personal', 'freelance', 'rewind'].includes(path)) {
            setSelectedItem(path);
        } else {
            navigate('/projects/all'); // Default to 'all' if the path is not recognized
        }
    }, [location.pathname, navigate]);

    const handleClick = (item) => {
        setSelectedItem(item);
        navigate(`/projects/${item}`);
    };

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <meta name="title" content="Pratyush Nirwan" />
                    <meta name="description"
                        content="Discover a showcase of Pratyush's diverse and innovative projects, spanning personal endeavors to professional achievements." />
                </Helmet>
            </HelmetProvider>
            <div className="page-title-div">
                <h1 className="title page-title">Projects</h1>
                <hr />
            </div>
            <div className="page-info">
                <div className="info-text">
                    <div id="project-cat-div">
                        <h3 className={selectedItem === 'all' ? 'text selected' : 'text'} onClick={() => handleClick('all')}>All</h3>
                        <h3 className={selectedItem === 'personal' ? 'text selected' : 'text'} onClick={() => handleClick('personal')}>Personal</h3>
                        <h3 className={selectedItem === 'freelance' ? 'text selected' : 'text'} onClick={() => handleClick('freelance')}>Freelance</h3>
                        <hr id="project-btns-hr" />
                        <h3 id="time-machine-btn" className={selectedItem === 'rewind' ? 'text selected' : 'text'} onClick={() => handleClick('rewind')}>Rewind <FaClockRotateLeft id="rewind" /></h3>
                        <hr id="project-btns-hr-mb" />

                    </div>
                    <div id="projects-grid">
                        {selectedItem === 'all' && <ProjectsAll />}
                        {selectedItem === 'personal' && <ProjectsPersonal />}
                        {selectedItem === 'freelance' && <ProjectsFreelance />}
                        {selectedItem === 'rewind' && <Rewind />}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Projects;
