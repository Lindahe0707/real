import React, { useEffect, useState } from "react";
import classes from "./SetAvatar.module.css";
import axios from "axios";
import loading from "../assets/loading1.gif";
import { Buffer } from "buffer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";

const SetAvatar = () => {
  const api = "https://api.multiavatar.com";
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatarId, setSelectedAvatarId] = useState(undefined);

  const options = {
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    position: toast.POSITION.TOP_LEFT,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = [];
      for (let i = 0; i < 3; i++) {
        const image = await axios.get(
          `${api}/${Math.floor(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectProfile = async () => {
    if (selectedAvatarId === undefined) {
      toast.error("Please select an avatar", options);
    } else {
      const user = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatarId],
      });
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", options);
      }
    }
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <div className={classes.container}>
          <img src={loading} alt = "loading" className={classes.loader} />
        </div>
      ) : (
        <div className={classes.container}>
          <div className={classes.title}>
            <h1>Pick an Avatar as your profile picture.</h1>
          </div>
          <div className={classes.avatars}>
            {avatars.map((avatar, idx) => {
              return (
                <div
                  key={idx}
                  className={
                    selectedAvatarId === idx
                      ? `${classes.avatar} ${classes.selected}`
                      : `${classes.avatar}`
                  }
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatarId(idx)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={handleSelectProfile} className={classes.button}>
            Set as Profile Picture
          </button>
          <ToastContainer />
        </div>
      )}
    </React.Fragment>
  );
};

export default SetAvatar;
