import { useEffect, useState } from "react";
import MovieGrid from "../../components/MovieGrid";
import PageHeader from "../../components/PageHeader";

import type { Movie } from "../../types/Movie";
import { fetchPopularMovies } from "../../utils/api";

export default function PopularMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPopularMovies(1);
        setMovies(data.results.slice(0, 25));
      } catch (err) {
        console.error("Failed to load popular movies:", err);
        setError("Não foi possível carregar os filmes populares");
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <PageHeader
        title="Filmes Populares"
        description="Os filmes mais populares no momento"
      />

      {error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <MovieGrid movies={movies} isLoading={isLoading} />
      )}
    </div>
  );
}
