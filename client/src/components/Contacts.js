import React, { useState, useEffect, Fragment } from "react";
//import Logo from "../assets/logo.svg";
import classes from "./Contacts.module.css";

const Contacts = ({ contacts, changeChat }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelectedId, setCurrentSelectedId] = useState(undefined);
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    };
    fetchData();
  }, []);

  const handleSelectContact = (idx, contact) => {
    setCurrentSelectedId(idx);
    changeChat(contact);
  };

  return (
    <Fragment>
      {currentUserImage && currentUserName && (
        <div className={classes.container}>
          <div className={classes.contacts}>
            {contacts.map((contact, idx) => {
              return (
                <div
                  key={contact._id}
                  className={
                    idx === currentSelectedId
                      ? `${classes.contact} ${classes.selected}`
                      : `${classes.contact}`
                  }
                  onClick={() => {
                    handleSelectContact(idx, contact);
                  }}
                >
                  <div className={classes["contact-avatar"]}>
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt="avatar"
                    />
                  </div>
                  <div className={classes["contact-username"]}>
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={classes.currentUser}>
            <div className={classes["currentUser-avatar"]}>
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className={classes["currentUser-username"]}>
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Contacts;
