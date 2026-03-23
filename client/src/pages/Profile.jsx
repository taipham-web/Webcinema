import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllProgress, getWatchlist } from "../services/movieService";
import MovieCard from "../components/MovieCard";
import "../styles/Profile.css";

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [historyRecords, setHistoryRecords] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  
  // States cho chỉnh sửa
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Lấy dữ liệu lịch sử xem phim TRỰC TIẾP TỪ DATABASE
    const fetchHistory = async () => {
      try {
        const data = await getAllProgress();
        setHistoryRecords(data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchWatchlist = async () => {
      try {
        const data = await getWatchlist(user._id);
        setWatchlist(data);
      } catch (err) {
        console.error("Failed to fetch watchlist", err);
      } finally {
        setLoadingWatchlist(false);
      }
    };

    if (user) {
      fetchHistory();
      fetchWatchlist();
    }
  }, [user]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleUpdate = async (field, overrideValue = null) => {
    let data = {};
    if (field === 'premium') data.isPremium = true;
    else if (field === 'avatar') data.avatar = overrideValue;
    else data = { email, phone };

    const res = await updateProfile(data);
    
    if (res.success) {
      setMessage({ type: "success", text: "Cập nhật thành công!" });
      setIsEditingEmail(false);
      setIsEditingPhone(false);
    } else {
      setMessage({ type: "error", text: res.message || "Cập nhật thất bại." });
    }
    
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleChangeAvatar = () => {
    const newAvatar = window.prompt("Nhập URL/Link đường dẫn ảnh mới của bạn:", user?.avatar || "");
    if (newAvatar !== null && newAvatar.trim() !== "") {
      handleUpdate('avatar', newAvatar.trim());
    }
  };

  return (
    <div className="profile-dashboard">
      <div className="profile-glass-container">
        
        {/* HEADER AREA */}
        <div className="profile-header">
          <div className="profile-avatar-super" onClick={handleChangeAvatar} title="Đổi ảnh đại diện">
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"} 
              alt="User Avatar" 
              onError={(e) => e.target.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"}
            />
            <div className="avatar-edit-overlay">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </div>
          </div>
          
          <div className="profile-title-area">
            <h1 className="profile-name">
              {user.username} 
              {user.isPremium && <span className="premium-tag">PREMIUM</span>}
            </h1>
            <p className="profile-email">{user.email || "Chưa cập nhật email"}</p>
            {message.text && (
              <div className={`profile-message ${message.type}`}>
                {message.text}
              </div>
            )}
            <div className="profile-stats">
              <span><strong>{historyRecords.length}</strong> Phim đã xem</span>
              {user.createdAt && (
                <span><strong>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</strong> Tham gia</span>
              )}
            </div>
          </div>
        </div>

        {/* INFO GRIDS */}
        <div className="profile-grids">
          {/* Card 1 */}
          <div className="profile-card">
            <h3 className="card-title">Cài đặt tài khoản</h3>
            <div className="card-row">
              <span>Email đăng nhập</span>
              {isEditingEmail ? (
                <div className="edit-input-group">
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email mới"
                  />
                  <button className="save-btn" onClick={() => handleUpdate('email')}>Lưu</button>
                  <button className="cancel-btn" onClick={() => setIsEditingEmail(false)}>Hủy</button>
                </div>
              ) : (
                <button onClick={() => setIsEditingEmail(true)}>{user.email || "Thêm email"}</button>
              )}
            </div>
            <div className="card-row">
              <span>Số điện thoại</span>
              {isEditingPhone ? (
                <div className="edit-input-group">
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                  <button className="save-btn" onClick={() => handleUpdate('phone')}>Lưu</button>
                  <button className="cancel-btn" onClick={() => setIsEditingPhone(false)}>Hủy</button>
                </div>
              ) : (
                <button onClick={() => setIsEditingPhone(true)}>{user.phone || "Thêm số"}</button>
              )}
            </div>
            <div className="card-row">
              <span>Mật khẩu</span>
              <button>Thay đổi</button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="profile-card">
            <h3 className="card-title">Gói dịch vụ & Thanh toán</h3>
            <div className="plan-showcase">
              <h2>{user.isPremium ? "4K Ultra HD" : "Gói Miễn phí"}</h2>
              <p>{user.isPremium ? "Chất lượng hình ảnh và âm thanh độc quyền cao nhất." : "Nâng cấp để xem phim chất lượng 4K và không quảng cáo."}</p>
            </div>
            {!user.isPremium && (
              <button className="btn-upgrade-now" onClick={() => handleUpdate('premium')}>
                Nâng cấp lên PREMIUM ngay
              </button>
            )}
            <div className="card-row" style={{marginTop: "15px"}}>
              <span style={{display: "flex", alignItems: "center", gap: "10px"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                Visa kết thúc bằng •••• 4242
              </span>
            </div>
            <button className="btn-upgrade">Quản lý thanh toán</button>
          </div>
        </div>

        {/* WATCHLIST */}
        <div className="profile-history">
          <div className="history-header">
            <h3 className="card-title" style={{marginBottom: 0}}>Danh sách của tôi</h3>
            <button>Xem tất cả</button>
          </div>
          
          <div className="history-grid" style={{ overflow: 'visible' }}>
            {loadingWatchlist ? (
              <p style={{ color: "#737373" }}>Đang tải danh sách...</p>
            ) : watchlist.length > 0 ? (
              watchlist.map(movie => (
                <MovieCard key={movie._id} movie={movie} />
              ))
            ) : (
              <p style={{ color: "#737373" }}>Bạn chưa thêm bộ phim nào vào danh sách của tôi.</p>
            )}
          </div>
        </div>

        {/* WATCH HISTORY */}
        <div className="profile-history">
          <div className="history-header">
            <h3 className="card-title" style={{marginBottom: 0}}>Tiếp tục xem</h3>
            <button>Xem tất cả</button>
          </div>
          
          <div className="history-grid" style={{ overflow: 'visible' }}>
            {loading ? (
              <p style={{ color: "#737373" }}>Đang tải lịch sử xem...</p>
            ) : historyRecords.length > 0 ? (
              historyRecords.map(record => {
                if (!record.movieId) return null; // Nếu phim đã bị xoá khỏi db
                return <MovieCard key={record._id} movie={record.movieId} />;
              })
            ) : (
              <p style={{ color: "#737373" }}>Bạn chưa đăng nhập xem bộ phim nào.</p>
            )}
          </div>
        </div>

        {/* LOGOUT */}
        <div className="btn-logout-zone">
          <button className="btn-danger-outline" onClick={handleLogout}>
            Đăng xuất khỏi mọi thiết bị
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
