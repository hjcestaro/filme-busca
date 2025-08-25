import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { ArrowLeft, Film, Calendar, MapPin, Award, Star } from "lucide-react";
import Avatar from '../../assets/avatar.png'

interface ActorDetails {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string | null;
  place_of_birth: string | null;
  deathday: string | null;
  popularity: number;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number;
  character: string;
  popularity: number;
}

interface MovieCredits {
  cast: Movie[];
}

export default function ActorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [actor, setActor] = useState<ActorDetails | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID do ator não fornecido");
      setLoading(false);
      return;
    }

    const fetchActor = async () => {
      try {
        setLoading(true);
        setError(null);

        const [actorRes, moviesRes] = await Promise.all([
          api.get<ActorDetails>(`/person/${id}?language=pt-BR`),
          api.get<MovieCredits>(`/person/${id}/movie_credits?language=pt-BR`),
        ]);

        setActor(actorRes.data);

        const sortedMovies = moviesRes.data.cast
          .filter((movie) => movie.poster_path)
          .sort((a, b) => {
            if (b.popularity !== a.popularity) {
              return b.popularity - a.popularity;
            }

            return (
              new Date(b.release_date || 0).getTime() -
              new Date(a.release_date || 0).getTime()
            );
          });

        setMovies(sortedMovies);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Erro ao carregar ator:", err);
        setError("Não foi possível carregar os dados do ator");
      } finally {
        setLoading(false);
      }
    };

    fetchActor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-r-transparent"></div>
      </div>
    );
  }

  if (error || !actor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
        <Award className="w-16 h-16 mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">Ator não encontrado</h2>
        <p className="text-gray-400 mb-6">
          {error || "O ator solicitado não existe."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
      </div>
    );
  }

  const calculateAge = (birthday: string, deathday: string | null) => {
    const birthDate = new Date(birthday);
    const endDate = deathday ? new Date(deathday) : new Date();
    return Math.floor((endDate.getTime() - birthDate.getTime()) / 3.15576e10);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Voltar
          </button>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-shrink-0 relative group">
              {actor.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w400${actor.profile_path}`}
                  alt={actor.name}
                  className="w-64 h-96 object-cover rounded-xl shadow-2xl border-2 border-white/10 group-hover:border-white/30 transition-all duration-300"
                />
              ) : (
                <img
                  src={Avatar}
                  alt="Avatar"
                  
                />
              )}

              {actor.popularity > 10 && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  Popular
                </div>
              )}
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {actor.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-300">
                  {actor.birthday && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(actor.birthday).toLocaleDateString("pt-BR")}
                        {actor.deathday
                          ? ` - ✝️ ${new Date(
                              actor.deathday
                            ).toLocaleDateString("pt-BR")}`
                          : ""}
                      </span>
                      {actor.birthday && !actor.deathday && (
                        <span className="text-sm text-gray-400">
                          ({calculateAge(actor.birthday, actor.deathday)} anos)
                        </span>
                      )}
                    </div>
                  )}

                  {actor.place_of_birth && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{actor.place_of_birth}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-red-500" />
                  Biografia
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {actor.biography && actor.biography.length > 0
                      ? actor.biography
                      : "Biografia não disponível para este ator."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-500">
                    {movies.length}
                  </div>
                  <div className="text-sm text-gray-400">Filmes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Film className="w-8 h-8 text-red-500" />
            Filmografia
          </h2>
          <span className="text-gray-400">{movies.length} filmes</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => navigate(`/filme/${movie.id}`)}
            >
              <div className="relative aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "https://via.placeholder.com/500x750/333/fff?text=Sem+Poster"
                  }
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                />

                {movie.vote_average > 0 && (
                  <div className="absolute top-2 right-2 bg-black/80 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <Star className="w-3 h-3 fill-current mr-1" />
                    {movie.vote_average.toFixed(1)}
                  </div>
                )}
              </div>

              <div className="mt-3">
                <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                  {movie.title}
                </h3>
                {movie.character && (
                  <p
                    className="text-sm text-gray-400 line-clamp-1"
                    title={movie.character}
                  >
                    como {movie.character}
                  </p>
                )}
                {movie.release_date && (
                  <p className="text-xs text-gray-500">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {movies.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Film className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Nenhum filme encontrado na filmografia</p>
          </div>
        )}
      </div>
    </div>
  );
}
