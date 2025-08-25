import { FaGithub } from "react-icons/fa";
import * as Realm from "realm-web";
import { useEffect, useState, useRef } from "react";
import { CgSpinner } from "react-icons/cg";
import { TiDelete } from "react-icons/ti";
import { setCookie } from "../assets/functions/cookieUtils";
import React from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

// MongoDB Realm App
const app = new Realm.App({ id: "guestbook-djqwpto" });

function GuestBook({ selectedPage }) {
  setCookie("page", "guestbook");

  const supabase = useSupabaseClient();
  const session = useSession();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle user session changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: { user } } = await supabase.auth.getUser();

        // Extract GitHub username only (no email)
        const username =
          user?.user_metadata?.user_name ||
          session.user.user_metadata?.user_name ||
          "anonymous";

        setUser({
          ...session.user,
          username,
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogin = async () => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
              redirectTo: window.location.origin + "/guestbook",
              scopes: "read:user", // Only ask for profile
            },
          });
          
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with GitHub:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = window.location.origin + "/guestbook";
    } catch (error) {
      console.error("Error signing out:", error.message);
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
    if (isAuthenticated && user) {
      userRef.current = user;
      (async () => {
        try {
          const usernameLower = user.username.toLowerCase();
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
        }
      })();
    }
  }, [isAuthenticated, user]);

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
      const usernameLower = user.username.toLowerCase();

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
      const usernameLower = username.toLowerCase();

      await collection.deleteOne({ username: usernameLower });
      setMessages(messages.filter((msg) => msg.username !== usernameLower));
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
        ) : !isMsgExists ? (
          <div id="user-msg-div">
            <h5 className="name-msg">
              <span className="name">
                ~/{formatString(user.username, 15, true)}:
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
        ) : userMessage ? (
          <div id="user-msg-div">
            <h5 className="name-msg">
              <span className="name">
                ~/{formatString(user.username, 15, true)}:
              </span>
              {formatString("\u00A0" + userMessage, 50, false)}
            </h5>
            <div id="delete-so-btn-div">
              <TiDelete
                onClick={() => {
                  handleDelete(user.username);
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
                ~/{formatString(user.username, 15, true)}:
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

      {isLoaded ? <UpdateMessages /> : <CgSpinner size={20} className="spinner" />}
    </div>
  );
}

export default GuestBook;
