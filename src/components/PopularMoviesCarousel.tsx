import { useEffect, useState } from "react";
import { fetchPopularMovies } from "../utils/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, Star, Play } from "lucide-react";
import { Link } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

export default function PopularMoviesCarousel() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchPopularMovies(1);
        setMovies(data.results.slice(0, 10));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMovies();
  }, []);

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Filmes Populares</h2>
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-gray-700 rounded-xl"></div>
              <div className="h-4 mt-3 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text">
          🎬 Filmes Populares
        </h2>

        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden md:block">
            {movies.length} filmes
          </span>
          <div className="flex gap-2">
            <button className="popular-prev-btn p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button className="popular-next-btn p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={2}
        navigation={{
          prevEl: ".popular-prev-btn",
          nextEl: ".popular-next-btn",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="relative"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {movie.vote_average > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-semibold">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link
                        to={`/filme/${movie.id}`}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        Detalhes
                      </Link>
                    </div>
                  </div>
                </div>

                {movie.release_date && (
                  <div className="absolute top-3 left-3 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {new Date(movie.release_date).getFullYear()}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-red-400 transition-colors">
                  {movie.title}
                </h3>

                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-1 mt-2 md:hidden">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-gray-400 text-xs">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center gap-1 mt-6">
        {movies.slice(0, 6).map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"
          />
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/popular"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105"
        >
          <span>Ver todos os filmes populares</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
