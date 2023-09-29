import React, { useState} from "react";
import classes from "./Register.module.css";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emailValidation from "../utils/emailValidation";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";

const Register = () => {
  const navigate = useNavigate();

  const options = {
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    position: toast.POSITION.TOP_LEFT,
    theme: "dark",
  };

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;
    if (username.length < 3) {
      toast.error("Username must contain at least 3 letters.", options);
      return false;
    } else if (!emailValidation(email)) {
      toast.error("Invalid Email address.", options);
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password must contain at least 8 characters or numbers",
        options
      );
    } else if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same.", options);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, email, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });
      //console.log(data);
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
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />
        <input
          className={classes.input}
          type="text"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />
        <input
          className={classes.input}
          type="text"
          placeholder="Confirm Password"
          name="confirmPassword"
          onChange={handleChange}
        />
        <button type="submit" className={classes.button}>
          Create User
        </button>
        <span className={classes.gotoLogin}>
          Already have an account? <Link to="/login">Log in.</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
