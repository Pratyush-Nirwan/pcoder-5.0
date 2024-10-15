import { useState, useEffect } from "react";
import { Squash as Hamburger } from 'hamburger-react'
import { useNavigate, useLocation } from 'react-router-dom';


const HamburgerBtn = () => {
    const [isOpen, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState('');

    useEffect(() => {
        const path = location.pathname.replace(/^\/+/, '');
        if (path != 'menu') {
            setCurrentPage(path);
        }
    }, [location]);


    const handleClick = (item) => {
        navigate(`/${item.toLowerCase()}`);
    };

    useEffect(() => {
        if (currentPage != 'menu' && isOpen) {
            setOpen(false);
        }
    }, [currentPage])


    return (
        <div id="ham-div">
            <div id="ham-btn">
                <Hamburger rounded toggled={isOpen} toggle={setOpen} id="ham-btn"
                    onToggle={toggled => {
                        if (toggled) {
                            handleClick('menu');
                        } else {
                            console.log(currentPage)
                            handleClick(currentPage);
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default HamburgerBtn;