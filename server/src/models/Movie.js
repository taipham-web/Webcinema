const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    release_year: { type: Number },
    poster_url: { type: String },
    video_url: { type: String, required: true },
    duration: { type: Number }, // Tính bằng phút
    genres: [{ type: String }], // NHÚNG TRỰC TIẾP: mảng các chuỗi thể loại
    type: {
        type: String,
        enum: ['phim-le', 'phim-bo'],
        default: 'phim-le'
    } // phim-le: Phim lẻ, phim-bo: Phim bộ/Series
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);