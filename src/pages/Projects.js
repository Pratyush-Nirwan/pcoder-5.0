import { useState } from "react";
import ProjectsAll from "../components/ProjectsAll";
import ProjectsPersonal from "../components/ProjectPersonal";
import ProjectsFreelance from "../components/ProjectsFreelance";
const Projects = () => {

    const [selectedItem, setSelectedItem] = useState('all');
    const handleClick = (item) => {
        setSelectedItem(item);
    };
    return (
        <>
            <div className="page-title-div">
                <h1 className="title page-title">Projects</h1>
                <hr />
            </div>
            <div className="page-info">
                <div className="info-text">
                    <div id="project-cat-div">
                        <h3 className={selectedItem === 'all' ? 'text selected' : 'text'} onClick={() => { handleClick('all') }}>All</h3>
                        <h3 className={selectedItem === 'personal' ? 'text selected' : 'text'} onClick={() => { handleClick('personal') }}>Personal</h3>
                        <h3 className={selectedItem === 'freelance' ? 'text selected' : 'text'} onClick={() => { handleClick('freelance') }}>Freelance</h3>
                    </div>
                    <div id="projects-grid">
                        {selectedItem === 'all' && <ProjectsAll />}
                        {selectedItem === 'personal' && <ProjectsPersonal />}
                        {selectedItem === 'freelance' && <ProjectsFreelance />}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Projects