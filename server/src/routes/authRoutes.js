const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Endpoint: POST /api/auth/register
router.post("/register", registerUser);

// Endpoint: POST /api/auth/login
router.post("/login", loginUser);

// Cập nhật profile (Email, Phone, Mua Premium)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
