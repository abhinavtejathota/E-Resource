import React, { useEffect, useState } from "react";
import axios from "axios";

function TableBookingPage() {
  const [tables, setTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [mode, setMode] = useState("individual");

  useEffect(() => {
    fetchTables();
    fetchProducts();
  }, []);

  const fetchTables = async () => {
    const res = await axios.get("/api/tables");
    setTables(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get("/api/products");
    setProducts(res.data);
  };

  const toggleTable = (table_id) => {
    if (tables.find((t) => t.table_id === table_id).is_reserved) return;
    if (mode === "individual") {
      setSelectedTables([table_id]);
    } else {
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

  const handleBook = () => {
    const totalCost = Object.entries(selectedProducts).reduce(
      (acc, [id, qty]) => {
        const product = products.find((p) => p.product_id == id);
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reserve Your Table</h1>

      <div className="mb-4 flex items-center gap-4">
        <label>
          <input
            type="radio"
            checked={mode === "individual"}
            onChange={() => setMode("individual")}
          />{" "}
          Individual
        </label>
        <label>
          <input
            type="radio"
            checked={mode === "party"}
            onChange={() => setMode("party")}
          />{" "}
          Party (2-4 Tables)
        </label>
      </div>

      <div className="mb-4">
        <p>
          <span className="bg-green-400 px-2">Green</span> = Reserved |{" "}
          <span className="border px-2">Blank</span> = Available
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {tables.map((table) => (
          <div
            key={table.table_id}
            className={`p-4 border rounded cursor-pointer text-center ${
              table.is_reserved
                ? "bg-green-400 pointer-events-none"
                : selectedTables.includes(table.table_id)
                ? "bg-blue-200"
                : ""
            }`}
            onClick={() => toggleTable(table.table_id)}
          >
            Table {table.table_id} <br /> Capacity: {table.capacity}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">Select Items</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {products.map((product) => (
          <div key={product.product_id} className="border p-3 rounded">
            <p className="font-medium">{product.product_name}</p>
            <p>
              ₹{product.price} | Popularity: {product.times_selected || 0}
            </p>
            <input
              type="number"
              min={0}
              className="mt-2 w-full border rounded px-2 py-1"
              value={selectedProducts[product.product_id] || ""}
              onChange={(e) =>
                handleProductChange(product.product_id, Number(e.target.value))
              }
            />
          </div>
        ))}
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleBook}
        disabled={selectedTables.length === 0}
      >
        Book
      </button>
    </div>
  );
}

export default TableBookingPage;
