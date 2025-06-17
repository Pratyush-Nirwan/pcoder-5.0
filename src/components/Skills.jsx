import React from 'react';
import { IoLogoJavascript, IoLogoHtml5, IoLogoCss3, IoLogoReact, IoLogoNodejs, IoLogoGithub, IoLogoVercel, IoLogoNpm } from "react-icons/io5";
import { FaGitSquare } from "react-icons/fa";
import { SiMongodb, SiPostman, SiFigma, SiAdobeillustrator, SiAdobeaftereffects, SiCanva } from "react-icons/si";
import { BiLogoVisualStudio } from "react-icons/bi";
const Skills = ({ selectedPage }) => {
    const skills = [
        <IoLogoJavascript size={40} />,
        <IoLogoHtml5 size={40} />,
        <IoLogoCss3 size={40} />,
        <IoLogoReact size={40} />,
        <IoLogoNodejs size={40} />,
        <SiMongodb size={40} />,
        <FaGitSquare size={40} />,
        <IoLogoGithub size={40} />,
        <BiLogoVisualStudio size={40} />,
        <IoLogoVercel size={40} />,
        <IoLogoNpm size={40} />,
        <SiPostman size={40} />,
        <SiFigma size={40} />,
        <SiAdobeillustrator size={40} />,
        <SiAdobeaftereffects size={40} />,
        <SiCanva size={40} />,
    ];

    return (
        <div className={"skills-grid " + selectedPage}>
            {skills.map((icon, index) => (
                <div className="skill-icon" key={index}>
                    {icon}
                </div>
            ))}
        </div>
    );
};


export default Skills;
