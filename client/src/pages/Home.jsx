import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchMovies } from "../services/movieService";
import MovieCard from "../components/MovieCard";
import "../styles/Home.css";

const MovieRow = ({ title, movies }) => {
  const [scrollAmount, setScrollAmount] = useState(0);

  const scroll = (direction) => {
    // Kích thước card khoảng 295px (280px width + 15px gap)
    const scrollStep = 800; // Khoảng cách trượt mỗi lần bấm
    setScrollAmount((prev) => {
      if (direction === "left") {
        return Math.max(0, prev - scrollStep);
      } else {
        const maxScroll = Math.max(0, movies.length * 295 - window.innerWidth + 100);
        return Math.min(maxScroll, prev + scrollStep);
      }
    });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="movie-row">
      <h2 className="movie-row-title">{title}</h2>
      <div className="slider-wrapper">
        {scrollAmount > 0 && (
          <button className="slider-btn left" onClick={() => scroll("left")}>
            ‹
          </button>
        )}
        <div 
          className="movie-row-container" 
          style={{ transform: `translateX(-${scrollAmount}px)` }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
        <button className="slider-btn right" onClick={() => scroll("right")}>
          ›
        </button>
      </div>
    </section>
  );
};

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovies = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchMovies();
        setMovies(data);
      } catch (err) {
        setError("Không thể tải danh sách phim. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [user]);

  // --- Phân nhóm phim theo thể loại ---
  const getMoviesByGenre = (genre) =>
    movies.filter((m) => m.genres && m.genres.includes(genre));

  const trending = movies.slice(0, 6); // Phim mới nhất làm Trending
  const actionMovies = getMoviesByGenre("Hành động");
  const scifiMovies = getMoviesByGenre("Khoa học viễn tưởng");
  const dramaMovies = getMoviesByGenre("Kịch tính");
  const heroMovie = movies[0] || null;

  // --- Hiển thị khi chưa đăng nhập ---
  if (!user) {
    return (
      <div className="home">
        <div className="hero hero-guest">
          <div className="hero-overlay"></div>
          <img
            className="hero-bg"
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Hero Background"
          />
          <div className="hero-content">
            <div className="hero-badge">ĐIỆN ẢNH ĐỈNH CAO</div>
            <h1 className="hero-title">Xem Phim Không Giới Hạn</h1>
            <p className="hero-description">
              Kho phim khổng lồ – Hành động, Viễn tưởng, Tâm lý, Hài hước.
              Tận hưởng trải nghiệm rạp phim ngay tại nhà bạn, bất cứ lúc nào, ở bất cứ đâu.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-play" onClick={() => navigate("/register")}>
                Đăng ký miễn phí
              </button>
              <button className="btn btn-info" onClick={() => navigate("/login")}>
                Đã có tài khoản? Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Hiển thị khi đang tải ---
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Đang tải phim...</p>
      </div>
    );
  }

  // --- Hiển thị lỗi ---
  if (error) {
    return (
      <div className="error-screen">
        <p>{error}</p>
        <button className="btn btn-play" onClick={() => window.location.reload()}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="home">
      {/* HERO */}
      <div className="hero">
        <div className="hero-overlay"></div>
        <img
          className="hero-bg"
          src={
            heroMovie?.poster_url ||
            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          }
          alt="Hero Background"
        />
        <div className="hero-content">
          <div className="hero-badge">NỔI BẬT TUẦN NÀY</div>
          <h1 className="hero-title">{heroMovie?.title || "CinemaWeb"}</h1>
          <p className="hero-description">
            {heroMovie?.description || "Chào mừng đến với CinemaWeb"}
          </p>
          {heroMovie && (
            <div className="hero-genre-tags">
              {heroMovie.genres?.map((g) => (
                <span key={g} className="genre-tag">{g}</span>
              ))}
            </div>
          )}
          <div className="hero-buttons">
            <button
              className="btn btn-play"
              onClick={() => heroMovie && navigate(`/movie/${heroMovie._id}`)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              <span>Phát ngay</span>
            </button>
            <button className="btn btn-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>Thông tin khác</span>
            </button>
          </div>
        </div>
      </div>

      {/* ROWS */}
      <div className="movie-sections">
        <MovieRow title="🔥 Phim Thịnh Hành" movies={trending} />
        <MovieRow title="💥 Hành Động Khói Lửa" movies={actionMovies} />
        <MovieRow title="🚀 Khoa Học Viễn Tưởng" movies={scifiMovies} />
        <MovieRow title="🎭 Kịch Tính Cao Trào" movies={dramaMovies} />

        {movies.length === 0 && (
          <div className="empty-state">
            <p>Chưa có phim nào trong cơ sở dữ liệu.</p>
            <p>Hãy chạy script seeder để thêm phim mẫu.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
