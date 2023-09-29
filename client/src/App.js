import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from './pages/Register';
import Chat from './pages/Chat';
import Login from './pages/Login';
import SetAvatar from "./pages/SetAvatar";
// install axios react-router-dom style....

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path = "/setAvatar" element = {<SetAvatar />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;
