import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [credentials, setCredentials] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        process.env.REACT_APP_API_URL + "/api/login",
        credentials
      );
      const { role } = res.data;

      if (role === "admin") navigate("/homeadmin");
      else if (role === "user") navigate("/homeuser");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="rounded-xl shadow-md p-8 w-full max-w-md"
          style={{ backgroundColor: "#ffebcd" }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-[#5a3825]">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="emailOrUsername"
              placeholder="Email or Username"
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
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              Log In
            </button>
            <br></br>
            <div className="text-sm text-center mt-4">
              Already registered?{" "}
              <span
                onClick={() => navigate("/")}
                className="text-blue-700 underline hover:text-blue-900 cursor-pointer"
              >
                ← Back to Home
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

export default Login;
