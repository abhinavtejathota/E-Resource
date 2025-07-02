const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

//all users
app.get("/api/users", (req, res) => {
  db.query("Select * from users", (err, results) => {
    if (err) {
      console.error("SQL Error:", err.message);
      res.status(500).send({ message: "Error fetching users" });
    } else {
      res.status(200).json(results);
    }
  });
});

//all products
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

//all admins
app.get("/api/admins", (req, res) => {
  db.query("Select * from admins", (err, results) => {
    if (err) {
      console.error("SQL Error:", err.message);
      res.status(500).send({ message: "Error fetching users" });
    } else {
      res.status(200).json(results);
    }
  });
});

//reservation
app.post("/api/reservations", async (req, res) => {
  const { user_id, date, time, total_cost, selectedTables, selectedProducts } =
    req.body;

  const connection = await db.getConnection(); // Get a DB connection from pool
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

//all tables
app.get("/api/tables", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tables");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching tables:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//signup
app.post("/api/signup", (req, res) => {
  const { name, email, phone, password, birthday } = req.body;

  const checkQuery = `
    SELECT email FROM users WHERE email = ? OR name = ?
    UNION
    SELECT email FROM admins WHERE email = ? OR username = ?
  `;

  db.query(checkQuery, [email, name, email, name], (err, result) => {
    if (err) {
      console.error("Signup DB Error:", err);
      return res.status(500).json({ error: err.message });
    }

    if (result.length > 0) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const insertQuery = `
      INSERT INTO users(name, email, phone, password, birthday)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [name, email, phone, password, birthday],
      (err, result) => {
        if (err) {
          console.error("Signup Insert Error:", err);
          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
          message: "User signed up successfully",
          userId: result.insertId,
        });
      }
    );
  });
});

//login
app.post("/api/login", (req, res) => {
  const { emailOrUsername, password } = req.body;

  const adminQuery = `
    SELECT * FROM admins
    WHERE (username = ? OR email = ?) AND password = ?
  `;

  db.query(
    adminQuery,
    [emailOrUsername, emailOrUsername, password],
    (err, adminResult) => {
      if (err) return res.status(500).json({ error: err.message });

      if (adminResult.length > 0) {
        return res.status(200).json({ role: "admin", admin: adminResult[0] });
      }

      const userQuery = `
      SELECT * FROM users
      WHERE (name = ? OR email = ?) AND password = ?
    `;

      db.query(
        userQuery,
        [emailOrUsername, emailOrUsername, password],
        (err, userResult) => {
          if (err) return res.status(500).json({ error: err.message });

          if (userResult.length > 0) {
            return res.status(200).json({ role: "user", user: userResult[0] });
          } else {
            return res.status(401).json({ message: "Invalid credentials" });
          }
        }
      );
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
