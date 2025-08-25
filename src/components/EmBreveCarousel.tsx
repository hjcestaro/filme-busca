import { useEffect, useState } from "react";
import { fetchUpcomingMovies } from "../utils/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import NotAvailable from "../assets/No_Available.jpg";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

export default function EmBreveCarousel() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        const upcomingMovies = await fetchUpcomingMovies(10);
        setMovies(upcomingMovies);
      } catch (err) {
        console.error("Failed to load upcoming movies:", err);
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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-700 rounded-lg animate-pulse"></div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent">
              Carregando...
            </h2>
          </div>
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

  if (movies.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Nenhum lançamento em breve
          </h2>
          <p className="text-gray-400 mb-6">
            Volte em breve para descobrir os próximos lançamentos!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">🚀 Em Breve nos Cinemas</h2>

        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden md:block">
            {movies.length} lançamentos
          </span>
          <div className="flex gap-2">
            <button className="em-breve-prev-btn p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button className="em-breve-next-btn p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600">
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
          prevEl: ".em-breve-prev-btn",
          nextEl: ".em-breve-next-btn",
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
            <div className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="relative aspect-[2/3] overflow-hidden">
                <Link to={`/filme/${movie.id}`}>
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-800">
                      <img
                        src={NotAvailable}
                        alt="Imagem indisponível"
                        className="h-1/2 w-1/2 object-contain opacity-50"
                      />
                    </div>
                  )}

                  {movie.release_date && (
                    <div className="absolute top-3 left-3 bg-blue-600/90 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatReleaseDate(movie.release_date)}
                    </div>
                  )}
                </Link>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
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

      <div className="text-center mt-12">
        <Link
          to="/em-breve"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105"
        >
          <span>Ver mais filmes</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
