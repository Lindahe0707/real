import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import classes from "./Chat.module.css";
import { allUsersRoute, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatBox from "../components/ChatBox";
import Logout from "../components/Logout";
import Dropdown from "../components/Dropdown";
import Logo from "../assets/logo.svg";
import { io } from "socket.io-client";

const Chat = () => {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [languageOption, setLanguageOption] = useState("English");
  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        const userData = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        setCurrentUser(userData);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser !== undefined) {
        // the first useEffect is async
        if (currentUser) {
          if (currentUser.isAvatarImageSet) {
            const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(data.data);
          } else {
            navigate("/setAvatar");
          }
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleChangeChat = (chat) => {
    setCurrentChat(chat);
  };

  const handleLanguageOption = (language) => {
    setLanguageOption(language);
  }

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <div className={classes.brand}>
          <img src={Logo} alt="logo" />
          <h3>UniChatter</h3>
        </div>
        <div className={classes.language}>
          <Dropdown chooseLanguage = {handleLanguageOption}/>
        </div>
        <div className={classes.logout}>
          <Logout />
        </div>
      </header>
      <div className={classes.contracts}>
        <Contacts contacts={contacts} changeChat={handleChangeChat} />
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatBox currentChat={currentChat} socket={socket} language = {languageOption} />
        )}
      </div>
    </div>
  );
};

export default Chat;
