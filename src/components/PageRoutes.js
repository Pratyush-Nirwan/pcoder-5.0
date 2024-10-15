
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import About from "../pages/About";
import Projects from "../pages/Projects";
import Blogs from '../pages/Blogs';
import GuestBook from '../pages/GuestBook';
import HamMenu from '../pages/HamMenu';

import AdviceTicket from './ProjectPages/AdviceTicket';
import EncryptDecrypt from './ProjectPages/EncryptDecrypt';
import Psa from './ProjectPages/Psa';
import WeatherWise from './ProjectPages/WeatherWise';

import V1 from './Versions';
const PageRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<About />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/guestbook" element={<GuestBook />} />
                <Route path="/menu" element={<HamMenu />} />

                <Route path="/projects/all" element={<Projects />} />
                <Route path="/projects/personal" element={<Projects />} />
                <Route path="/projects/freelance" element={<Projects />} />
                <Route path="/projects/rewind" element={<Projects />} />

                <Route path="/projects/advice-ticket" element={<AdviceTicket />} />
                <Route path="/projects/encryptdecrypt" element={<EncryptDecrypt />} />
                <Route path="/projects/pritstine-spoken-english-academy-website" element={<Psa />} />
                <Route path="/projects/weather-wise" element={<WeatherWise />} />

            </Routes>
        </>
    )
}

export default React.memo(PageRoutes);