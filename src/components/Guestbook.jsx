import { FaGithub } from "react-icons/fa";
import * as Realm from "realm-web";
import { useEffect, useState, useRef } from "react";
import { CgSpinner } from "react-icons/cg";
import { TiDelete } from "react-icons/ti";
import { setCookie } from "../assets/functions/cookieUtils";
import React from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { signInWithGitHub, signOut, getSession, getCurrentUser } from "../lib/supabase";

// MongoDB Realm App
const app = new Realm.App({ id: "guestbook-djqwpto" });

function GuestBook({ selectedPage }) {
  setCookie("page", "guestbook");

  const supabase = useSupabaseClient();
  const [user, setUser] = useState(null);
  const [usernameLower, setUsernameLower] = useState(null); // Store lowercased username here
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isCheckingUserMsg, setIsCheckingUserMsg] = useState(false);

  // Handle user session changes and OAuth callback
  useEffect(() => {
    console.log('Setting up auth state listener...');

    // Function to process user data and set lowercase username
    const processUser = (user) => {
      if (!user) {
        setUser(null);
        setUsernameLower(null);
        setIsAuthenticated(false);
        return;
      }

      // Extract GitHub username
      const username =
        user?.user_metadata?.user_name ||
        user?.user_metadata?.preferred_username ||
        user?.user_metadata?.full_name?.split(' ')[0] ||
        user?.email?.split('@')[0] ||
        'anonymous';

      const lowerUsername = username.toLowerCase();
      console.log('Setting username to:', username, 'lowercase:', lowerUsername);

      const userWithUsername = {
        ...user,
        username: lowerUsername,
        user_metadata: {
          ...user.user_metadata,
          user_name: lowerUsername
        }
      };

      console.log('Setting user data:', userWithUsername);
      setUser(userWithUsername);
      setUsernameLower(lowerUsername);
      setIsAuthenticated(true);
    };

    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const { data: { session }, error: sessionError } = await getSession();

        if (sessionError || !session?.user) {
          console.log('No active session found');
          setUser(null);
          setUsernameLower(null);
          setIsAuthenticated(false);
          return null;
        }

        console.log('Session found, getting user...');
        return session.user;
      } catch (error) {
        console.error('Error in session check:', error);
        setUser(null);
        setUsernameLower(null);
        setIsAuthenticated(false);
        return null;
      } finally {
        console.log('Session check complete');
      }
    };

    const handleOAuthRedirect = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }

        if (data.session) {
          console.log('Processing user from OAuth redirect');
          processUser(data.session.user);
        }
      } catch (error) {
        console.error('Error in OAuth redirect handling:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const initAuth = async () => {
      const user = await checkSession();
      if (user) {
        processUser(user);
      }
      setIsLoading(false);

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('code') && urlParams.get('next')?.includes('/guestbook')) {
        console.log('Handling OAuth redirect...');
        handleOAuthRedirect();
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, 'Session:', session);

        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          console.log('Signed in, processing user...');
          if (session?.user) {
            processUser(session.user);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setUsernameLower(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      console.log('Cleaning up auth listener');
      subscription?.unsubscribe();
    };
  }, [supabase]);

  const handleLogin = async () => {
    try {
      console.log('Initiating GitHub OAuth...');
      setIsLoading(true);
      const { error } = await signInWithGitHub();
      if (error) throw error;
      console.log('OAuth flow initiated');
    } catch (error) {
      console.error("Error signing in with GitHub:", error.message);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      console.log('Initiating sign out...');

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        console.warn('Error during sign out (will force clear):', signOutError.message);
      }

      try {
        await supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            console.log('Force clearing session');
            return supabase.auth.signOut({ scope: 'local' });
          }
        });
      } catch (cleanupError) {
        console.warn('Error during session cleanup:', cleanupError.message);
      }

      setUser(null);
      setUsernameLower(null);
      setIsAuthenticated(false);

      localStorage.removeItem('sb-auth-token');

      console.log('Sign out completed');
    } catch (error) {
      console.error("Error during sign out:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  function formatString(str, len, pad = false) {
    if (str.length > len) {
      return str.substring(0, len - 3) + "...";
    } else {
      return pad ? str.padEnd(len, "\u00A0") : str;
    }
  }

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMsgExists, setIsMsgExists] = useState(false);
  const [userMessage, setUserMessage] = useState(null);
  const userRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && usernameLower) {
      userRef.current = user;
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
        } catch (error) {
          console.error("Error checking user message:", error);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newMessage.trim() === "") return;

    try {
      const realmUser = await app.logIn(Realm.Credentials.anonymous());
      const mongo = realmUser.mongoClient("mongodb-atlas");
      const collection = mongo.db("PCODER-ME").collection("guestbook");

      const newMsg = {
        username: usernameLower,
        message: newMessage,
        date: new Date(),
      };

      const existingMessage = await collection.findOne({
        username: usernameLower,
      });

      if (existingMessage) {
        await collection.updateOne(
          { username: usernameLower },
          { $set: { message: newMessage, date: new Date() } }
        );
        setMessages(
          messages.map((msg) =>
            msg.username === usernameLower
              ? { ...msg, message: newMessage, date: new Date() }
              : msg
          )
        );
      } else {
        await collection.insertOne(newMsg);
        setMessages([...messages, newMsg]);
      }

      setNewMessage("");
      setUserMessage(newMessage);
      setIsMsgExists(true);
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  const checkUsernameExists = async (nickname) => {
    const user = await app.logIn(Realm.Credentials.anonymous());
    const mongo = user.mongoClient("mongodb-atlas");
    const collection = mongo.db("PCODER-ME").collection("guestbook");

    const result = await collection.findOne({
      username: nickname.toLowerCase(),
    });
    return result !== null;
  };

  const getUserData = async (nickname) => {
    const user = await app.logIn(Realm.Credentials.anonymous());
    const mongo = user.mongoClient("mongodb-atlas");
    const collection = mongo.db("PCODER-ME").collection("guestbook");

    const result = await collection.findOne({
      username: nickname.toLowerCase(),
    });
    return result;
  };

  const UpdateMessages = () => {
    const orderedMessages = messages.slice().reverse();
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

          hours = hours % 12;
          hours = hours ? hours : 12;
          hours = String(hours).padStart(2, "0");
          const formattedDate = `${day}-${month}-${year} ${hours}:${minutes} ${period}`;

          return (
            <React.Fragment key={index}>
              <div className="msg-div">
                <h5 className="name-msg">
                  <span className="name">
                    ~/{formatString(msg.username, 15, true)}:
                  </span>
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
      const usernameLowerDel = username.toLowerCase();

      await collection.deleteOne({ username: usernameLowerDel });
      setMessages(messages.filter((msg) => msg.username !== usernameLowerDel));
      setUserMessage(null);
      setIsMsgExists(false);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className={"guestbook-table " + selectedPage}>
      <div className="text">
        {!isAuthenticated ? (
          <div id="user-msg-div">
            <h5 className="name-msg">
              <span className="name">
                ~/{formatString("pcoder.me", 15, true)}:{" "}
              </span>
              sign-in to leave a message!
            </h5>
            <button onClick={handleLogin} className="button" id="login-btn">
              <FaGithub size={15} /> SignIn with GitHub
            </button>
          </div>
        ) : isCheckingUserMsg ? (
          <div id="user-msg-div">
            <h5 className="name-msg">
              <span className="name">
                ~/{formatString(usernameLower, 15, true)}:
              </span>
              <CgSpinner className="spinner" />
            </h5>
            <div id="delete-so-btn-div">
              <button
                onClick={handleLogout}
                className="button text"
                id="logout-btn"
              >
                SignOut
              </button>
            </div>
          </div>
        ) : !isMsgExists ? (
          <div id="user-msg-div">
            <h5 className="name-msg">
              <span className="name">
                ~/{formatString(usernameLower, 15, true)}:
              </span>
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
                <button
                  type="submit"
                  className="button text submit"
                  id="submit-btn"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="button text"
                  id="logout-btn"
                >
                  SignOut
                </button>
              </div>
            </form>
          </div>
        ) : userMessage ? (
          <div id="user-msg-div">
            <h5 className="name-msg">
              <span className="name">
                ~/{formatString(usernameLower, 15, true)}:
              </span>
              {formatString("\u00A0" + userMessage, 50, false)}
            </h5>
            <div id="delete-so-btn-div">
              <TiDelete
                onClick={() => {
                  handleDelete(usernameLower);
                }}
                size={30}
                id="delete-btn"
              />
              <button
                onClick={handleLogout}
                className="button text"
                id="logout-btn"
              >
                SignOut
              </button>
            </div>
          </div>
        ) : (
          <div id="user-msg-div">
            <h5 className="name-msg">
              <span className="name">
                ~/{formatString(usernameLower, 15, true)}:
              </span>
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
                <button
                  type="submit"
                  className="button text submit"
                  id="submit-btn"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="button text"
                  id="logout-btn"
                >
                  SignOut
                </button>
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
