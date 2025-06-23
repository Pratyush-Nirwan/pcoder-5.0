import '../../App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

import MeshGradient from '../../assets/MeshGradient';
import translations from '../../assets/translations';
import Menu from '../Menu';
import ProjectTree from '../Projects';
import BlogTree from '../Blogs';
import SpotifyRp from '../SpotifyRp';
import Skills from '../Skills';
import GuestBook from '../Guestbook';
import BigText from '../../assets/BigText.json';
import animateText from '../../assets/functions/animateText';
import React from 'react';
import { Helmet } from 'react-helmet';
function formatTextWithLineBreaks(text) {
    return text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {line}
            <br />
        </React.Fragment>
    ));
}

// Reusable Sections
const Intro = ({ selectedPage, language, setLanguage }) => {
    const [view, setView] = useState('projects');

    return (
        <>
            <Helmet>
                <title>Home | Pratyush Nirwan</title>
                <meta name="description" content="Welcome to Pratyush Nirwan’s site — Developer + Designer. Explore projects, blogs & more." />
            </Helmet>
            <p id='top-text' className={selectedPage}>DEVELOPER + DESIGNER</p>
            <h1 className={"reveal-text " + selectedPage} id='main-text'>{formatTextWithLineBreaks(translations[language].homeText)}</h1>
            <h1 className={"page-num " + selectedPage} id='home-num'>00</h1>
            <div className={"projects-blogs-btns-con " + selectedPage}>
                <div id='btns-con'>
                    <div id="projects-btn" onClick={() => setView('projects')} className={view === 'projects' ? 'selected' : ''}>Projects</div>
                    <div id="blogs-btn" onClick={() => setView('blogs')} className={view === 'blogs' ? 'selected' : ''}>Blogs</div>
                </div>
                <div className="projects-blogs-con">
                    {view === 'projects' && <ProjectTree />}
                    {view === 'blogs' && <BlogTree />}
                </div>
            </div>
            <h1 className={"lang " + selectedPage}>
    <div onClick={() => setLanguage('en')} style={{cursor:'pointer', fontWeight: language==='en'?'bold':'normal'}}>en-IN</div><div onClick={() => setLanguage('en')} style={{cursor:'pointer', fontWeight: language==='en'?'bold':'normal'}}>ENGLISH</div>
    <div onClick={() => setLanguage('hi')} style={{cursor:'pointer', fontWeight: language==='hi'?'bold':'normal'}}>hi-IN</div><div onClick={() => setLanguage('hi')} style={{cursor:'pointer', fontWeight: language==='hi'?'bold':'normal'}}>HINDI</div>
    <div onClick={() => setLanguage('mr')} style={{cursor:'pointer', fontWeight: language==='mr'?'bold':'normal'}}>mr-IN</div><div onClick={() => setLanguage('mr')} style={{cursor:'pointer', fontWeight: language==='mr'?'bold':'normal'}}>MARATHI</div>
</h1>
            <div className={"contact-icons " + selectedPage}>
                <a href="https://www.instagram.com/pratyush_nirwan" target="_blank" rel="noopener noreferrer" className="icon">
                    <FaInstagram size={30} />
                </a>
                <a href="https://www.linkedin.com/in/pratyush-nirwan" target="_blank" rel="noopener noreferrer" className="icon">
                    <FaLinkedin size={30} />
                </a>
                <a href="https://github.com/pratyush-nirwan" target="_blank" rel="noopener noreferrer" className="icon">
                    <FaGithub size={30} />
                </a>
                <a href="mailto:pratyushnirwan123@email.com" className="icon">
                    <IoMail size={30} />
                </a>
            </div>
            <GuestBook selectedPage={selectedPage} />
            <Skills selectedPage={selectedPage} />

        </>
    );
};

