const Movie = require("../models/Movie");

// @desc Lấy danh sách phim
// @route GET /api/movies
// @access Private
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({}).sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Tìm kiếm phim theo từ khóa và lọc theo thể loại, loại phim
// @route GET /api/movies/search?q=keyword&genre=Hành động&type=phim-le
// @access Private
const searchMovies = async (req, res) => {
  try {
    const { q, genre, type } = req.query;

    const filter = {};

    // Tìm theo từ khóa trong title (không phân biệt hoa/thường)
    if (q && q.trim() !== "") {
      filter.title = { $regex: q.trim(), $options: "i" };
    }

    // Lọc theo thể loại
    if (genre && genre !== "Tất cả") {
      filter.genres = { $in: [genre] };
    }

    // Lọc theo loại phim (phim-le / phim-bo)
    if (type && type !== "tat-ca") {
      filter.type = type;
    }

    const movies = await Movie.find(filter).sort({ release_year: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Lấy chi tiết 1 clip phim
// @route GET /api/movies/:id
// @access Private
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: "Không tìm thấy phim" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Lấy tất cả thể loại phim đang có
// @route GET /api/movies/genres
// @access Private
const getGenres = async (req, res) => {
  try {
    // Lấy danh sách genres không trùng lặp từ tất cả phim
    const genres = await Movie.distinct("genres");
    res.json(genres.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Thêm phim
// @route POST /api/movies
// @access Private
const addMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMovies, searchMovies, getMovieById, getGenres, addMovie };
