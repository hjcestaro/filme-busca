import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "pt-BR",
  },
});

export const fetchNowPlayingMovies = async (page = 1) => {
  try {
    const response = await api.get("/movie/now_playing", {
      params: { page },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    throw error;
  }
};

export const fetchPopularMovies = async (page: number) => {
  const response = await api.get("/movie/popular", {
    params: { page },
  });
  return {
    results: response.data.results,
    totalPages: response.data.total_pages,
    totalResults: response.data.total_results,
  };
};
