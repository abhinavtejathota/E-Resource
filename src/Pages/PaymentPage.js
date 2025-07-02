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

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Summary</h1>

      <div className="mb-4">
        <p>
          <strong>Tables:</strong> {data.selectedTables.join(", ")}
        </p>
        <p>
          <strong>Total Cost:</strong> ₹{data.totalCost.toFixed(2)}
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Items Selected</h2>
      <div className="mb-4">
        {Object.entries(data.selectedProducts).map(([productId, quantity]) => {
          const product = products.find(
            (p) => p.product_id === Number(productId)
          );
          return (
            <div key={productId}>
              {product?.product_name || "Item"} — Qty: {quantity}, ₹
              {product?.price * quantity}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleConfirm}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Confirm Booking
      </button>
    </div>
  );
}

export default PaymentPage;
