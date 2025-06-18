require('dotenv').config({ path: './src/.env' });

const express = require("express");
const authRoutes = require("./routes/authRoutes");
const db = require("./db/db")
const app = express();

app.use(express.json());

app.use((req, _res, next) => {
    req.db = db;
    next();
});

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});