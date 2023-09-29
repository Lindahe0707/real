import React from 'react';
import classes from './Dropdown.module.css';
import { useState } from 'react';
import { FaCaretDown } from "react-icons/fa";


const Dropdown = ({chooseLanguage}) => {
  const [selectedLanguage, setSelectedLanguage] = useState("English(default)");
  const handleSelect = (e) => {
    setSelectedLanguage(e.target.value);
    chooseLanguage(e.target.value);
  }
  return (
    <div className={classes.container}>
      <span className={classes.dropdown}>
        <button className={classes.dropbutton}>Preferred Language<FaCaretDown /></button>
        <div className={classes.languages}>
          <button onClick={handleSelect} value="English">
            English(default)
          </button>
          <button onClick={handleSelect} value="French">
            French
          </button>
          <button onClick={handleSelect} value="Spanish">
            Spanish
          </button>
        </div>
      </span>
      <span>{selectedLanguage}</span>
    </div>
  );
}
export default Dropdown;
