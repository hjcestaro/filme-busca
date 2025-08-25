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

export const fetchUpcomingMovies = async (limit = 15) => {
  try {
    const response = await api.get("/movie/upcoming", {
      params: {
        language: "pt-BR",
        region: "BR",
      },
    });

    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);

    const upcomingMovies = response.data.results
      .filter((movie: any) => {
        if (!movie.release_date) return false;
        const releaseDate = new Date(movie.release_date);
        return releaseDate > today && releaseDate <= sixMonthsFromNow;
      })
      .slice(0, limit);

    return upcomingMovies;
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    throw error;
  }
};
