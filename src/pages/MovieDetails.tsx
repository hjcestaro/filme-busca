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
import StarRating from "../components/StarRating";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const movieRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&language=pt-BR`
        );
        setMovie(movieRes.data);
        console.log(movieRes.data);
        setIsFav(isFavorite(id!));
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
      <div className="flex justify-center items-center h-[100vh]">
        <Spinner />
      </div>
    );
  if (!movie) return <p>Filme não encontrado</p>;

  return (
    <div>
      <h1 className="text-3xl mb-4 py-6 px-3 bg-black text-white font-light">
        {movie.title}
      </h1>
      <div className="p-4 max-w-4xl mx-auto">
        <Link to={"/"}>← Voltar</Link>
        <div className="mt-2 mb-4">
          <button
            onClick={handleFavoriteToggle}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              isFav
                ? "bg-yellow-500 text-black hover:bg-yellow-600"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {isFav ? "💛 Remover dos favoritos" : "🤍 Adicionar aos favoritos"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row mt-4">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={`Pôster do filme ${movie.title}`}
              className="mb-4 rounded"
            />
          ) : (
            <img
              src={NotAvailable}
              alt="Imagem Indisponível"
              className="h-auto w-[300px] object-contain opacity-70 mb-4"
            />
          )}
          <div className="flex justify-between flex-col md:px-6">
            <div>
              <div className="text-gray-200 mb-4">
                <div className="text-gray-200 mb-4">
                  {movie.overview !== undefined && movie.overview.length > 0 ? (
                    movie.overview
                  ) : (
                    <div className="italic text-gray-500">
                      {"Sinopse não disponível :("}
                    </div>
                  )}
                </div>
              </div>
              <span className="italic">
                Lançamento:{" "}
                {movie.release_date &&
                !isNaN(new Date(movie.release_date).getTime())
                  ? new Intl.DateTimeFormat("pt-BR").format(
                      new Date(movie.release_date)
                    )
                  : "Data não disponível"}
              </span>
              {movie && (
                <div className="mt-4">
                  <StarRating rating={movie.vote_average ?? 0} />
                </div>
              )}
            </div>
            <WatchProviders id={id} />
          </div>
        </div>

        <Trailer id={id} />
        <CastList id={id} />
        <Review id={id} />
      </div>
    </div>
  );
}
