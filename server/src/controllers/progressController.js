const WatchProgress = require("../models/WatchProgress");

// @desc Lưu/Cập nhật tiến trình xem (số giây currentTime)
// @route POST /api/progress
// @access Private
const updateProgress = async (req, res) => {
  try {
    const { movieId, currentTime, isFinished } = req.body;
    const userId = req.user._id;

    // findOneAndUpdate kèm upsert: true
    // Ý nghĩa: Có sẵn trong bảng thì Update số giây. Chưa có thì Insert dòng Tiến trình mới.
    const progress = await WatchProgress.findOneAndUpdate(
      { userId, movieId },
      { userId, movieId, currentTime, isFinished },
      { new: true, upsert: true }
    );

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Lấy lại số thời gian xem dở lúc trước để React phát tiếp theo video tag
// @route GET /api/progress/:movieId
// @access Private
const getProgress = async (req, res) => {
  try {
    const progress = await WatchProgress.findOne({
      userId: req.user._id,
      movieId: req.params.movieId,
    });
    
    // Nếu có dữ liệu cũ thì trả về
    if (progress) {
      res.json(progress);
    } else {
      // Nếu là lần đầu hoặc bấm xem phim mới, số giây là 0
      res.json({ currentTime: 0, isFinished: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Lấy danh sách toàn bộ phim đã xem của User
// @route GET /api/progress
// @access Private
const getAllProgress = async (req, res) => {
  try {
    const list = await WatchProgress.find({ userId: req.user._id })
      .populate("movieId") // Nối với dữ liệu phim đầy đủ
      .sort({ updatedAt: -1 }); // Lấy phim mới xem nhất lên đầu
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProgress, getProgress, getAllProgress };
