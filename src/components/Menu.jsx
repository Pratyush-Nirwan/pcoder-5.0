import React, { useEffect, useRef, useState } from "react";
import { FaHome, FaUser, FaBriefcase, FaBook } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import animateText from "../assets/functions/animateText";
import BigText from "../assets/BigText.json";

// Responsive hook
function useIsMobile(breakpoint = 600) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);
    return isMobile;
}

function Menu({ setSelectedPage, selectedPage }) {
    const navigateTimeout = useRef(null);
    const navigate = useNavigate();

    const handleClick = (page, topText, mainText, pageNum, route) => {
        // Cancel any pending navigation
        if (navigateTimeout.current) {
            clearTimeout(navigateTimeout.current);
        }
        setSelectedPage(page);
        // animateText should reset/restart animation if interrupted
        animateText('top-text', topText);
        animateText('main-text', mainText);
        animateText('home-num', pageNum);
        navigateTimeout.current = setTimeout(() => {
            navigate(route);
        }, 1000);
    };

    // Each li gets `selectedPage` class, and the active one also gets `selected`
    const getClassName = (page) => {
        let baseClass = `menu-item ${selectedPage}`;
        if (selectedPage === page) {
            baseClass += " selected";
        }
        return baseClass;
    };

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (navigateTimeout.current) {
                clearTimeout(navigateTimeout.current);
            }
        };
    }, []);

    const isMobile = useIsMobile();
    // Icon map for menu items
    const icons = {
        home: <FaHome size={24} color="white"/>, // You can adjust size
        about: <FaUser size={24} color="white"/>,
        works: <FaBriefcase size={24} color="white"/>,
        guestbook: <FaBook size={24} color="white"/>,
    };
    const menuItems = [
        { key: "home", label: "Home", topText: "DEVELOPER + DESIGNER", mainText: BigText.homeText, pageNum: "00", route: "/" },
        { key: "about", label: "About", topText: "About Me", mainText: BigText.aboutText, pageNum: "01", route: "/about" },
        { key: "works", label: "Works", topText: "Works", mainText: BigText.workText, pageNum: "02", route: "/works" },
        { key: "guestbook", label: "GuestBook", topText: "Guestbook", mainText: BigText.guestbookText, pageNum: "03", route: "/guestbook" },
    ];
    return (
        <div className="menu">
            <ul>
                {menuItems.map(item => (
                    <li
                        key={item.key}
                        className={getClassName(item.key)}
                        onClick={() => handleClick(item.key, item.topText, item.mainText, item.pageNum, item.route)}
                    >
                        {selectedPage === item.key && <span className="menu-bullet" style={{ paddingRight: '8px' }}>•</span>}
                        {isMobile ? icons[item.key] : item.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Menu;
