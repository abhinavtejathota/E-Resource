import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomeAdmin() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    reservations: 0,
    tables: 0,
    products: 0,
  });

  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchTables();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, reservations, products, tables] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/users`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/reservations`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/products`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/tables`),
      ]);

      setStats({
        users: users.data.length,
        reservations: reservations.data.length,
        products: products.data.length,
        tables: tables.data.length,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchTables = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/tables`
      );
      setTables(res.data);
    } catch (err) {
      console.error("Failed to load tables:", err);
    }
  };

  const handleRemoveReservation = async (tableId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/tables/${tableId}/clear`
      );
      fetchTables(); // refresh after update
    } catch (err) {
      console.error("Failed to remove reservation:", err);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-800">Admin Dashboard</h1>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-2xl font-bold text-yellow-700">{stats.users}</p>
          <p className="text-gray-600">Users</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-2xl font-bold text-yellow-700">
            {stats.reservations}
          </p>
          <p className="text-gray-600">Reservations</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-2xl font-bold text-yellow-700">{stats.tables}</p>
          <p className="text-gray-600">Tables</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-2xl font-bold text-yellow-700">{stats.products}</p>
          <p className="text-gray-600">Products</p>
        </div>
      </div>

      {/* Tables Section */}
      <h2 className="text-2xl font-semibold text-yellow-800 mb-4">
        Table Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div
            key={table.table_id}
            className="bg-white p-4 rounded-xl shadow border hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg mb-2">
              Table #{table.table_id}
            </h3>
            <p className="text-gray-600 mb-1">Capacity: {table.capacity}</p>
            <p className="text-gray-600 mb-2">
              Status:{" "}
              {table.is_reserved ? (
                <span className="text-red-500 font-medium">Reserved</span>
              ) : (
                <span className="text-green-600 font-medium">Available</span>
              )}
            </p>
            {table.is_reserved && (
              <button
                onClick={() => handleRemoveReservation(table.table_id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Remove Reservation
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeAdmin;
