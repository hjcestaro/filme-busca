import { useEffect, useState } from "react";
import { api } from "../utils/api";

interface Props {
  id: string | undefined;
}

interface Actor {
  cast_id: number;
  name: string;
  character: string;
}

interface CreditsResponse {
  cast: Actor[];
}

export default function CastList({ id }: Props) {
  const [credits, setCredits] = useState<CreditsResponse | null>(null);

  useEffect(() => {
    const fetchCast = async () => {
      try {
        const creditsRes = await api.get<CreditsResponse>(
          `/movie/${id}/credits`
        );
        setCredits(creditsRes.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes:", err);
      }
    };

    if (id) {
      fetchCast();
    }
  }, [id]);

  return (
    <div>
      {credits && (
        <div>
          <h2 className="text-xl font-semibold mb-2 mt-2">Elenco principal:</h2>
          {credits.cast.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {credits.cast.slice(0, 5).map((actor) => (
                <li key={actor.cast_id}>
                  <span className="font-bold">{actor.name}</span> como{" "}
                  {actor.character}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">{"Elenco não disponível :("}</p>
          )}
        </div>
      )}
    </div>
  );
}
