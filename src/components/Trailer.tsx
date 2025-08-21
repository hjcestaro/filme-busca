import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { Play, Youtube, Clapperboard, Film } from "lucide-react";

interface Props {
  id: string | undefined;
  maxTrailers?: number;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  published_at: string;
}

export default function Trailer({ id, maxTrailers = 3 }: Props) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const videosRes = await api.get(`/movie/${id}/videos`);

        const youtubeVideos = videosRes.data.results.filter(
          (video: Video) => video.site === "YouTube"
        );

        setVideos(youtubeVideos);

        const mainTrailer =
          youtubeVideos.find((video: Video) => video.type === "Trailer") ||
          youtubeVideos[0];
        setSelectedVideo(mainTrailer || null);
      } catch (err) {
        console.error("Erro ao buscar vídeos:", err);
        setError("Não foi possível carregar os vídeos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4 my-8">
        <div className="h-8 w-1/4 bg-gray-800 rounded animate-pulse"></div>
        <div className="aspect-video w-full bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
          <Play className="w-12 h-12 text-gray-600 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-6 text-gray-400">{error}</div>;
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Film className="w-12 h-12 mx-auto mb-3 text-gray-600" />
        <p>Nenhum vídeo disponível</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Clapperboard className="w-6 h-6 text-red-500" />
        Vídeos
      </h2>

      {selectedVideo && (
        <div className="bg-black rounded-xl overflow-hidden shadow-lg">
          <div className="aspect-w-16 aspect-h-9 w-full">
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=0&rel=0`}
              title={selectedVideo.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-[400px] md:h-[500px] lg:h-[600px]"
            />
          </div>
          <div className="p-4 bg-gray-900">
            <h3 className="font-semibold text-lg">{selectedVideo.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
              <Youtube className="w-4 h-4 text-red-500" />
              <span>YouTube</span>
              <span>•</span>
              <span>
                {new Date(selectedVideo.published_at).toLocaleDateString(
                  "pt-BR"
                )}
              </span>
              <span>•</span>
              <span className="capitalize">
                {selectedVideo.type.toLowerCase()}
              </span>
            </div>
          </div>
        </div>
      )}

      {videos.length > 1 && (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Mais vídeos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos
              .filter((video) => video.id !== selectedVideo?.id)
              .slice(0, maxTrailers)
              .map((video) => (
                <div
                  key={video.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                      alt={video.name}
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-10 h-10 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-medium line-clamp-2">{video.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span>
                        {new Date(video.published_at).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
                      <span>•</span>
                      <span className="capitalize">
                        {video.type.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}
