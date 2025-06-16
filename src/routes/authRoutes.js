const express = require("express");
const { register, login, protectedRoute, reset, resetPassword } = require("../controllers/authController");
const {authenticate, authenticatePasswordResetLink} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", (req, res) => register(req, res, req.db));
router.post("/login", (req, res) => login(req, res, req.db));
router.post("/reset", (req, res) => reset(req, res, req.db));
router.post("/reset-password/:userId/:token", authenticatePasswordResetLink, (req, res) => resetPassword(req, res, req.db));
router.get("/protected", authenticate, (req, res) => protectedRoute(req, res));

module.exports = router;
