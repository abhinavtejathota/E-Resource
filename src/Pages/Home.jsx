import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <nav className="shadow-md p-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <img src="/Haven.png" alt="Logo" className="h-10 w-20 ms-4" />
          <img src="/Alco.png" alt="Logo" className="h-10 w-10" />
          <span className="font-bold text-xl text-red-900">DineMaster</span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-6">
          <a href="#home" className="text-gray-700 hover:text-yellow-500">
            Home
          </a>
          <a href="#about" className="text-gray-700 hover:text-yellow-500">
            About Us
          </a>
          <a href="#contact" className="text-gray-700 hover:text-yellow-500">
            Contact
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => navigate("/signup")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Home Section */}
      <section id="home" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between">
          {/* Left: Text */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome to Our Restaurant
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Book your table with ease and enjoy a great dining experience!
            </p>
          </div>

          {/* Right: Image */}
          <div className="md:w-1/2 mb-6 md:mb-0">
            <img
              src="Restaurant.jpg"
              alt="Restaurant Interior"
              className="w-full max-w-md mx-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          {/* Left: Image */}
          <div className="md:w-1/2 mb-6 md:mb-0">
            <img
              src="/Food.jpg"
              alt="About Us"
              className="w-full max-w-md mx-auto rounded-lg shadow-md"
            />
          </div>

          {/* Right: Text */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-semibold text-gray-800">About Us</h2>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto md:mx-0">
              We are passionate about bringing you delicious food and
              exceptional service.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="text-center py-20 bg-gray-100">
        <h2 className="text-3xl font-semibold text-gray-800">Contact</h2>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          You can reach us at: contact@restaurant.com or call us at 123-456-7890
        </p>
      </section>
    </div>
  );
};

export default Home;
