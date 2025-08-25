import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  id: string | undefined;
  maxItems?: number;
}

interface Actor {
  id: number;
  cast_id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CreditsResponse {
  cast: Actor[];
}

export default function CastList({ id, maxItems = 8 }: Props) {
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCast = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        const creditsRes = await api.get<CreditsResponse>(
          `/movie/${id}/credits`
        );
        setCredits(creditsRes.data);
      } catch (err) {
        console.error("Erro ao buscar elenco:", err);
        setError("Não foi possível carregar o elenco");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCast();
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-semibold mb-4">Elenco principal</h2>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-gray-400">{error}</div>;
  }

  if (!credits) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <User className="w-5 h-5 text-red-500" />
        Elenco Principal
      </h2>

      {credits.cast.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {credits.cast.slice(0, maxItems).map((actor) => (
            <li
              key={actor.cast_id}
              className="flex items-center gap-3 group cursor-pointer hover:bg-gray-800/30 p-2 rounded-lg transition"
            >
              <Link
                to={`/actor/${actor.id}`}
                className="flex items-center gap-4"
              >
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <img
                    src="/src/assets/avatar.png"
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                )}

                <div className="min-w-0">
                  <p className="font-medium truncate">{actor.name}</p>
                  <p className="text-sm text-gray-400 truncate">
                    {actor.character || "Personagem não especificado"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">Elenco não disponível</p>
      )}

      {credits.cast.length > maxItems && (
        <p className="text-sm text-gray-400">
          + {credits.cast.length - maxItems} atores no elenco
        </p>
      )}
    </div>
  );
}
