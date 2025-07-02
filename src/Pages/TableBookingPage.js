import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TableBookingPage() {
  const [tables, setTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [mode, setMode] = useState("individual");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
    fetchProducts();
  }, []);

  const fetchTables = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/tables`);
    setTables(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/products`
    );
    setProducts(res.data);
  };

  const toggleTable = (table_id) => {
    if (tables.find((t) => t.table_id === table_id).is_reserved) return;

    if (mode === "individual") {
      setSelectedTables([table_id]);
    } else {
      // Party mode: max 4 selections
      if (!selectedTables.includes(table_id) && selectedTables.length >= 4) {
        alert("You can select up to 4 tables for a party.");
        return;
      }
      setSelectedTables((prev) =>
        prev.includes(table_id)
          ? prev.filter((id) => id !== table_id)
          : [...prev, table_id]
      );
    }
  };

  const handleProductChange = (product_id, quantity) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [product_id]: quantity,
    }));
  };

  const handleBACK = () => {
    navigate("/homeuser");
  };

  const handleBook = () => {
    const totalCost = Object.entries(selectedProducts).reduce(
      (acc, [id, qty]) => {
        const product = products.find((p) => p.product_id === Number(id));
        return acc + product.price * qty;
      },
      0
    );

    localStorage.setItem(
      "reservation",
      JSON.stringify({
        selectedTables,
        selectedProducts,
        totalCost,
      })
    );
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
          🍽️ Reserve Your Table
        </h1>

        <div className="flex justify-center gap-8 mb-6">
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <input
              type="radio"
              checked={mode === "individual"}
              onChange={() => setMode("individual")}
              className="accent-blue-600"
            />
            Individual
          </label>
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <input
              type="radio"
              checked={mode === "party"}
              onChange={() => setMode("party")}
              className="accent-purple-600"
            />
            Party (2–4 Tables)
          </label>
        </div>

        <div className="mb-4 text-center text-gray-600">
          <span className="bg-green-400 px-3 py-1 rounded text-white mr-2">
            Green = Reserved
          </span>
          <span className="bg-blue-100 px-3 py-1 rounded text-blue-800 mr-2">
            Blue = Selected
          </span>
          <span className="border px-3 py-1 rounded">White = Available</span>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tables.map((table) => {
            const isSelected = selectedTables.includes(table.table_id);
            const isReserved = table.is_reserved;

            return (
              <div
                key={table.table_id}
                className={`w-24 h-24 flex flex-col justify-center items-center rounded-full text-sm font-semibold shadow transition cursor-pointer border-2
                  ${
                    isReserved
                      ? "bg-green-400 text-white border-green-600 pointer-events-none"
                      : isSelected
                      ? "bg-blue-100 border-blue-600"
                      : "bg-white border-gray-300 hover:bg-blue-50"
                  }`}
                onClick={() => toggleTable(table.table_id)}
              >
                Table {table.table_id}
                <span className="text-xs text-gray-600">
                  Cap: {table.capacity}
                </span>
              </div>
            );
          })}
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-blue-700 text-center">
          🧾 Select Items
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {products.map((product) => (
            <div
              key={product.product_id}
              className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition"
            >
              <p className="font-semibold text-lg text-gray-800">
                {product.product_name}
              </p>
              <p className="text-gray-600">
                ₹{product.price} | Popularity: {product.times_selected || 0}
              </p>
              <input
                type="number"
                min={0}
                className="mt-3 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedProducts[product.product_id] || ""}
                onChange={(e) =>
                  handleProductChange(
                    product.product_id,
                    Number(e.target.value)
                  )
                }
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            onClick={handleBook}
            disabled={selectedTables.length === 0}
          >
            Confirm Booking
          </button>
        </div>
        <button
          onClick={handleBACK}
          className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-full shadow transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default TableBookingPage;
