import React, { useState, useEffect } from "react";
import classes from "./Login.module.css";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";

const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const options = {
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    position: toast.POSITION.TOP_LEFT,
    theme: "dark",
  };

  useEffect(()=>{
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formValidation = () => {
    const { username, password } = values;
    if (username.length === 0) {
      toast.error("Email and Password is required.", options);
      return false;
    } else if (password.length === 0) {
      toast.error("Email and Password is required.", options);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formValidation()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, options);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.logo}>
          <img src={Logo} alt="Logo"></img>
          <h1>UniChatter</h1>
        </div>
        <input
          className={classes.input}
          type="text"
          placeholder="Username"
          name="username"
          onChange={handleChange}
        />
        <input
          className={classes.input}
          type="text"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />
        <button type="submit" className={classes.button}>
          Log In
        </button>
        <span className={classes.gotoLogin}>
          Don't have an account? <Link to="/register">Create one.</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};
export default Login;
