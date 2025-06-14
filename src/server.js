const express = require("express");
const authRoutes = require("./routes/authRoutes");
const {initDb} = require("./db/db")
const app = express();

app.use(express.json());
const db = initDb()

app.use((req, _res, next) => {
    req.db = db;
    next();
});

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});