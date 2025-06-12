import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";
import NotAvailable from "../assets/No_Available.jpg";
import type { Movie } from "../types/Movie";
import { api } from "../utils/api";

export default function Search() {
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
      fetchMovies(savedQuery, 1);
    }
  }, []);

  useEffect(() => {
    if (hasSearched && query.trim()) {
      fetchMovies(query, page);
    }
  }, [page]);

  const fetchMovies = async (search: string, currentPage: number) => {
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
      }
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      setError("Ocorreu um erro ao buscar filmes. Tente novamente.");
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!query.trim()) {
      setError("Por favor, digite um termo de busca.");
      return;
    }
    localStorage.setItem("lastQuery", query);
    setPage(1);
    setHasSearched(true);
    fetchMovies(query, 1);
  };

  return (
    <div className="max-w-[1250px] mx-auto">
      <div className="flex justify-center py-12">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nome do filme"
          className="border border-white rounded px-1"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Buscando..." : "Procurar"}
        </Button>
      </div>

      {isLoading && (
        <div className="text-center text-white py-8">Carregando...</div>
      )}

      {error && <div className="text-center text-red-500 py-8">{error}</div>}

      {!isLoading && !error && hasSearched && movies.length === 0 && (
        <div className="text-center text-white py-8">
          Nenhum filme encontrado para "{query}".
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-6">
        {movies.slice(0, 18).map((item) => (
          <Link
            to={`/filme/${item.id}`}
            key={item.id}
            className="group flex flex-col"
          >
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-800">
              {item.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <img
                    src={NotAvailable}
                    alt="Imagem Indisponível"
                    className="h-auto w-3/4 object-contain opacity-70"
                  />
                </div>
              )}
            </div>
            <h2 className="mt-2 line-clamp-2 text-sm font-medium text-white group-hover:text-blue-400">
              {item.title}
            </h2>
          </Link>
        ))}
      </div>

      {movies.length > 0 && (
        <div className="flex justify-center items-center gap-4 my-8">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1 || isLoading}
          >
            Anterior
          </Button>
          <span className="text-white">
            Página {page} de {totalPages}
          </span>
          <Button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages || isLoading}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
