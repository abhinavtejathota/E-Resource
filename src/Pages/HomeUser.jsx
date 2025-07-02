import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function HomeUser() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/login");
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`)
      .then((res) => {
        setUserName(res.data.name);
      })
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white shadow">
        <h2 className="text-xl font-semibold text-green-700">Restaurant App</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">👤 {userName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center justify-center mt-20">
        <h1 className="text-3xl font-bold text-green-800">
          Welcome, {userName}!
        </h1>
        <p className="mt-2 text-gray-700">
          You are now logged in as a regular user.
        </p>
        <button
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          onClick={() => navigate("/book-table")}
        >
          Reserve Table →
        </button>
      </div>
    </div>
  );
}

export default HomeUser;
