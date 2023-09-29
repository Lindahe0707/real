import React from "react";
import classes from "./Logout.module.css";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const Logout = () => {
  const nagivate = useNavigate();
  const handleClick = async () => {
    localStorage.clear();
    nagivate("/login");
  };
  return (
    <button className={classes.button} onClick = {handleClick}>
      <FiLogOut />
    </button>
  );
};

export default Logout;
