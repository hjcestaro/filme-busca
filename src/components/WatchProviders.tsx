import axios from "axios";
import { useEffect, useState } from "react";
import { Popcorn, Tv2, Clapperboard, Loader2 } from "lucide-react";

interface Props {
  id: string | undefined;
}

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface ProviderCategory {
  flatrate?: Provider[];
  buy?: Provider[];
  rent?: Provider[];
  ads?: Provider[];
  free?: Provider[];
}

interface ApiResponse {
  results: {
    BR?: ProviderCategory;
  };
}

export default function WatchProviders({ id }: Props) {
  const [providers, setProviders] = useState<ProviderCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"stream" | "rent" | "buy">(
    "stream"
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const providerRes = await axios.get<ApiResponse>(
          `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }`
        );

        setProviders(providerRes.data.results?.BR || null);
      } catch (err) {
        console.error("Erro ao buscar provedores:", err);
        setError("Não foi possível carregar as opções de streaming");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const hasAnyProvider = () => {
    return (
      providers &&
      ((providers.flatrate && providers.flatrate.length > 0) ||
        (providers.buy && providers.buy.length > 0) ||
        (providers.rent && providers.rent.length > 0) ||
        (providers.ads && providers.ads.length > 0) ||
        (providers.free && providers.free.length > 0))
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-gray-400">{error}</div>;
  }

  if (!hasAnyProvider()) {
    return (
      <div className="text-center py-6 text-gray-500">
        <Tv2 className="w-12 h-12 mx-auto mb-3 text-gray-600" />
        <p>Nenhuma opção de streaming disponível</p>
      </div>
    );
  }

  const getActiveProviders = () => {
    switch (activeTab) {
      case "stream":
        return providers?.flatrate || providers?.free || providers?.ads || [];
      case "rent":
        return providers?.rent || [];
      case "buy":
        return providers?.buy || [];
      default:
        return [];
    }
  };

  return (
    <section className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Popcorn className="w-6 h-6 text-red-500" />
        <h3 className="text-xl font-bold text-white">Onde assistir</h3>
      </div>

      <div className="flex border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("stream")}
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
            activeTab === "stream"
              ? "text-red-500 border-b-2 border-red-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Tv2 className="w-4 h-4" />
          Streaming
        </button>

        {providers?.rent && providers.rent.length > 0 && (
          <button
            onClick={() => setActiveTab("rent")}
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === "rent"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Alugar
          </button>
        )}

        {providers?.buy && providers.buy.length > 0 && (
          <button
            onClick={() => setActiveTab("buy")}
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === "buy"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Comprar
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {getActiveProviders().map((provider) => (
          <div
            key={provider.provider_id}
            className="flex flex-col items-center group"
            title={provider.provider_name}
          >
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center p-2 group-hover:bg-gray-600 transition-colors mb-2">
              {provider.logo_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                  alt={provider.provider_name}
                  className="w-full h-full object-contain rounded-full"
                  loading="lazy"
                />
              ) : (
                <Clapperboard className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <span className="text-xs text-gray-300 text-center line-clamp-2">
              {provider.provider_name}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 text-xs text-gray-400">
        <p>
          A disponibilidade pode variar de acordo com sua região e plano de
          assinatura.
        </p>
      </div>
    </section>
  );
}
