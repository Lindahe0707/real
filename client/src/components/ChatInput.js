import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import classes from "./ChatInput.module.css";
import Picker from "emoji-picker-react";

const ChatInput = ({ handleSendMsg }) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [messageToSend, setMessageToSend] = useState("");

  const handleEmojiShow = () => {
    setShowEmojis((showEmojis) => !showEmojis);
  };
  const handleEmojiClick = (event, emojiObject) => {
    setMessageToSend((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojis(false);
  };

  const sendChat = (event) => {
    event.preventDefault();

    if (messageToSend.length > 0) {
      handleSendMsg(messageToSend);
      setMessageToSend("");
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes["emoji-container"]}>
        <div className={classes.emoji}>
          <BsEmojiSmileFill onClick={handleEmojiShow} />
          {showEmojis && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form
        className={classes["input-container"]}
        onSubmit={(event) => {
          sendChat(event);
        }}
      >
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMessageToSend(e.target.value)}
          value={messageToSend}
        />
        <button type="submit" className={classes.button}>
          <IoMdSend />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
