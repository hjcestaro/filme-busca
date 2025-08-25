import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Movie } from "../../types/Movie";
import { api } from "../../utils/api";
import { getFavorites } from "../../utils/favoriteUtils";
import { Heart, Star, Film } from "lucide-react";

export default function FavoritesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const ids = getFavorites();

        if (ids.length === 0) {
          setIsLoading(false);
          return;
        }

        console.log("Fetching all favorites:", ids);

        const promises = ids.map((id) =>
          api.get(`/movie/${id}`).catch((err) => {
            console.error(`Error fetching movie ${id}:`, err);
            return null;
          })
        );

        const responses = await Promise.all(promises);
        const validResponses = responses.filter(
          (response) => response !== null
        );
        const moviesData = validResponses.map((res) => res!.data);

        console.log("All favorites loaded:", moviesData);
        setMovies(moviesData);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError("Não foi possível carregar seus filmes favoritos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-3xl font-bold text-white">
              Todos os Favoritos
            </h1>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-gray-700 rounded-xl"></div>
                <div className="h-4 mt-3 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">{error}</div>
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

  if (movies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-semibold text-white mb-2">
              Nenhum filme favoritado
            </h1>
            <p className="text-gray-400 mb-6">
              Você ainda não adicionou nenhum filme aos favoritos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-3xl font-bold text-white">
              Todos os Favoritos
            </h1>
            <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-full">
              {movies.length} filmes
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="group">
              <Link to={`/filme/${movie.id}`} className="block">
                <div className="relative aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-800">
                      <Film className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  <div className="absolute top-2 left-2 bg-red-600 text-white p-1 rounded-full">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>

                  {movie.vote_average && movie.vote_average > 0 && (
                    <div className="absolute top-2 right-2 bg-black/80 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                      <Star className="w-3 h-3 fill-current mr-1" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="text-white font-medium text-sm md:text-base line-clamp-2 group-hover:text-red-400 transition-colors">
                    {movie.title}
                  </h3>
                  {movie.release_date && (
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
