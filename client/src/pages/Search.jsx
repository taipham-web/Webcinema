import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchMovies, fetchGenres } from "../services/movieService";
import { useAuth } from "../context/AuthContext";
import MovieCard from "../components/MovieCard";
import "../styles/Search.css";

const SORT_OPTIONS = [
  { value: "newest",  label: "Mới nhất" },
  { value: "oldest",  label: "Cũ nhất" },
  { value: "az",      label: "A → Z" },
  { value: "za",      label: "Z → A" },
];

const Search = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery]       = useState(searchParams.get("q") || "");
  const [genre, setGenre]       = useState(searchParams.get("genre") || "Tất cả");
  const [type, setType]         = useState(searchParams.get("type") || "tat-ca");
  const [sort, setSort]         = useState("newest");
  const [genres, setGenres]     = useState(["Tất cả"]);
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Load genres từ DB
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(["Tất cả", ...data]);
      } catch (e) {
        console.error(e);
      }
    };
    loadGenres();
  }, []);

  // Hàm thực hiện tìm kiếm
  const doSearch = useCallback(async (q, g, t) => {
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchMovies(q, g, t);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Tìm tự động với debounce khi gõ
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (query.trim() || genre !== "Tất cả" || type !== "tat-ca") {
        setSearchParams({ q: query, genre, type });
        doSearch(query, genre, type);
      } else {
        setResults([]);
        setSearched(false);
      }
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query, genre, type, doSearch, setSearchParams]);

  // Tìm khi load lần đầu nếu có query trên URL
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const g = searchParams.get("genre") || "Tất cả";
    const t = searchParams.get("type") || "tat-ca";
    if (q || g !== "Tất cả" || t !== "tat-ca") {
      doSearch(q, g, t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sắp xếp phim
  const sortedResults = [...results].sort((a, b) => {
    if (sort === "newest") return b.release_year - a.release_year;
    if (sort === "oldest") return a.release_year - b.release_year;
    if (sort === "az")     return a.title.localeCompare(b.title);
    if (sort === "za")     return b.title.localeCompare(a.title);
    return 0;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() || genre !== "Tất cả" || type !== "tat-ca") doSearch(query, genre, type);
  };

  const handleClear = () => {
    setQuery("");
    setGenre("Tất cả");
    setType("tat-ca");
    setResults([]);
    setSearched(false);
    setSearchParams({});
  };

  return (
    <div className="search-page">
      {/* ── HEADER ── */}
      <div className="search-hero">
        <h1 className="search-heading">Tìm Kiếm Phim</h1>
        <p className="search-subheading">Khám phá kho phim đa dạng theo tên hoặc thể loại</p>

        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-input-wrap">
            <svg className="search-icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              className="search-input"
              placeholder="Nhập tên phim..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button type="button" className="clear-btn" onClick={handleClear} aria-label="Xóa">
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="search-submit-btn">Tìm kiếm</button>
        </form>
      </div>

      {/* ── FILTERS ── */}
      <div className="search-filters">
        <div className="filter-group">
          <span className="filter-label">Loại phim:</span>
          <div className="genre-pills">
            <button className={`genre-pill ${type === "tat-ca" ? "active" : ""}`} onClick={() => setType("tat-ca")}>Tất cả</button>
            <button className={`genre-pill ${type === "phim-le" ? "active" : ""}`} onClick={() => setType("phim-le")}>Phim lẻ</button>
            <button className={`genre-pill ${type === "phim-bo" ? "active" : ""}`} onClick={() => setType("phim-bo")}>Phim bộ</button>
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Thể loại:</span>
          <div className="genre-pills">
            {genres.map((g) => (
              <button
                key={g}
                className={`genre-pill ${genre === g ? "active" : ""}`}
                onClick={() => setGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {searched && results.length > 0 && (
          <div className="filter-group sort-group">
            <span className="filter-label">Sắp xếp:</span>
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── RESULTS ── */}
      <div className="search-results">
        {loading && (
          <div className="search-loading">
            <div className="spinner"></div>
            <p>Đang tìm kiếm...</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🎬</div>
            <h3>Không tìm thấy phim nào</h3>
            <p>Thử từ khóa khác hoặc chọn thể loại khác nhé!</p>
            <button className="reset-btn" onClick={handleClear}>Xóa bộ lọc</button>
          </div>
        )}

        {!loading && !searched && (
          <div className="search-idle">
            <div className="idle-genres">
              <h3>Khám phá theo thể loại</h3>
              <div className="idle-genre-grid">
                {genres.filter(g => g !== "Tất cả").map((g) => (
                  <button
                    key={g}
                    className="idle-genre-card"
                    onClick={() => setGenre(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && sortedResults.length > 0 && (
          <>
            <div className="results-header">
              <p className="results-count">
                Tìm thấy <strong>{sortedResults.length}</strong> bộ phim
                {query && <> cho "<em>{query}</em>"</>}
                {type !== "tat-ca" && <> ({type === 'phim-bo' ? 'Phim bộ' : 'Phim lẻ'})</>}
                {genre !== "Tất cả" && <> trong thể loại <em>{genre}</em></>}
              </p>
            </div>
            <div className="results-grid">
              {sortedResults.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
