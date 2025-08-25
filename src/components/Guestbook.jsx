import { FaGithub } from "react-icons/fa";
import * as Realm from "realm-web";
import { useEffect, useState, useRef } from "react";
import { CgSpinner } from "react-icons/cg";
import { TiDelete } from "react-icons/ti";
import { setCookie } from "../assets/functions/cookieUtils";
import React from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { signInWithGitHub, getSession } from "../lib/supabase";

const app = new Realm.App({ id: "guestbook-djqwpto" });

function GuestBook({ selectedPage }) {
  setCookie("page", "guestbook");

  const supabase = useSupabaseClient();
  const [user, setUser] = useState(null);
  const [usernameLower, setUsernameLower] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isCheckingUserMsg, setIsCheckingUserMsg] = useState(false);

  useEffect(() => {
    const processUser = (user) => {
      if (!user) {
        setUser(null);
        setUsernameLower(null);
        setIsAuthenticated(false);
        return;
      }
      const username =
        user?.user_metadata?.user_name ||
        user?.user_metadata?.preferred_username ||
        user?.user_metadata?.full_name?.split(" ")[0] ||
        user?.email?.split("@")[0] ||
        "anonymous";
      const lowerUsername = username.toLowerCase();

      const userWithUsername = {
        ...user,
        username: lowerUsername,
        user_metadata: {
          ...user.user_metadata,
          user_name: lowerUsername,
        },
      };
      setUser(userWithUsername);
      setUsernameLower(lowerUsername);
      setIsAuthenticated(true);
    };

    const checkSession = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await getSession();
        if (sessionError || !session?.user) {
          setUser(null);
          setUsernameLower(null);
          setIsAuthenticated(false);
          return null;
        }
        return session.user;
      } catch {
        setUser(null);
        setUsernameLower(null);
        setIsAuthenticated(false);
        return null;
      } finally {
        setIsLoading(false);
      }
    };

    const handleOAuthRedirect = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (data.session) {
          processUser(data.session.user);
        }
      } catch {}
      setIsLoading(false);
    };

    const initAuth = async () => {
      const user = await checkSession();
      if (user) processUser(user);
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("code") && urlParams.get("next")?.includes("/guestbook")) {
        handleOAuthRedirect();
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        if (session?.user) processUser(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setUsernameLower(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, [supabase]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await signInWithGitHub();
      if (error) throw error;
    } catch {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setUsernameLower(null);
      setIsAuthenticated(false);
      localStorage.removeItem("sb-auth-token");
    } catch {} finally {
      setIsLoading(false);
    }
  };

  function formatString(str, len, pad = false) {
    if (str.length > len) return str.substring(0, len - 3) + "...";
    return pad ? str.padEnd(len, "\u00A0") : str;
  }

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMsgExists, setIsMsgExists] = useState(false);
  const [userMessage, setUserMessage] = useState(null);

  useEffect(() => {
    if (isAuthenticated && usernameLower) {
      setIsCheckingUserMsg(true);
      (async () => {
        try {
          const exists = await checkUsernameExists(usernameLower);
          if (exists) {
            const userData = await getUserData(usernameLower);
            setUserMessage(userData?.message || "");
            setIsMsgExists(true);
          } else {
            setUserMessage(null);
            setIsMsgExists(false);
          }
        } catch {
          setIsMsgExists(false);
        } finally {
          setIsCheckingUserMsg(false);
        }
      })();
    } else {
      setIsMsgExists(false);
      setUserMessage(null);
    }
  }, [isAuthenticated, usernameLower]);

  useEffect(() => {
    const fetchMessages = async () => {
      const user = await app.logIn(Realm.Credentials.anonymous());
      const mongo = user.mongoClient("mongodb-atlas");
      const collection = mongo.db("PCODER-ME").collection("guestbook");
      const messages = await collection.find();
      setMessages(messages);
      setIsLoaded(true);
    };
    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const realmUser = await app.logIn(Realm.Credentials.anonymous());
      const mongo = realmUser.mongoClient("mongodb-atlas");
      const collection = mongo.db("PCODER-ME").collection("guestbook");

      const newMsg = { username: usernameLower, message: newMessage, date: new Date() };

      const existingMessage = await collection.findOne({ username: usernameLower });
      if (existingMessage) {
        await collection.updateOne(
          { username: usernameLower },
          { $set: { message: newMessage, date: new Date() } }
        );
        setMessages(messages.map(msg => msg.username === usernameLower ? {...msg, message: newMessage, date: new Date()} : msg));
      } else {
        await collection.insertOne(newMsg);
        setMessages([...messages, newMsg]);
      }

      setNewMessage("");
      setUserMessage(newMessage);
      setIsMsgExists(true);
    } catch {}
  };

  const checkUsernameExists = async (nickname) => {
    const user = await app.logIn(Realm.Credentials.anonymous());
    const mongo = user.mongoClient("mongodb-atlas");
    const collection = mongo.db("PCODER-ME").collection("guestbook");
    const result = await collection.findOne({ username: nickname });
    return result !== null;
  };

  const getUserData = async (nickname) => {
    const user = await app.logIn(Realm.Credentials.anonymous());
    const mongo = user.mongoClient("mongodb-atlas");
    const collection = mongo.db("PCODER-ME").collection("guestbook");
    const result = await collection.findOne({ username: nickname });
    return result;
  };

  const UpdateMessages = ({ userToExclude }) => {
    const filteredMessages = messages.filter(msg => msg.username !== userToExclude);
    const orderedMessages = filteredMessages.slice().reverse();

    return (
      <>
        {orderedMessages.map((msg, index) => {
          const date = new Date(msg.date);
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const year = date.getFullYear();

          let hours = date.getHours();
          const minutes = String(date.getMinutes()).padStart(2, "0");
          const period = hours >= 12 ? "PM" : "AM";

          hours = hours % 12 || 12;
          hours = String(hours).padStart(2, "0");
          const formattedDate = `${day}-${month}-${year} ${hours}:${minutes} ${period}`;

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

  const handleDelete = async (username) => {
    try {
      const realmUser = await app.logIn(Realm.Credentials.anonymous());
      const mongo = realmUser.mongoClient("mongodb-atlas");
      const collection = mongo.db("PCODER-ME").collection("guestbook");
      await collection.deleteOne({ username });
      setMessages(messages.filter(msg => msg.username !== username));
      setUserMessage(null);
      setIsMsgExists(false);
    } catch {}
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
        ) : isCheckingUserMsg ? (
          <div id="user-msg-div">
            <h5 className="name-msg">
              <span className="name">~/{formatString(usernameLower, 15, true)}:</span>
              <CgSpinner className="spinner" />
            </h5>
            <div id="delete-so-btn-div">
              <button onClick={handleLogout} className="button text" id="logout-btn">
                SignOut
              </button>
            </div>
          </div>
        ) : !isMsgExists ? (
          <div id="user-msg-div">
            <h5 className="name-msg">
              <span className="name">~/{formatString(usernameLower, 15, true)}:</span>
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
                <button type="submit" className="button text submit" id="submit-btn">
                  Submit
                </button>
                <button type="button" onClick={handleLogout} className="button text" id="logout-btn">
                  SignOut
                </button>
              </div>
            </form>
          </div>
        ) : userMessage ? (
          <div id="user-msg-div">
            <h5 className="name-msg">
              <span className="name">~/{formatString(usernameLower, 15, true)}:</span>
              {formatString("\u00A0" + userMessage, 50, false)}
            </h5>
            <div id="delete-so-btn-div">
              <TiDelete onClick={() => handleDelete(usernameLower)} size={30} id="delete-btn" />
              <button onClick={handleLogout} className="button text" id="logout-btn">
                SignOut
              </button>
            </div>
          </div>
        ) : (
          <div id="user-msg-div">
            <h5 className="name-msg">
              <span className="name">~/{formatString(usernameLower, 15, true)}:</span>
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
                <button type="submit" className="button text submit" id="submit-btn">
                  Submit
                </button>
                <button type="button" onClick={handleLogout} className="button text" id="logout-btn">
                  SignOut
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {isLoaded ? <UpdateMessages userToExclude={usernameLower} /> : <CgSpinner size={20} className="spinner" />}
    </div>
  );
}

export default GuestBook;
