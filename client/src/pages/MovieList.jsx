import React, { useState, useEffect } from "react";
import { searchMovies } from "../services/movieService";
import MovieCard from "../components/MovieCard";
import "../styles/Search.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MovieList = ({ title, type }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await searchMovies("", "Tất cả", type);
        setMovies(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [type, user, navigate]);

  return (
    <div className="search-page">
      <div className="search-hero" style={{ padding: "40px 20px" }}>
        <h1 className="search-heading">{title}</h1>
        <p className="search-subheading">Danh sách toàn bộ {title.toLowerCase()} hiện có</p>
      </div>

      <div className="search-results">
        {loading ? (
          <div className="search-loading">
            <div className="spinner"></div>
            <p>Đang tải phim...</p>
          </div>
        ) : (
          <>
            <div className="results-header">
              <p className="results-count">
                Có <strong>{movies.length}</strong> {title.toLowerCase()} được tìm thấy
              </p>
            </div>
            {movies.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🎬</div>
                <h3>Chưa có {title.toLowerCase()} nào</h3>
              </div>
            ) : (
              /* Thêm padding và overflow: visible ở đây để tránh bị cắt card khi hover (scale 1.3) */
              <div 
                className="results-grid" 
                style={{ padding: "40px 20px", overflow: "visible" }}
              >
                {movies.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MovieList;