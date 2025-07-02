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
        <h2 className="text-xl font-semibold text-green-700">
          Haven DineMaster
        </h2>
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

      {/* Main Section */}
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-72px)] p-8 gap-10">
        {/* Left: Text */}
        <div className="flex-1 flex flex-col justify-center items-start">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-700 text-lg mb-6">
            Planning a visit? Click below to reserve your table with ease.
          </p>
          <button
            onClick={() => navigate("/book-table")}
            className="bg-green-600 text-white text-lg px-6 py-3 rounded-full shadow hover:bg-green-700 transition"
          >
            Reserve a Table →
          </button>
        </div>

        {/* Right: Image */}
        <div className="flex-1 flex flex-col justify-center items-start">
          <img
            src="/Tables.jpg"
            alt="Restaurant"
            className="w-full rounded-2xl shadow-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default HomeUser;
