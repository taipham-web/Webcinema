import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Tạo một instance axios có sẵn token trong header
const getAxiosConfig = () => {
  const userInfo = localStorage.getItem('userInfo');
  const token = userInfo ? JSON.parse(userInfo).token : null;
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

export const fetchMovies = async () => {
  const { data } = await axios.get(`${API_URL}/movies`, getAxiosConfig());
  return data;
};

export const searchMovies = async (q = "", genre = "", type = "") => {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (genre && genre !== "Tất cả") params.set("genre", genre);
  if (type && type !== "tat-ca") params.set("type", type);
  const { data } = await axios.get(
    `${API_URL}/movies/search?${params.toString()}`,
    getAxiosConfig()
  );
  return data;
};

export const fetchGenres = async () => {
  const { data } = await axios.get(`${API_URL}/movies/genres`, getAxiosConfig());
  return data;
};

export const fetchMovieById = async (id) => {
  const { data } = await axios.get(`${API_URL}/movies/${id}`, getAxiosConfig());
  return data;
};

export const saveProgress = async (movieId, currentTime, isFinished = false) => {
  const { data } = await axios.post(
    `${API_URL}/progress`,
    { movieId, currentTime, isFinished },
    getAxiosConfig()
  );
  return data;
};

export const getProgress = async (movieId) => {
  const { data } = await axios.get(`${API_URL}/progress/${movieId}`, getAxiosConfig());
  return data;
};

export const getAllProgress = async () => {
  const { data } = await axios.get(`${API_URL}/progress`, getAxiosConfig());
  return data;
};

export const addToWatchlist = async (userId, movieId) => {
  const { data } = await axios.post(
    `${API_URL}/watchlist/add`,
    { userId, movieId },
    getAxiosConfig()
  );
  return data;
};

export const getWatchlist = async (userId) => {
  const { data } = await axios.get(`${API_URL}/watchlist/${userId}`, getAxiosConfig());
  return data;
};

export const removeFromWatchlist = async (userId, movieId) => {
  const { data } = await axios.post(
    `${API_URL}/watchlist/remove`,
    { userId, movieId },
    getAxiosConfig()
  );
  return data;
};

export const getWatchlistIds = async (userId) => {
  const { data } = await axios.get(`${API_URL}/watchlist/${userId}/ids`, getAxiosConfig());
  return data;
};
