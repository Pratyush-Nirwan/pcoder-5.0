import React, { useState, useEffect } from "react";
import photo from '../../assets/project_thumbnails/weatherWise.png';
import data from '../../assets/data/projects.json'
const WeatherWise = () => {

    function href(url) {
        window.open(url, "_blank");
    }
    const project = data.projects.find(project => project.name === "Weather Wise");
    const projectTags = project.tags;
    return (
        <>
            <div className="page-title-div">
                <h1 className="title page-title">Projects <span className="project-title-head text">/weather-wise</span></h1>
                <hr />
            </div>
            <div className="page-info">
                <div className="info-text">
                    <div className="project-info">
                        <img src={photo} alt="" className="project-info-photo" />
                        <div className="project-info-text">
                            <h2 className="title">Weather Wise</h2>
                            <div className="tag-button-div">
                                <p className="text">
                                    {projectTags.map((tag, index) => (
                                        <span key={index} className="tag">#{tag.replace(/ /g, "-").toLowerCase()}</span>
                                    ))}
                                </p>
                                <div className="text">
                                    <p onClick={() => { href(project.github_link) }}>Github</p>
                                    <p onClick={() => { href(project.demo_link) }}>Preview</p>
                                </div>
                            </div>
                            <hr />
                            <h4 className="text">Welcome to Weather-Wise, a sleek and responsive web application built with React that provides real-time weather information for any city around the globe. With an easy-to-use interface and detailed weather forecasts, Weather-Wise helps you plan your day, no matter where you are. Whether it's sunny, rainy, or snowy, Weather-Wise ensures you're always prepared!</h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WeatherWise;