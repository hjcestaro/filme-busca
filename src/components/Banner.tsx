import { useEffect, useState } from "react";
import { api } from "../utils/api";
import type { Movie } from "../types/Movie";

export default function Banner() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
        setIsTransitioning(true);
        setNextIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [movies]);

  const handleImageLoad = () => {
    setCurrentIndex(nextIndex);
    setIsTransitioning(false);
  };

  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const nextMovie = movies[nextIndex];

  return (
    <div className="relative h-[40vh] min-h-[200px] md:h-[70vh] overflow-hidden">
      <img
        src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
        alt={currentMovie.title}
        className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 opacity-100 z-10"
      />

      {isTransitioning && (
        <img
          src={`https://image.tmdb.org/t/p/original${nextMovie.backdrop_path}`}
          alt={nextMovie.title}
          onLoad={handleImageLoad}
          aria-hidden="true"
          className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 opacity-0 z-20"
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4 md:p-6 z-30">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
          {currentMovie.title}
        </h2>
      </div>
    </div>
  );
}
