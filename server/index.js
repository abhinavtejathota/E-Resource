const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db"); // db is pool.promise()

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM users");
    console.log("Users found:", results.length);
    res.status(200).json(results);
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Get all admins
app.get("/api/admins", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM admins");
    res.status(200).json(results);
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ message: "Error fetching admins" });
  }
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM products ORDER BY times_selected DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all tables
app.get("/api/tables", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tables");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching tables:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Signup
app.post("/api/signup", async (req, res) => {
  const { name, email, phone, password, birthday } = req.body;

  const checkQuery = `
    SELECT email FROM users WHERE email = ? OR name = ?
    UNION
    SELECT email FROM admins WHERE email = ? OR username = ?
  `;

  try {
    const [checkResult] = await db.query(checkQuery, [
      email,
      name,
      email,
      name,
    ]);

    if (checkResult.length > 0) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const insertQuery = `
      INSERT INTO users(name, email, phone, password, birthday)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [insertResult] = await db.query(insertQuery, [
      name,
      email,
      phone,
      password,
      birthday,
    ]);

    res.status(201).json({
      message: "User signed up successfully",
      userId: insertResult.insertId,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get a single user by ID
app.get("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [
      userId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const [adminResult] = await db.query(
      `SELECT * FROM admins WHERE (username = ? OR email = ?) AND password = ?`,
      [emailOrUsername, emailOrUsername, password]
    );

    if (adminResult.length > 0) {
      return res.status(200).json({ role: "admin", admin: adminResult[0] });
    }

    const [userResult] = await db.query(
      `SELECT * FROM users WHERE (name = ? OR email = ?) AND password = ?`,
      [emailOrUsername, emailOrUsername, password]
    );

    if (userResult.length > 0) {
      return res.status(200).json({ role: "user", user: userResult[0] });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Get all reservations
app.get("/api/reservations", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM reservations");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Reservation
app.post("/api/reservations", async (req, res) => {
  const { user_id, date, time, total_cost, selectedTables, selectedProducts } =
    req.body;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const [reservationResult] = await connection.query(
      `INSERT INTO reservations (user_id, date, time, total_cost) VALUES (?, ?, ?, ?)`,
      [user_id, date, time, total_cost]
    );

    const reservation_id = reservationResult.insertId;

    for (const table_id of selectedTables) {
      await connection.query(
        `INSERT INTO reservation_tables (reservation_id, table_id) VALUES (?, ?)`,
        [reservation_id, table_id]
      );

      await connection.query(
        `UPDATE tables SET is_reserved = 1, reservation_id = ? WHERE table_id = ?`,
        [reservation_id, table_id]
      );
    }

    for (const [product_id, quantity] of Object.entries(selectedProducts)) {
      await connection.query(
        `INSERT INTO reservation_items (reservation_id, product_id, quantity) VALUES (?, ?, ?)`,
        [reservation_id, product_id, quantity]
      );

      await connection.query(
        `UPDATE products SET times_selected = COALESCE(times_selected, 0) + ? WHERE product_id = ?`,
        [quantity, product_id]
      );
    }

    await connection.commit();
    connection.release();
    res.status(201).json({ message: "Reservation successful", reservation_id });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("Reservation failed:", err);
    res.status(500).json({ error: "Reservation failed. Try again." });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
