const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    isPremium: { type: Boolean, default: false },
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
}, { timestamps: true }); 
// timestamps: true tự động tạo trường createdAt và updatedAt

module.exports = mongoose.model('User', userSchema);