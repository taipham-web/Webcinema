const express = require("express");
const router = express.Router();
const { getMovies, searchMovies, getMovieById, getGenres, addMovie } = require("../controllers/movieController");
const { protect } = require("../middleware/authMiddleware");

// QUAN TRỌNG: /search và /genres phải đặt TRƯỚC /:id
router.get("/search", protect, searchMovies);
router.get("/genres", protect, getGenres);

router.get("/", protect, getMovies);
router.get("/:id", protect, getMovieById);
router.post("/", protect, addMovie);

module.exports = router;
