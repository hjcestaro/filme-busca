import { useEffect, useState } from "react";
import { getFavorites } from "../utils/favoriteUtils";
import { Link } from "react-router-dom";
import NotAvailable from "../assets/No_Available.jpg";
import type { Movie } from "../types/Movie";
import { api } from "../utils/api";

export default function FavoritesSection() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const ids = getFavorites();
      const promises = ids.map((id) => api.get(`/movie/${id}`));
      const responses = await Promise.all(promises);
      setMovies(responses.map((res) => res.data));
    };

    fetchFavorites();
  }, []);

  if (movies.length === 0) return null;

  return (
    <section className="max-w-[1250px] mx-auto px-6 py-4">
      <h2 className="text-xl font-semibold mb-4">🎬 Seus Filmes Favoritos</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <Link to={`/filme/${movie.id}`} key={movie.id}>
            <div className="relative aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={NotAvailable}
                  alt="Imagem indisponível"
                  className="h-full w-full object-contain opacity-60"
                />
              )}
            </div>
            <p className="text-white text-sm mt-1 line-clamp-2">
              {movie.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
