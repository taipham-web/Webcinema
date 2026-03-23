import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";
import "../styles/Navbar-Auth.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🎬</span> CinemaWeb
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/">Trang chủ</Link>
          </li>
          <li>
            <Link to="/movies">Phim lẻ</Link>
          </li>
          <li>
            <Link to="/series">Phim bộ</Link>
          </li>
          <li>
            <Link to="/latest">Mới nhất</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <Link to="/search" className="nav-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </Link>
        
        {user ? (
          <div className="user-menu">
            <div className="nav-icon profile-icon">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"} 
                alt="Profile" 
                onError={(e) => e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"}
              />
            </div>
            <div className="dropdown">
               <span className="dropdown-username">Xin chào, {user.username}</span>
               <Link to="/profile" className="dropdown-link" style={{ display: 'block', margin: '10px 0', color: 'white', textDecoration: 'none', fontSize: '15px' }}>Tài khoản</Link>
               <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-login-sm">Đăng nhập</Link>
            <Link to="/register" className="btn btn-register-sm">Đăng ký</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
