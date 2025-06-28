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

app.get("/api/products", (req, res) => {
  db.query("Select * from products", (err, results) => {
    if (err) {
      console.error("SQL Error:", err.message);
      res.status(500).send({ message: "Error fetching users" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post("/api/users", (req, res) => {
  const { name, email, phone, birthday } = req.body;
  db.query(
    "INSERT INTO users(name, email) VALUES (?, ?, ?, ?)",
    [name, email, phone, birthday],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      else
        res
          .status(201)
          .json({ message: "User added", userId: result.insertId });
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
