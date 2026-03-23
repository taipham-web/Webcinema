import React from "react";
import { useNavigate } from "react-router-dom";
// Import các thư viện thông báo
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/MovieCard.css";

import { useAuth } from "../context/AuthContext";
import { addToWatchlist, removeFromWatchlist } from "../services/movieService";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { user, watchlist, setWatchlist } = useAuth();
  
  // Kiểm tra xem phim này đã nằm trong mảng Theodõi của user chưa
  const isWatchlisted = watchlist?.includes(movie._id);

  const handleCardClick = () => {
    navigate(`/movie/${movie._id}`);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra thẻ phim cha
    navigate(`/movie/${movie._id}`);
  };

  const handleToggleWatchlist = async (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm phim vào danh sách theo dõi!");
      return;
    }

    try {
      if (isWatchlisted) {
        // Thực hiện xóa
        await removeFromWatchlist(user._id, movie._id);
        setWatchlist(prev => prev.filter(id => id !== movie._id));
        toast.info("Đã bỏ phim khỏi danh sách theo dõi.");
      } else {
        // Thực hiện thêm
        await addToWatchlist(user._id, movie._id);
        setWatchlist(prev => [...prev, movie._id]);
        toast.success("Đã thêm phim vào danh sách theo dõi!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      {/* Base Card Content */}
      <div className="movie-poster-container">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="movie-poster"
        />
        <div className="movie-info-base">
          <h3 className="movie-title-base">{movie.title}</h3>
        </div>
      </div>

      {/* Hover Card Content (Netflix Style) */}
      <div className="movie-card-hover">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="hover-poster"
        />

        <div className="hover-info">
          <div className="hover-buttons">
            <button className="btn-play" onClick={handlePlayClick}>
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="16"
                height="16"
              >
                <path d="M8 5v14l11-7z"></path>
              </svg>
              Xem ngay
            </button>
            <button
              className={`btn-details btn-add-watchlist ${isWatchlisted ? 'active' : ''}`}
              onClick={handleToggleWatchlist}
              title={isWatchlisted ? "Xóa khỏi danh sách theo dõi" : "Thêm vào danh sách theo dõi"}
            >
              <div className="icon-wrapper">
                {isWatchlisted ? (
                  // Dấu Check (Tick)
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="16"
                    height="16"
                    className="icon-tick"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  // Dấu Cộng (Plus)
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="16"
                    height="16"
                    className="icon-plus"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                )}
              </div>
            </button>
          </div>

          <div className="hover-meta">
            <span className="text-match">Phù hợp 98%</span>
            <span className="text-year">{movie.release_year}</span>
            <span className="text-duration">
              {movie.duration || "120 phút"}
            </span>
            <span className="text-quality">HD</span>
          </div>

          <p className="hover-desc">
            {movie.description
              ? movie.description
              : "Đang cập nhật nội dung..."}
          </p>

          <div className="movie-genres">
            <span className="mini-genre type-badge">
              {movie.type === "phim-bo" ? "Phim Bộ" : "Phim Lẻ"}
            </span>
            {movie.genres?.slice(0, 3).map((g) => (
              <span key={g} className="mini-genre">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
