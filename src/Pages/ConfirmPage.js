import React from "react";
import { useNavigate } from "react-router-dom";

function ConfirmPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/book-table");
  };

  const handleHome = () => {
    navigate("/homeuser");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Reservation Confirmed!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for booking with us. We look forward to serving you!
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow transition"
          >
            Book Another Table
          </button>
          <button
            onClick={handleHome}
            className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-full shadow transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPage;
