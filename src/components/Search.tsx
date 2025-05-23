import { useState } from "react";
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

  const fetchMovies = async () => {
    if (!query.trim()) return;
    try {
      const response = await api.get("/search/movie", {
        params: {
          query: query.trim(),
          page,
        },
      });
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    setPage(1);
    fetchMovies();
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
        <Button onClick={handleSearch}>Procurar</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-6">
        {movies.map((item) => (
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
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="text-white">
            Página {page} de {totalPages}
          </span>
          <Button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
