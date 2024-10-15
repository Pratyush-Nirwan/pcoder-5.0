import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { getCookie } from '../utils/cookieUtils';

const HamMenu = () => {
    const location = useLocation();
    const [selectedItem, setSelectedItem] = useState('');

    useEffect(() => {
        const path = location.pathname.replace(/^\/+/, '').toUpperCase();

        if (path.startsWith('MENU')) {
            return;
        }
        else if (path.startsWith('PROJECTS')) {
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

    const [cookieValue, setCookieValue] = useState("");

    useEffect(() => {
        const savedCookie = getCookie("page");
        if (savedCookie) {
            setCookieValue(savedCookie);
        }
    }, []);

    return (
        <>
            <div className="page-title-div">
                <h1 className="title page-title">Menu</h1>
                <hr />
            </div>
            <div className="page-info">
                <div className="info-text">
                    <div id="ham-menu">
                        <div
                            className={cookieValue === 'about' ? 'selected title' : 'title'}
                            onClick={() => cookieValue !== 'about' && handleClick('ABOUT')}
                        >
                            ABOUT
                        </div>
                        <div
                            className={cookieValue === 'projects' ? 'selected title' : 'title'}
                            onClick={() => cookieValue !== 'projects' && handleClick('PROJECTS')}
                        >
                            PROJECTS
                        </div>
                        <div
                            className={cookieValue === 'blogs' ? 'selected title' : 'title'}
                            onClick={() => cookieValue !== 'blogs' && handleClick('BLOGS')}
                        >
                            BLOGS
                        </div>
                        <div
                            className={cookieValue === 'guestbook' ? 'selected title' : 'title'}
                            onClick={() => cookieValue !== 'guestbook' && handleClick('GUESTBOOK')}
                        >
                            GUESTBOOK
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HamMenu;