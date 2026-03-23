const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

// POST /api/watchlist/add
router.post('/add', async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    // Tìm user và thêm movieId vào mảng watchlist (dùng $addToSet để tránh trùng lặp)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { watchlist: movieId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json({ message: 'Đã thêm phim vào danh sách theo dõi', watchlist: updatedUser.watchlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST /api/watchlist/remove
router.post('/remove', async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { watchlist: movieId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json({ message: 'Đã xóa phim khỏi danh sách', watchlist: updatedUser.watchlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /api/watchlist/:userId/ids
router.get('/:userId/ids', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('watchlist');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.status(200).json(user.watchlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /api/watchlist/:userId
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('watchlist');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    // Trả về mảng danh sách phim đã populate chi tiết
    res.status(200).json(user.watchlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;