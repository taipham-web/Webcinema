const express = require("express");
const router = express.Router();
const { updateProgress, getProgress, getAllProgress } = require("../controllers/progressController");
const { protect } = require("../middleware/authMiddleware");

// Lấy danh sách phim đã xem (có populate thông tin phim)
router.get("/", protect, getAllProgress);

// Gửi currentTime lên để lưu
router.post("/", protect, updateProgress);

// Lấy currentTime trả về
router.get("/:movieId", protect, getProgress);

module.exports = router;
