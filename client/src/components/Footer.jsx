import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <span>🎬</span> CinemaWeb
        </div>
        <p>Được xây dựng với 💖 dành cho những người yêu phim, mang đến trải nghiệm điện ảnh tuyệt vời nhất ngay tại nhà.</p>
        <div className="footer-links">
          <a href="#">Về chúng tôi</a>
          <a href="#">Liên hệ</a>
          <a href="#">Điều khoản sử dụng</a>
          <a href="#">Quyền riêng tư</a>
          <a href="#">Trung tâm trợ giúp</a>
        </div>
        <div className="footer-social">
          <a href="#" className="social-icon">Facebook</a>
          <a href="#" className="social-icon">Instagram</a>
          <a href="#" className="social-icon">Twitter</a>
          <a href="#" className="social-icon">YouTube</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CinemaWeb. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
