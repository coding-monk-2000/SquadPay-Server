const express = require("express");
const { register, login, protectedRoute } = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", (req, res) => register(req, res, req.db));
router.post("/login", (req, res) => login(req, res, req.db));
router.get("/protected", authenticate, (req, res) => protectedRoute(req, res));

module.exports = router;
