
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import About from "../pages/About";
import Projects from "../pages/Projects";
import Blogs from '../pages/Blogs';
import GuestBook from '../pages/GuestBook';

const PageRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<About />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/guestbook" element={<GuestBook />} />
            </Routes>
        </>
    )
}

export default React.memo(PageRoutes);