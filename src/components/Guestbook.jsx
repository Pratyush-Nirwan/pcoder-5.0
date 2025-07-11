import { useAuth0 } from "@auth0/auth0-react";
import { FaGithub } from "react-icons/fa";
import * as Realm from 'realm-web';
import { useEffect, useState, useRef } from 'react';
import { CgSpinner } from "react-icons/cg";
import { TiDelete } from "react-icons/ti";
import { setCookie } from "../assets/functions/cookieUtils";
import React from "react";

const app = new Realm.App({ id: "guestbook-djqwpto" });

function GuestBook({ selectedPage }) {
    setCookie("page", "guestbook");

    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

    const handleLogin = () => {
        loginWithRedirect({
            redirectUri: window.location.origin + "/guestbook"
        });
    };

    const handleLogout = () => {
        logout({
            logoutParams: { returnTo: window.location.origin + "/guestbook" }
        });
    };

    function formatString(str, len, pad = false) {
        if (str.length > len) {
            return str.substring(0, len - 3) + '...';
        } else {
            return pad ? str.padEnd(len, '\u00A0') : str;
        }
    }

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMsgExists, setIsMsgExists] = useState(false);
    const [userMessage, setUserMessage] = useState(null);
    const userRef = useRef(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            userRef.current = user;
            (async () => {
                const exists = await checkUsernameExists(user.nickname.toLowerCase());
                if (exists) {
                    const userData = await getUserData(user.nickname.toLowerCase());
                    setUserMessage(userData.message);
                    setIsMsgExists(true);
                } else {
                    setIsMsgExists(true);
                }
            })();
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        const fetchMessages = async () => {
            const user = await app.logIn(Realm.Credentials.anonymous());
            const mongo = user.mongoClient('mongodb-atlas');
            const collection = mongo.db('PCODER-ME').collection('guestbook');

            const messages = await collection.find();
            setMessages(messages);
            setIsLoaded(true);
        };
        fetchMessages();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newMessage.trim() === "") return;

        const user = await app.logIn(Realm.Credentials.anonymous());
        const mongo = user.mongoClient('mongodb-atlas');
        const collection = mongo.db('PCODER-ME').collection('guestbook');

        const newMsg = {
            username: userRef.current.nickname.toLowerCase(),
            message: newMessage,
            date: new Date()
        };

        await collection.insertOne(newMsg);
        setMessages([...messages, newMsg]);
        setNewMessage("");
        setUserMessage(newMessage);
    };

    const checkUsernameExists = async (nickname) => {
        const user = await app.logIn(Realm.Credentials.anonymous());
        const mongo = user.mongoClient('mongodb-atlas');
        const collection = mongo.db('PCODER-ME').collection('guestbook');

        const result = await collection.findOne({ username: nickname.toLowerCase() });
        return result !== null;
    };

    const getUserData = async (nickname) => {
        const user = await app.logIn(Realm.Credentials.anonymous());
        const mongo = user.mongoClient('mongodb-atlas');
        const collection = mongo.db('PCODER-ME').collection('guestbook');

        const result = await collection.findOne({ username: nickname.toLowerCase() });
        return result;
    };

    const UpdateMessages = () => {
        const orderedMessages = messages.slice().reverse();
        return (
            <>
                {orderedMessages.map((msg, index) => {
                    const date = new Date(msg.date);
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const year = date.getFullYear();

                    let hours = date.getHours();
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    const period = hours >= 12 ? 'PM' : 'AM';

                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    hours = String(hours).padStart(2, '0');
                    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes} ${period}`;

                    if (isAuthenticated && msg.username === user.nickname.toLowerCase()) {
                        return null;
                    }

                    return (
                        <React.Fragment key={index}>
                            <div className="msg-div">
                                <h5 className="name-msg">
                                    <span className="name">~/{formatString(msg.username, 15, true)}:</span>
                                    {formatString("\u00A0" + msg.message, 50, false)}
                                </h5>
                                <h5 className="date text">{formattedDate}</h5>
                            </div>
                        </React.Fragment>
                    );
                })}
            </>
        );
    };

    const handleDelete = async (nickname) => {
        const user = await app.logIn(Realm.Credentials.anonymous());
        const mongo = user.mongoClient('mongodb-atlas');
        const collection = mongo.db('PCODER-ME').collection('guestbook');

        await collection.deleteOne({ username: nickname.toLowerCase() });

        setMessages(messages.filter(msg => msg.username !== nickname.toLowerCase()));
        setUserMessage(null);
    };

    return (
        <div className={"guestbook-table " + selectedPage}>
            <div className="text">
                {!isAuthenticated ? (
                    <div id="user-msg-div">
                        <h5 className="name-msg">
                            <span className="name">~/{formatString("pcoder.me", 15, true)}: </span>
                            sign-in to leave a message!
                        </h5>
                        <button onClick={handleLogin} className="button" id="login-btn">
                            <FaGithub size={15} /> SignIn
                        </button>
                    </div>
                ) : !isMsgExists ? (
                    <div id="user-msg-div">
                        <h5 className="name-msg">
                            <span className="name">~/{formatString(user.nickname.toLowerCase(), 15, true)}: </span>
                            <CgSpinner className="spinner" />
                        </h5>
                        <div id='delete-so-btn-div'>
                            <button onClick={handleLogout} className="button text" id="logout-btn">SignOut</button>
                        </div>
                    </div>
                ) : userMessage ? (
                    <div id="user-msg-div">
                        <h5 className="name-msg">
                            <span className="name">~/{formatString(user.nickname.toLowerCase(), 15, true)}: </span>
                            {formatString("\u00A0" + userMessage, 50, false)}
                        </h5>
                        <div id='delete-so-btn-div'>
                            <TiDelete onClick={() => { handleDelete(user.nickname) }} size={30} id='delete-btn' />
                            <button onClick={handleLogout} className="button text" id="logout-btn">SignOut</button>
                        </div>
                    </div>
                ) : (
                    <div id="user-msg-div">
                        <h5 className="name-msg">
                            <span className="name">~/{formatString(user.nickname.toLowerCase(), 15, true)}: </span>
                        </h5>
                        <form onSubmit={handleSubmit} id="submit-form">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="input-field text"
                                placeholder="Write your message here..."
                            />
                            <div id="btns-div">
                                <button type="submit" className="button text submit" id="submit-btn">Submit</button>
                                <button onClick={handleLogout} className="button text" id="logout-btn">SignOut</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {isLoaded ? (
                <UpdateMessages />
            ) : (
                <CgSpinner size={20} className="spinner" />
            )}
        </div>
    );
}

export default GuestBook;
