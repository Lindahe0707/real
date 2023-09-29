import React, { useState, useEffect } from "react";
import classes from "./Welcome.module.css";
import Robot from "../assets/robot.gif";

const Welcome = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setUserName(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        ).username
      );
    };
    fetchData();
  }, []);

  return (
    <div className={classes.container}>
      <img src={Robot} alt="robot" />
      <h1>
        Welcome, <span>{userName}</span>
      </h1>
      <h3>Please select a Chat to Start messaging.</h3>
    </div>
  );
};

export default Welcome;
