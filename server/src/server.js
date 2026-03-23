const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Kết nối với cơ sở dữ liệu MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Chào mừng đến CinemaWeb API" });
});

// Gọi các Routes đã tạo (Lưu ý: API cho Client thường có chữ /api/)
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const progressRoutes = require('./routes/progressRoutes');
const watchListRoutes = require('./routes/watchList');

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/watchlist', watchListRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Có lỗi xảy ra!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại port ${PORT}`);
});
