import React from 'react';
import data from '../assets/data/projects.json';
import { AiFillEye } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';



const ProjectsPersonal = () => {
    const navigate = useNavigate();
    const handleClick = (item) => {
        let path = item.replace(/ /g, "-");
        navigate(`/projects/${path.toLowerCase()}`)
    };
    return (
        <>
            {data.projects.map((project, index) => (
                project.category.toLowerCase() === 'personal' && (
                    <div className="project-div" key={index} onClick={() => { handleClick(project.name) }}>
                        <div className="project-img-div">
                            <AiFillEye className='eye' size={50} />
                            <img className='project-img' src={require(`../assets/project_thumbnails/${project.thumbnail}`)} alt={project.name} />
                        </div>
                        <h4 className='title'>{project.name}</h4>
                        <h5 className='text'>{project.category}</h5>
                    </div>
                )
            ))}
        </>
    );
}

export default ProjectsPersonal;
