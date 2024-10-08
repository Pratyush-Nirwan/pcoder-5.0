import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Menu = () => {
    const location = useLocation();
    const [selectedItem, setSelectedItem] = useState('');

    useEffect(() => {
        const path = location.pathname.replace(/^\/+/, '').toUpperCase();

        if (path.startsWith('PROJECTS')) {
            setSelectedItem('PROJECTS');
        } else {
            setSelectedItem(path || 'ABOUT');
        }
    }, [location.pathname]);

    const navigate = useNavigate();

    const handleClick = (item) => {
        setSelectedItem(item);
        navigate(`/${item.toLowerCase()}`);
    };

    return (
        <div id="menu" className="glass-nofade card-inner title">
            <div
                className={selectedItem === 'ABOUT' ? 'selected' : ''}
                onClick={() => handleClick('ABOUT')}
            >
                ABOUT
            </div>
            <div
                className={selectedItem === 'PROJECTS' ? 'selected' : ''}
                onClick={() => handleClick('PROJECTS')}
            >
                PROJECTS
            </div>
            <div
                className={selectedItem === 'BLOGS' ? 'selected' : ''}
                onClick={() => handleClick('BLOGS')}
            >
                BLOGS
            </div>
            <div
                className={selectedItem === 'GUESTBOOK' ? 'selected' : ''}
                onClick={() => handleClick('GUESTBOOK')}
            >
                GUESTBOOK
            </div>
        </div>
    );
};

export default Menu;