const About = ({ selectedPage, language, setLanguage }) => {
    const [view, setView] = useState('projects');

    return (
        <>
            <Helmet>
                <title>About | Pratyush Nirwan</title>
                <meta name="description" content="Discover Pratyush Nirwan’s journey in tech, design, and creativity." />
            </Helmet>
            <p id='top-text' className={selectedPage}>{language === 'en' ? 'About Me' : language === 'hi' ? 'मेरे बारे में' : 'माझ्याबद्दल'}</p>
            <h1 className={"reveal-text " + selectedPage} id='main-text'>{formatTextWithLineBreaks(translations[language].aboutText)}</h1>
            <h1 className={"page-num " + selectedPage} id='home-num'>01</h1>
            <div className={"projects-blogs-btns-con " + selectedPage}>
                <div id='btns-con'>
                    <div id="projects-btn" onClick={() => setView('projects')} className={view === 'projects' ? 'selected' : ''}>Projects</div>
                    <div id="blogs-btn" onClick={() => setView('blogs')} className={view === 'blogs' ? 'selected' : ''}>Blogs</div>
                </div>
                <div className="projects-blogs-con">
                    {view === 'projects' && <ProjectTree />}
                    {view === 'blogs' && <BlogTree />}
                </div>
            </div>
            <h1 className={"lang " + selectedPage}>
    <div onClick={() => setLanguage('en')} style={{cursor:'pointer', fontWeight: language==='en'?'bold':'normal'}}>en-IN</div><div onClick={() => setLanguage('en')} style={{cursor:'pointer', fontWeight: language==='en'?'bold':'normal'}}>ENGLISH</div>
    <div onClick={() => setLanguage('hi')} style={{cursor:'pointer', fontWeight: language==='hi'?'bold':'normal'}}>hi-IN</div><div onClick={() => setLanguage('hi')} style={{cursor:'pointer', fontWeight: language==='hi'?'bold':'normal'}}>HINDI</div>
    <div onClick={() => setLanguage('mr')} style={{cursor:'pointer', fontWeight: language==='mr'?'bold':'normal'}}>mr-IN</div><div onClick={() => setLanguage('mr')} style={{cursor:'pointer', fontWeight: language==='mr'?'bold':'normal'}}>MARATHI</div>
</h1>
            <div className={"contact-icons " + selectedPage}>
                <a href="https://www.instagram.com/pratyush_nirwan" target="_blank" rel="noopener noreferrer" className="icon">
                    <FaInstagram size={30} />
                </a>
                <a href="https://www.linkedin.com/in/pratyush-nirwan" target="_blank" rel="noopener noreferrer" className="icon">
                    <FaLinkedin size={30} />
                </a>
                <a href="https://github.com/pratyush-nirwan" target="_blank" rel="noopener noreferrer" className="icon">
                    <FaGithub size={30} />
                </a>
                <a href="mailto:pratyushnirwan123@email.com" className="icon">
                    <IoMail size={30} />
                </a>
            </div>
            <GuestBook selectedPage={selectedPage} />
            <Skills selectedPage={selectedPage} />



        </>
    );
};

const ProjectsBlogs = ({ selectedPage, language, setLanguage }) => {
    const [view, setView] = useState('projects');

    return (
        <>
            <Helmet>
                <title>Works | Pratyush Nirwan</title>
                <meta name="description" content="View Pratyush’s projects in development, design, and innovation." />
            </Helmet>
            <p id='top-text' className={selectedPage}>{language === 'en' ? 'Works' : language === 'hi' ? 'काम' : 'कामे'}</p>
            <h1 className={"reveal-text " + selectedPage} id='main-text'>{formatTextWithLineBreaks(translations[language].workText)}</h1>
            <h1 className={"page-num " + selectedPage} id='home-num'>02</h1>
            <div className={"projects-blogs-btns-con " + selectedPage}>
                <div id='btns-con'>
                    <div id="projects-btn" onClick={() => setView('projects')} className={view === 'projects' ? 'selected' : ''}>Projects</div>
                    <div id="blogs-btn" onClick={() => setView('blogs')} className={view === 'blogs' ? 'selected' : ''}>Blogs</div>
                </div>
                <div className="projects-blogs-con">
                    {view === 'projects' && <ProjectTree />}
                    {view === 'blogs' && <BlogTree />}
                </div>
            </div>
            <h1 className={"lang " + selectedPage}>
    <div onClick={() => setLanguage('en')} style={{cursor:'pointer', fontWeight: language==='en'?'bold':'normal'}}>en-IN</div><div onClick={() => setLanguage('en')} style={{cursor:'pointer', fontWeight: language==='en'?'bold':'normal'}}>ENGLISH</div>
    <div onClick={() => setLanguage('hi')} style={{cursor:'pointer', fontWeight: language==='hi'?'bold':'normal'}}>hi-IN</div><div onClick={() => setLanguage('hi')} style={{cursor:'pointer', fontWeight: language==='hi'?'bold':'normal'}}>HINDI</div>
    <div onClick={() => setLanguage('mr')} style={{cursor:'pointer', fontWeight: language==='mr'?'bold':'normal'}}>mr-IN</div><div onClick={() => setLanguage('mr')} style={{cursor:'pointer', fontWeight: language==='mr'?'bold':'normal'}}>MARATHI</div>
</h1>
            <div className={"contact-icons " + selectedPage}>
                <a href="https://www.instagram.com/pratyush_nirwan" target="_blank" rel="noopener noreferrer" className="icon">
                    <FaInstagram size={30} />
                </a>
                <a href="https://www.linkedin.com/in/pratyush-nirwan" target="_blank" rel="noopener noreferrer" className="icon">
                    <FaLinkedin size={30} />
                </a>
                <a href="https://github.com/pratyush-nirwan" target="_blank" rel="noopener noreferrer" className="icon">
                    <FaGithub size={30} />
                </a>
                <a href="mailto:pratyushnirwan123@email.com" className="icon">
                    <IoMail size={30} />
                </a>
            </div>
            <Skills selectedPage={selectedPage} />

            <GuestBook selectedPage={selectedPage} />

        </>
    );
};

