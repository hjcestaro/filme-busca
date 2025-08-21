import { useEffect, useState } from "react";
import { fetchPopularMovies } from "../utils/api";
import type { Movie } from "../types/Movie";

export default function Banner() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchPopularMovies(1);
        setMovies(data.results.slice(0, 5));
      } catch (err) {
        console.error("Failed to load popular movies:", err);
      }
    };

    loadMovies();
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
    <div className="relative h-[60vh] min-h-[400px] max-h-[800px] w-full overflow-hidden group">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
          alt={currentMovie.title}
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-105"
        />
      </div>

      {isTransitioning && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/original${nextMovie.backdrop_path}`}
            alt={nextMovie.title}
            onLoad={handleImageLoad}
            aria-hidden="true"
            className="w-full h-full object-cover animate-fadeIn"
          />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20" />

      <div className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-12 md:px-12 md:pb-16 lg:px-24 lg:pb-20 transition-all duration-500 transform translate-y-0 group-hover:translate-y-[-10px]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {currentMovie.title}
          </h2>

          <div className="flex items-center gap-4 mb-4 text-white/80">
            {currentMovie.release_date && (
              <span className="text-sm md:text-base">
                {new Date(currentMovie.release_date).getFullYear()}
              </span>
            )}
            {currentMovie.vote_average && currentMovie.vote_average > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-sm md:text-base">
                  {currentMovie.vote_average.toFixed(1)}
                </span>
                <svg
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setNextIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
