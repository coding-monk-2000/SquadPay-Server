import express from "express";
import {
  register,
  login,
  protectedRoute,
} from "../controllers/authController.js";
import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", (req, res) => register(req, res, req.db));
router.post("/login", (req, res) => login(req, res, req.db));
router.get("/protected", authenticate, (req, res) => protectedRoute(req, res));

export default router;
