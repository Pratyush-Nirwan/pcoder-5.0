import React, { useState, useEffect } from "react";
import photo from '../../assets/project_thumbnails/adviceTicket.png';
import data from '../../assets/data/projects.json'
const AdviceTicket = () => {

    function href(url) {
        window.open(url, "_blank");
    }
    const project = data.projects.find(project => project.name === "Advice Ticket");


    const projectTags = project.tags;
    return (
        <>
            <div className="page-title-div">
                <h1 className="title page-title">Projects <span className="project-title-head text">/advice-ticket</span></h1>
                <hr />
            </div>
            <div className="page-info">
                <div className="info-text">
                    <div className="project-info">
                        <img src={photo} alt="" className="project-info-photo" />
                        <div className="project-info-text">
                            <h2 className="title">Advice Ticket</h2>
                            <div className="tag-button-div">
                                <p className="text">
                                    {projectTags.map((tag, index) => (
                                        <span key={index} className="tag">#{tag.replace(/ /g, "-").toLowerCase()}</span>
                                    ))}
                                </p>
                                <div className="text buttons-div">
                                    <p onClick={() => { href(project.github_link) }}>Github</p>
                                    <p onClick={() => { href(project.demo_link) }}>Preview</p>
                                </div>
                            </div>
                            <hr />
                            <h4 className="text">The "Advice Ticket" is a web application that provides users with random pieces of advice. It generates a unique advice number and a QR code for each piece of advice, making it a fun and interactive way to discover helpful insights.</h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdviceTicket;