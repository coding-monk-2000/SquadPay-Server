import "./src/config.js";

import express from "express";
import router from "./src/routes/authRoutes.js";
import db from "./src/db/db.js"

const app = express();

app.use(express.json());

app.use((req, _res, next) => {
    req.db = db;
    next();
});

app.use("/api/auth", router);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});