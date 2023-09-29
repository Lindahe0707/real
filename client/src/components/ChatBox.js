import React, { useState, useEffect, useRef } from "react";
import classes from "./ChatBox.module.css";
import ChatInput from "./ChatInput";
import axios from "axios";
import { sendMessageRoute, receiveMessageRoute } from "../utils/APIRoutes";
import {
  translateSingleMessage,
  translateAllMessages,
} from "../utils/openAITranslate";
import { v4 as uuidv4 } from "uuid";

const ChatBox = ({ currentChat, socket, language }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(undefined);
  const scrollRef = useRef(null);

  const fetchMessages = async (lastMessageId, limit) => {
    setIsLoading(true);
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const response = await axios.post(receiveMessageRoute, {
      from: data._id,
      to: currentChat._id,
      lastMessageId,
      limit,
    });
    const allMsgs = await translateAllMessages(
      response.data.messages,
      language
    );

    setMessages((prev) => [...allMsgs, ...prev]);
    setLastMessageId(response.data.getLastMsgId);
    setIsLoading(false);
  };

  // initial fetch messages
  useEffect(() => {
    fetchMessages(lastMessageId, 8);
  }, [currentChat]);

  // load more messages
  const handleScroll = (event) => {
    const target = event.target;
    if (target.scrollTop === 0 && !isLoading) {
      fetchMessages(lastMessageId, 1);
    }
  };

  //translate messages when the user change the language setting
  useEffect(() => {
    const translateHistoricalMessages = async () => {
      const allMsgs = await translateAllMessages(messages, language);
      setMessages(allMsgs);
    };
    translateHistoricalMessages();
    // eslint-disable-next-line
  }, [language]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-message", {
      to: currentChat._id,
      from: data._id,
      message: msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
  };

  //handle received message
  useEffect(() => {
    if (socket.current) {
      const handleReceivedMessage = async (msg) => {
        const translation = await translateSingleMessage(msg, language);
        setArrivalMessage({ fromSelf: false, message: translation });
      };
      socket.current.on("receive-message", handleReceivedMessage);
      return () => {
        // eslint-disable-next-line
        socket.current.off("receive-message", handleReceivedMessage);
      };
    }
  }, [socket, language]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  //auto scroll to the bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.userDetails}>
          <div className={classes.avatar}>
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt="avatar"
            ></img>
          </div>
          <div className={classes.username}>
            <h3>{currentChat.username}</h3>
          </div>
        </div>
      </div>
      <div className={classes.messages} onScroll={handleScroll}>
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={
                  message.fromSelf
                    ? `${classes.message} ${classes.sended}`
                    : `${classes.message} ${classes.received}`
                }
              >
                <div className={classes.content}>{message.message}</div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
};

export default ChatBox;
