import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieById, fetchMovies, saveProgress, getProgress } from "../services/movieService";
import MovieCard from "../components/MovieCard";
import { useAuth } from "../context/AuthContext";
import "../styles/MovieDetail.css";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef(null);
  const progressSaveTimer = useRef(null);

  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [savedTime, setSavedTime] = useState(0);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const controlsTimerRef = useRef(null);

  // Redirect về login nếu chưa đăng nhập
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Load phim + tiến trình đã lưu
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [movieData, allMovies, progressData] = await Promise.all([
          fetchMovieById(id),
          fetchMovies(),
          getProgress(id),
        ]);
        setMovie(movieData);

        // Phim liên quan: cùng thể loại, không bao gồm phim hiện tại
        const related = allMovies
          .filter(
            (m) =>
              m._id !== id &&
              m.genres?.some((g) => movieData.genres?.includes(g))
          )
          .slice(0, 6);
        setRelatedMovies(related);

        // Nhắc xem tiếp nếu đã xem hơn 30 giây và chưa xem xong
        if (progressData.currentTime > 30 && !progressData.isFinished) {
          setSavedTime(progressData.currentTime);
          setShowResumePrompt(true);
        }
      } catch (err) {
        console.error("Lỗi tải phim:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadData();
  }, [id]);

  // Ẩn thanh điều khiển sau 3 giây không rê chuột
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    if (isPlaying) {
      controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  // Lưu tiến trình định kỳ mỗi 10 giây khi đang phát
  useEffect(() => {
    if (isPlaying && movie) {
      progressSaveTimer.current = setInterval(async () => {
        if (videoRef.current) {
          await saveProgress(movie._id, Math.floor(videoRef.current.currentTime));
        }
      }, 10000);
    }
    return () => clearInterval(progressSaveTimer.current);
  }, [isPlaying, movie]);

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleEnded = async () => {
    setIsPlaying(false);
    setShowControls(true);
    if (movie) await saveProgress(movie._id, 0, true);
  };

  const handleSeek = (e) => {
    const bar = e.currentTarget;
    const clickX = e.nativeEvent.offsetX;
    const newTime = (clickX / bar.offsetWidth) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const wrapper = document.querySelector(".player-wrapper");
    if (!document.fullscreenElement) {
      wrapper?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleResume = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = savedTime;
    }
    setShowResumePrompt(false);
    videoRef.current?.play();
    setIsPlaying(true);
  };

  const handleStartOver = () => {
    setShowResumePrompt(false);
    videoRef.current?.play();
    setIsPlaying(true);
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Đang tải phim...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-screen">
        <h2>Không tìm thấy phim</h2>
        <button className="btn-back" onClick={() => navigate("/")}>← Về trang chủ</button>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      {/* ===== VIDEO PLAYER ===== */}
      <div
        className={`player-wrapper ${showControls ? "show-controls" : ""}`}
        onMouseMove={resetControlsTimer}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Lớp nền poster khi chưa play */}
        {!isPlaying && (
          <div
            className="player-poster"
            style={{ backgroundImage: `url(${movie.poster_url})` }}
          />
        )}

        <video
          ref={videoRef}
          src={movie.video_url}
          className="video-element"
          onClick={handleVideoClick}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Nút Play lớn ở giữa khi dừng */}
        {!isPlaying && (
          <button className="big-play-btn" onClick={handleVideoClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </button>
        )}

        {/* Hộp thoại nhắc xem tiếp */}
        {showResumePrompt && (
          <div className="resume-prompt">
            <p>Bạn đã xem đến <strong>{formatTime(savedTime)}</strong></p>
            <div className="resume-btns">
              <button onClick={handleResume}>▶ Xem tiếp</button>
              <button onClick={handleStartOver}>↺ Xem lại từ đầu</button>
            </div>
          </div>
        )}

        {/* Thanh điều khiển */}
        <div className="player-controls">
          {/* Progress Bar */}
          <div className="progress-container" onClick={handleSeek}>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="controls-row">
            <div className="controls-left">
              {/* Play/Pause */}
              <button className="ctrl-btn" onClick={handleVideoClick}>
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                )}
              </button>

              {/* Âm lượng */}
              <button className="ctrl-btn" onClick={toggleMute}>
                {isMuted || volume === 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />

              {/* Thời gian */}
              <span className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="controls-right">
              {/* Tên phim */}
              <span className="player-title">{movie.title}</span>

              {/* Toàn màn hình */}
              <button className="ctrl-btn" onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== THÔNG TIN PHIM ===== */}
      <div className="movie-info-section">
        <div className="movie-info-main">
          <div className="movie-info-left">
            <h1 className="detail-title">{movie.title}</h1>

            <div className="detail-meta">
              <span className="meta-badge year">{movie.release_year}</span>
              {movie.duration && (
                <span className="meta-badge duration">
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}p
                </span>
              )}
              <span className="meta-badge hd">HD</span>
            </div>

            <div className="detail-genres">
              {movie.genres?.map((g) => (
                <span key={g} className="detail-genre-tag">{g}</span>
              ))}
            </div>

            <p className="detail-description">{movie.description}</p>
          </div>

          <div className="movie-info-right">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="detail-poster"
            />
          </div>
        </div>

        {/* ===== PHIM LIÊN QUAN ===== */}
        {relatedMovies.length > 0 && (
          <div className="related-section">
            <h2 className="related-title">Phim Tương Tự</h2>
            <div className="related-grid">
              {relatedMovies.map((m) => (
                <MovieCard key={m._id} movie={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
