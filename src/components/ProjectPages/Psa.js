import React, { useState, useEffect } from "react";
import photo from '../../assets/project_thumbnails/pristineSpokenEnglish.png';
import data from '../../assets/data/projects.json'
const Psa = () => {

    function href(url) {
        window.open(url, "_blank");
    }
    const project = data.projects.find(project => project.name === "Pritstine Spoken English Academy Website");

    const projectTags = project.tags;
    return (
        <>
            <div className="page-title-div">
                <h1 className="title page-title">Projects <span className="project-title-head text">/psea</span></h1>
                <hr />
            </div>
            <div className="page-info">
                <div className="info-text">
                    <div className="project-info">
                        <img src={photo} alt="" className="project-info-photo" />
                        <div className="project-info-text">
                            <h2 className="title">Pritstine Spoken English Academy Website</h2>
                            <div className="tag-button-div">
                                <p className="text">
                                    {projectTags.map((tag, index) => (
                                        <span key={index} className="tag">#{tag.replace(/ /g, "-").toLowerCase()}</span>
                                    ))}
                                </p>
                                <div className="text">

                                    <p onClick={() => { href(project.demo_link) }}>Live</p>
                                </div>
                            </div>
                            <hr />
                            <h4 className="text">Developed a dynamic and user-friendly website for Pristine Spoken English Academy alongside Kaustubh Tembhe and Dipanshu Mude. The site details courses in spoken English, offering interactive features, flexible learning options, and a clean, modern design to enhance user engagement and accessibility.</h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Psa;