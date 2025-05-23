import { useEffect, useState } from "react";
import { api } from "../utils/api";
import Spinner from "./Spinner";

interface Props {
  id: string | undefined;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export default function Trailer({ id }: Props) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const videosRes = await api.get(`/movie/${id}/videos`);

        setVideos(videosRes.data.results);
      } catch (err) {
        console.error("Erro ao buscar detalhes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Spinner />;

  const trailers = videos.filter(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );

  return (
    <div className="my-6">
      <h2 className="text-2xl font-semibold mb-4">Trailer</h2>
      {trailers.length > 0 ? (
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={`https://www.youtube.com/embed/${trailers[0].key}`}
            title={trailers[0].name}
            allowFullScreen
            className="w-full h-96 rounded-lg"
          />
        </div>
      ) : (
        <p className="text-gray-500 italic">
          {"Infelizmente trailer não disponível :("}
        </p>
      )}
    </div>
  );
}
