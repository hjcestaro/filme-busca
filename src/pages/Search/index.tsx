import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NotAvailable from "../../assets/No_Available.jpg";
import type { Movie } from "../../types/Movie";
import { api } from "../../utils/api";
import { Search, Star } from "lucide-react";
import Pagination from "../../components/Pagination";

export default function SearchTask() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const savedQuery = localStorage.getItem("lastQuery");
    if (savedQuery) {
      setQuery(savedQuery);
      fetchMovies(savedQuery, 1, true);
    }
  }, []);

  useEffect(() => {
    if (hasSearched && query.trim()) {
      fetchMovies(query, page, false);
    }
  }, [page]);

  const fetchMovies = async (
    search: string,
    currentPage: number,
    initialLoad: boolean
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/search/movie", {
        params: {
          query: search.trim(),
          page: currentPage,
        },
      });

      if (response.data.results.length === 0) {
        setError("Nenhum filme encontrado. Tente outro termo.");
        setMovies([]);
      } else {
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      }

      if (initialLoad) {
        setHasSearched(true);
      }
    } catch (error) {
      setError("Ocorreu um erro ao buscar filmes. Tente novamente.");
      console.error("Erro ao buscar filmes:", error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) {
      setError("Por favor, digite um termo de busca.");
      setMovies([]);
      return;
    }
    localStorage.setItem("lastQuery", query);
    setPage(1);
    fetchMovies(query, 1, true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-center mb-12">
        <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Busque por filmes..."
              className="w-full py-4 px-6 pr-12 rounded-full bg-gray-800 text-white border border-gray-700 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all duration-300"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-gray-700 rounded-xl"></div>
              <div className="h-4 mt-3 bg-gray-700 rounded"></div>
              <div className="h-3 mt-2 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <div className="text-red-400 text-lg font-medium mb-2">{error}</div>
          <p className="text-gray-400">Tente buscar por outro termo</p>
        </div>
      )}

      {!isLoading && !error && hasSearched && movies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-white text-lg font-medium mb-2">
            Nenhum filme encontrado para "{query}"
          </div>
          <p className="text-gray-400">
            Sugestão: Verifique a ortografia ou tente termos diferentes
          </p>
        </div>
      )}

      {!isLoading && movies.length > 0 && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Resultados para: <span className="text-red-400">"{query}"</span>
            </h2>
            <div className="text-gray-400 text-sm">
              {movies.length} resultados
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((item) => (
              <div key={item.id} className="group">
                <Link to={`/filme/${item.id}`} className="block">
                  <div className="relative aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.03]">
                    {item.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                        alt={item.title}
                        className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-800">
                        <img
                          src={NotAvailable}
                          alt="Imagem indisponível"
                          className="h-1/2 w-1/2 object-contain opacity-50"
                        />
                      </div>
                    )}

                    {item.vote_average && item.vote_average > 0 && (
                      <div className="absolute top-2 right-2 bg-black/80 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <span>{item.vote_average.toFixed(1)}</span>
                        <Star className="w-3 h-3 ml-1 fill-current" />
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <h3 className="text-white font-medium text-sm md:text-base line-clamp-2 group-hover:text-red-400 transition-colors">
                      {item.title}
                    </h3>
                    {item.release_date && (
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(item.release_date).getFullYear()}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              isLoading={isLoading}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
