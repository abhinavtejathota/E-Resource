import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    birthday: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(process.env.REACT_APP_API_URL + "/api/login", form);

      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-page">
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="rounded-xl shadow-md p-8 w-full max-w-md"
          style={{ backgroundColor: "#ffebcd" }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-[#5a3825]">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Username"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md"
            />
            <input
              type="date"
              name="birthday"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
            <div className="text-sm text-center mt-4">
              Already registered?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-700 underline hover:text-blue-900 cursor-pointer"
              >
                Go to Login →
              </span>
            </div>
          </form>
          {error && (
            <p className="text-red-500 mt-4 text-sm text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
