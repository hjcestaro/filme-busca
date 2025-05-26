import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
  id: string | undefined;
}

interface Provider {
  provider_name: string;
  logo_path: string;
}

interface ApiResponse {
  results: {
    BR?: {
      flatrate?: Provider[];
    };
  };
}

export default function WatchProviders({ id }: Props) {
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        const providerRes = await axios.get<ApiResponse>(
          `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }`
        );

        const brProviders = providerRes.data.results?.BR?.flatrate || [];
        setProviders(brProviders);
      } catch (err) {
        console.error("Erro ao buscar detalhes:", err);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
      {providers.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Disponível em:
          </h3>
          <div className="flex flex-wrap gap-4">
            {providers.map((prov) => (
              <div
                key={prov.provider_name}
                className="flex flex-col items-center w-28"
                title={prov.provider_name}
              >
                <img
                  src={`https://image.tmdb.org/t/p/original${prov.logo_path}`}
                  alt={prov.provider_name}
                  className="w-12 h-12 object-contain mb-1 rounded-full"
                />
                <span className="text-xs text-white text-center">
                  {prov.provider_name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}