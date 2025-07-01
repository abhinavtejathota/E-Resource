// client/src/pages/HomeAdmin.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function HomeAdmin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50">
      <h1 className="text-3xl font-bold text-yellow-800">Welcome, Admin!</h1>
      <p className="mt-2 text-gray-700">
        You are now logged in as an administrator.
      </p>
      <button
        className="mt-6 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>
    </div>
  );
}

export default HomeAdmin;
