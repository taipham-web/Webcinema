import axios from "axios";

// Giả định URL API của bạn
const API_URL = "/api/watchlist";

export const addToWatchlist = async (userId, movieId) => {
  try {
    const response = await axios.post(`${API_URL}/add`, { userId, movieId });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm vào danh sách theo dõi:", error);
    throw error;
  }
};
