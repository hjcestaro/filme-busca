import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import MovieGrid from "../../components/MovieGrid";
import PageHeader from "../../components/PageHeader";
import type { Movie } from "../../types/Movie";
import { Film, Calendar, Clapperboard, MapPin } from "lucide-react";
import Pagination from "../../components/Pagination";

interface NowPlayingResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export default function NowPlayingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get<NowPlayingResponse>(
          "/movie/now_playing",
          {
            params: {
              page,
              language: "pt-BR",
              region: "BR",
            },
          }
        );

        const releasedMovies = response.data.results.filter((movie) => {
          if (!movie.release_date) return false;
          const releaseDate = new Date(movie.release_date);
          const today = new Date();
          return releaseDate <= today;
        });

        setMovies(releasedMovies);
        setTotalPages(response.data.total_pages);
        setTotalResults(response.data.total_results);

        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Failed to load now playing movies:", err);
        setError("Não foi possível carregar os filmes em cartaz");
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [page]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Clapperboard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">{error}</h2>
          <button
            onClick={() => window.location.reload()}
            className="text-red-400 hover:text-red-300"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Filmes em Cartaz"
          description="Os filmes que estão nos cinemas agora mesmo!"
        />

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
            <MapPin className="w-5 h-5 text-green-400" />
            <span className="text-white">Cinemas Brasileiros</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
            <Film className="w-5 h-5 text-blue-400" />
            <span className="text-white">
              {totalResults} filmes disponíveis
            </span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
            <Calendar className="w-5 h-5 text-yellow-400" />
            <span className="text-white">
              {new Date().toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>

        <MovieGrid movies={movies} isLoading={isLoading} />

        {!isLoading && totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            isLoading={isLoading}
            onPageChange={setPage}
          />
        )}

        {!isLoading && movies.length === 0 && (
          <div className="text-center py-16">
            <Clapperboard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum filme em cartaz no momento
            </h3>
            <p className="text-gray-400 mb-4">
              Todos os filmes saíram de cartaz ou ainda não estrearam
            </p>
            <a href="/upcoming" className="text-red-400 hover:text-red-300">
              Ver próximos lançamentos →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
