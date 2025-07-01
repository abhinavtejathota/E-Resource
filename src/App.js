import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import HomeUser from "./Pages/HomeUser";
import HomeAdmin from "./Pages/HomeAdmin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homeuser" element={<HomeUser />} />
        <Route path="/homeadmin" element={<HomeAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
