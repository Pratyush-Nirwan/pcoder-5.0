import { FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { TiDelete } from "react-icons/ti";
import { setCookie } from "../assets/functions/cookieUtils";
import React from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { signInWithGitHub, getSession } from "../lib/supabase";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      try {
        const { data, error } = await supabase
          .from('guestbook')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const messageData = {
        username: usernameLower,
        message: newMessage,
        created_at: new Date().toISOString()
      };

      const { data: existingMessage, error: fetchError } = await supabase
        .from('guestbook')
        .select('*')
        .eq('username', usernameLower)
        .single();

      if (existingMessage) {
        // Update existing message
        const { error } = await supabase
          .from('guestbook')
          .update({
            message: newMessage,
            created_at: new Date().toISOString()
          })
          .eq('username', usernameLower);
          
        if (error) throw error;
        
        setMessages(messages.map(msg => 
          msg.username === usernameLower 
            ? { ...msg, message: newMessage, created_at: new Date().toISOString() } 
            : msg
        ));
      } else {
        // Insert new message
        const { data, error } = await supabase
          .from('guestbook')
          .insert([messageData])
          .select()
          .single();
          
        if (error) throw error;
        
        setMessages([data, ...messages]);
      }

      setNewMessage("");
      setUserMessage(newMessage);
      setIsMsgExists(true);
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkUsernameExists = async (nickname) => {
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .eq('username', nickname)
      .single();
      
    return !!data;
  };

  const getUserData = async (nickname) => {
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .eq('username', nickname)
      .single();
      
    return data || null;
  };

  const UpdateMessages = ({ userToExclude }) => {
    const filteredMessages = messages.filter(msg => msg.username !== userToExclude);

    return (
      <>
        {filteredMessages.map((msg, index) => {
          const date = new Date(msg.created_at);
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
      const { error } = await supabase
        .from('guestbook')
        .delete()
        .eq('username', username);
        
      if (error) throw error;
      
      setMessages(messages.filter(msg => msg.username !== username));
      setUserMessage(null);
      setIsMsgExists(false);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
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
