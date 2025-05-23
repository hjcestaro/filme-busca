import { useEffect, useState } from "react";
import { api } from "../utils/api";
import type { Movie } from "../types/Movie";

export default function Banner() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get(`/movie/popular`);
        const moviesWithBackdrop = response.data.results.filter(
          (movie: Movie) => movie.backdrop_path
        );
        setMovies(moviesWithBackdrop.slice(0, 10));
      } catch (err) {
        console.error("Erro ao buscar filmes:", err);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        setLoaded(false);
        setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [movies]);

  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative h-[70vh] overflow-hidden">
      <img
        src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
        alt={currentMovie.title}
        onLoad={() => setLoaded(true)}
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-6">
        <h2 className="text-3xl font-bold">{currentMovie.title}</h2>
      </div>
    </div>
  );
}

