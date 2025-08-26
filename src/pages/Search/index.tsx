import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NotAvailable from "../../assets/No_Available.jpg";
import type { Movie } from "../../types/Movie";
import { api } from "../../utils/api";
import { Search, Star, AlertCircle } from "lucide-react";
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
    <div className="bg-gray-900">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-red-500/5 transform -skew-x-12"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/5 transform skew-x-12"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Encontre seu próximo
                <span className="text-red-400"> filme favorito</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Descubra milhares de filmes, explore novos gêneros e crie sua
                lista personalizada
              </p>
            </div>

            {/* Barra de Busca no Banner */}
            <div className="max-w-2xl mx-auto mb-12">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        // Limpar erro quando o usuário começar a digitar
                        if (error) setError(null);
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Busque por filmes, atores ou diretores..."
                      className={`w-full py-4 px-6 pr-16 rounded-full bg-gray-800/80 backdrop-blur-md text-white border transition-all duration-300 text-lg placeholder-gray-400 ${
                        error
                          ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/50"
                          : "border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/50"
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all duration-300 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Search className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Mensagem de erro no banner */}
                  {error && (
                    <div className="absolute top-full left-0 right-0 mt-2">
                      <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg flex items-start space-x-2 backdrop-blur-sm">
                        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    </div>
  );
}
