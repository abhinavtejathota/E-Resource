// ConfirmPage.js
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Reservation Confirmed!
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you for booking with us. We look forward to serving you!
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Book Another Table
          </button>

          <button
            onClick={handleHome}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPage;
