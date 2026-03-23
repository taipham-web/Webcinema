const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token từ header "Bearer [token]"
      token = req.headers.authorization.split(" ")[1];

      // Giải mã token để lấy id người dùng
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Gắn thông tin người dùng vào req để router tiếp theo có thể sử dụng (ngoại trừ password)
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Không có quyền truy cập, token không hợp lệ (hết hạn hoặc sai)." });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Không có quyền truy cập, không tìm thấy token." });
  }
};

module.exports = { protect };
