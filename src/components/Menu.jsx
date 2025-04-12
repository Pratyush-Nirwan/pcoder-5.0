import React, { useState } from "react";
import animateText from "../assets/functions/animateText";

import BigText from "../assets/BigText.json"
function Menu({ setSelectedPage, selectedPage }) {

    return (
        <div className="menu">
            <ul>
                <li
                    className={selectedPage === "home" ? "selected" + selectedPage : "" + selectedPage}
                    onClick={() => {
                        setSelectedPage("home")
                        animateText('top-text', 'DEVELOPER + DESIGNER')
                        animateText('main-text', BigText.homeText);
                        animateText('home-num', '00')

                    }}
                >
                    {selectedPage === "home" && "•"} Home
                </li>
                <li
                    className={selectedPage === "about" ? "selected" + selectedPage : "" + selectedPage}
                    onClick={() => {
                        setSelectedPage("about");
                        animateText('top-text', 'About Me')
                        animateText('main-text', BigText.aboutText);
                        animateText('home-num', '01')
                    }}
                >
                    {selectedPage === "about" && "•"} About
                </li>
                <li
                    className={selectedPage === "works" ? "selected " + selectedPage : "" + selectedPage}
                    onClick={() => {
                        setSelectedPage("works")
                        animateText('home-num', '02')
                        animateText('top-text', 'Works')
                        animateText('main-text', BigText.workText);
                    }}
                >
                    {selectedPage === "works" && "•"} Works
                </li>
                <li
                    className={selectedPage === "guestbook" ? "selected " + selectedPage : "" + selectedPage}
                    onClick={() => {
                        setSelectedPage("guestbook")
                        animateText('home-num', '03')
                        animateText('top-text', 'Guestbook')
                        animateText('main-text', BigText.guestbookText);
                    }}
                >
                    {selectedPage === "guestbook" && "•"} GuestBook
                </li>
            </ul>
        </div>
    );
}

export default Menu;