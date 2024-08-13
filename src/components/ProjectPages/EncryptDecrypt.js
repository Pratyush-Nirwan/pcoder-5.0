import React, { useState, useEffect } from "react";
import photo from '../../assets/project_thumbnails/encryptDecrypt.png';
import data from '../../assets/data/projects.json'
const EncryptDecrypt = () => {

    function href(url) {
        window.open(url, "_blank");
    }
    const project = data.projects.find(project => project.name === "EncryptDecrypt");

    const projectTags = project.tags;
    return (
        <>
            <div className="page-title-div">
                <h1 className="title page-title">Projects <span className="project-title-head text">/encryptdecrypt</span></h1>
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
                                <div className="text">
                                    <p onClick={() => { href(project.github_link) }}>Github</p>
                                    <p onClick={() => { href(project.demo_link) }}>Preview</p>
                                </div>
                            </div>
                            <hr />
                            <h4 className="text">The Encrypt Decrypt Web Application features an intuitive user interface reminiscent of an operating system, providing a seamless experience for encrypting and decrypting messages. Powered by AES encryption with a randomly generated key, it ensures secure handling of sensitive information.</h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EncryptDecrypt;