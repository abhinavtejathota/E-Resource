import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PaymentPage() {
  const [data, setData] = useState(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const reservation = JSON.parse(localStorage.getItem("reservation"));
    setData(reservation);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/products`
    );
    setProducts(data);
  };

  const handleConfirm = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        alert("User not logged in.");
        return;
      }

      const date = new Date().toISOString().split("T")[0];
      const time = new Date().toTimeString().split(" ")[0];

      await axios.post(`${process.env.REACT_APP_API_URL}/api/reservations`, {
        user_id: userId,
        date,
        time,
        total_cost: data.totalCost,
        selectedTables: data.selectedTables,
        selectedProducts: data.selectedProducts,
      });

      alert("Reservation Confirmed!");
      localStorage.removeItem("reservation");
      navigate("/confirm");
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Failed to book. Try again.");
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">
          💳 Payment Summary
        </h1>

        <div className="mb-6 text-lg text-gray-700">
          <p className="mb-2">
            <strong>Tables:</strong> {data.selectedTables.join(", ")}
          </p>
          <p>
            <strong>Total Cost:</strong> ₹{data.totalCost.toFixed(2)}
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          🧾 Items Selected
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-gray-800">
          {Object.entries(data.selectedProducts).map(
            ([productId, quantity]) => {
              const product = products.find(
                (p) => p.product_id === Number(productId)
              );
              return (
                <div
                  key={productId}
                  className="p-4 bg-gray-50 rounded-lg shadow border"
                >
                  <p className="font-medium">
                    {product?.product_name || "Item"}
                  </p>
                  <p className="text-sm">
                    Qty: {quantity} × ₹{product?.price} = ₹
                    {(product?.price * quantity).toFixed(2)}
                  </p>
                </div>
              );
            }
          )}
        </div>

        <div className="text-center">
          <button
            onClick={handleConfirm}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-lg transition"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
