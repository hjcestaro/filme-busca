import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import MovieGrid from "../../components/MovieGrid";
import PageHeader from "../../components/PageHeader";
import type { Movie } from "../../types/Movie";
import { Calendar, Rocket, Ticket } from "lucide-react";
import Pagination from "../../components/Pagination";

interface UpcomingResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export default function UpcomingMovies() {
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

        const response = await api.get<UpcomingResponse>("/movie/upcoming", {
          params: {
            page,
            language: "pt-BR",
            region: "BR",
          },
        });

        const upcomingMovies = response.data.results.filter((movie) => {
          if (!movie.release_date) return false;
          const releaseDate = new Date(movie.release_date);
          const today = new Date();
          return releaseDate > today;
        });

        setMovies(upcomingMovies);
        setTotalPages(response.data.total_pages);
        setTotalResults(response.data.total_results);

        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Failed to load upcoming movies:", err);
        setError("Não foi possível carregar os próximos lançamentos");
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
          <Rocket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
          title="Próximos Lançamentos"
          description="Prepare a pipoca! Estes são os filmes que em breve chegam aos cinemas"
        />

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
            <Ticket className="w-5 h-5 text-yellow-400" />
            <span className="text-white">{totalResults} filmes anunciados</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="text-white">Em breve nos cinemas</span>
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
            <Rocket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum lançamento anunciado
            </h3>
            <p className="text-gray-400">
              Volte em breve para descobrir os próximos filmes!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
