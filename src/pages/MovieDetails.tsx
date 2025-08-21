import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CastList from "../components/CastList";
import Trailer from "../components/Trailer";
import NotAvailable from "../assets/No_Available.jpg";
import { isFavorite, toggleFavorite } from "../utils/favoriteUtils";
import type { Movie } from "../types/Movie";
import Spinner from "../components/Spinner";
import WatchProviders from "../components/WatchProviders";
import Review from "../components/Review";
import { Heart, ArrowLeft, Clock, Calendar, Film, Star } from "lucide-react";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [backdropLoaded, setBackdropLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setBackdropLoaded(false);

        const movieRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&language=pt-BR&append_to_response=credits,videos`
        );
        setMovie(movieRes.data);
        setIsFav(isFavorite(id!));
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Erro ao buscar detalhes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFavoriteToggle = () => {
    const updated = toggleFavorite(id!);
    setIsFav(updated);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Spinner />
      </div>
    );

  if (!movie)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
        <Film className="w-16 h-16 mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">Filme não encontrado</h2>
        <p className="text-gray-400 mb-6">
          O filme que você está procurando não está disponível.
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para a página inicial
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative w-full overflow-hidden">
        {movie.backdrop_path && (
          <>
            <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={`Cena do filme ${movie.title}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                backdropLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setBackdropLoaded(true)}
            />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent z-10"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full flex flex-col justify-end pb-12">
          <div className="max-w-4xl pt-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </Link>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 relative group">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`Pôster do filme ${movie.title}`}
                    className="w-64 rounded-xl shadow-2xl border-2 border-white/10 group-hover:border-white/30 transition-all duration-300"
                  />
                ) : (
                  <div className="w-64 h-96 flex items-center justify-center bg-gray-800 rounded-xl">
                    <img
                      src={NotAvailable}
                      alt="Imagem Indisponível"
                      className="w-3/4 opacity-50"
                    />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-4 flex-wrap mb-4">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    {movie.title}
                  </h1>
                  <button
                    onClick={handleFavoriteToggle}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                      isFav
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isFav ? "fill-current" : ""}`}
                    />
                    {isFav ? "Favorito" : "Favoritar"}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-300">
                  {movie.release_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Intl.DateTimeFormat("pt-BR").format(
                          new Date(movie.release_date)
                        )}
                      </span>
                    </div>
                  )}

                  {movie.runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                      </span>
                    </div>
                  )}

                  {movie.vote_average && movie.vote_average > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{movie.vote_average.toFixed(1)}/10</span>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-2">Sinopse</h3>
                  {movie.overview ? (
                    <p className="text-gray-300 leading-relaxed">
                      {movie.overview}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">
                      Sinopse não disponível
                    </p>
                  )}
                </div>

                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <Trailer id={id} />

            <section>
              <CastList id={id} />
            </section>

            <Review id={id} />
          </div>

          <div className="space-y-8">
            <WatchProviders id={id} />

            {movie.homepage && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Site Oficial</h3>
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 transition-colors break-all"
                >
                  {movie.homepage.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