const GuestBookPage = ({ selectedPage, language, setLanguage }) => {
    const [view, setView] = useState('projects');

    return (
        <>
            <Helmet>
                <title>Guestbook | Pratyush Nirwan</title>
                <meta name="description" content="Sign or read the guestbook — share your thoughts or connect." />
            </Helmet>
            <p id='top-text' className={selectedPage}>{language === 'en' ? 'Guestbook' : language === 'hi' ? 'अतिथि पुस्तिका' : 'अतिथी पुस्तिका'}</p>
            <h1 className={"reveal-text " + selectedPage} id='main-text'>
                {formatTextWithLineBreaks(translations[language].guestbookText)}
            </h1>
            <h1 className={"page-num " + selectedPage} id='home-num'>03</h1>
            <div className={"projects-blogs-btns-con " + selectedPage}>
                <div id='btns-con'>
                    <div id="projects-btn" onClick={() => setView('projects')} className={view === 'projects' ? 'selected' : ''}>Projects</div>
                    <div id="blogs-btn" onClick={() => setView('blogs')} className={view === 'blogs' ? 'selected' : ''}>Blogs</div>
                </div>
                <div className="projects-blogs-con">
                    {view === 'projects' && <ProjectTree />}
                    {view === 'blogs' && <BlogTree />}
                </div>
            </div>
            <h1 className={"lang " + selectedPage}>
    <div onClick={() => setLanguage('en')} style={{cursor:'pointer', fontWeight: language==='en'?'bold':'normal'}}>en-IN</div><div onClick={() => setLanguage('en')} style={{cursor:'pointer', fontWeight: language==='en'?'bold':'normal'}}>ENGLISH</div>
    <div onClick={() => setLanguage('hi')} style={{cursor:'pointer', fontWeight: language==='hi'?'bold':'normal'}}>hi-IN</div><div onClick={() => setLanguage('hi')} style={{cursor:'pointer', fontWeight: language==='hi'?'bold':'normal'}}>HINDI</div>
    <div onClick={() => setLanguage('mr')} style={{cursor:'pointer', fontWeight: language==='mr'?'bold':'normal'}}>mr-IN</div><div onClick={() => setLanguage('mr')} style={{cursor:'pointer', fontWeight: language==='mr'?'bold':'normal'}}>MARATHI</div>
</h1>
            <div className={"contact-icons " + selectedPage}>
                <a href="https://www.instagram.com/pratyush_nirwan" target="_blank" rel="noopener noreferrer" className="icon">
                    <FaInstagram size={30} />
                </a>
                <a href="https://www.linkedin.com/in/pratyush-nirwan" target="_blank" rel="noopener noreferrer" className="icon">
                    <FaLinkedin size={30} />
                </a>
                <a href="https://github.com/pratyush-nirwan" target="_blank" rel="noopener noreferrer" className="icon">
                    <FaGithub size={30} />
                </a>
                <a href="mailto:pratyushnirwan123@email.com" className="icon">
                    <IoMail size={30} />
                </a>
            </div>
            <Skills selectedPage={selectedPage} />

            <GuestBook selectedPage={selectedPage} />

        </>
    );
};



function Home() {
    const [selectedPage, setSelectedPage] = useState('home');
    const [language, setLanguage] = useState('en');
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/') {
            setSelectedPage('home');
        } else if (location.pathname === '/about') {
            setSelectedPage('about');
        } else if (location.pathname === '/works') {
            setSelectedPage('works');
        } else if (location.pathname === '/guestbook') {
            setSelectedPage('guestbook');
        } else {
            setSelectedPage(location.pathname.replace('/', ''));
        }
    }, [location.pathname]);

    return (
        <>
            <div id='main-body'>
                {/* Background */}
                <div id='bg-main' className={selectedPage}>
                    <div id="left-part" className={selectedPage}></div>
                    <div id="right-part" className={selectedPage}>
                        <MeshGradient id="gradient-right" seed={1} frequency={[0.0001, 0.0005]} />
                    </div>
                </div>
                <SpotifyRp selectedPage={selectedPage} />
                {/* Page Content */}
                <div id='home-text'>
                    <Routes>
                        <Route path="/" element={<Intro selectedPage={selectedPage} language={language} setLanguage={setLanguage} />} />
                        <Route path="/about" element={<About selectedPage={selectedPage} language={language} setLanguage={setLanguage} />} />
                        <Route path="/works" element={<ProjectsBlogs selectedPage={selectedPage} language={language} setLanguage={setLanguage} />} />
                        <Route path="/guestbook" element={<GuestBookPage selectedPage={selectedPage} language={language} setLanguage={setLanguage} />} />
                    </Routes>
                </div>
            </div>

            <Menu setSelectedPage={setSelectedPage} selectedPage={selectedPage} />
        </>
    );
}

export default Home;
