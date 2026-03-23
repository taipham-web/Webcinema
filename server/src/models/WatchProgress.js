const mongoose = require('mongoose');

const watchProgressSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    movieId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Movie', 
        required: true 
    },
    currentTime: { type: Number, default: 0 }, // Lưu số giây đang xem dở
    isFinished: { type: Boolean, default: false }
}, { timestamps: true });

// Tạo index gộp để đảm bảo 1 user chỉ có 1 tiến trình cho 1 bộ phim
watchProgressSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('WatchProgress', watchProgressSchema);