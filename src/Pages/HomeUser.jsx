// client/src/pages/HomeUser.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function HomeUser() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-3xl font-bold text-green-800">Welcome, User!</h1>
      <p className="mt-2 text-gray-700">
        You are now logged in as a regular user.
      </p>
      <button
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        onClick={() => navigate("/book-table")}
      >
        Reserve Table →
      </button>
    </div>
  );
}

export default HomeUser;
