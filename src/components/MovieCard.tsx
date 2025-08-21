import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Movie } from "../types/Movie";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link to={`/filme/${movie.id}`} className="group">
      <div className="relative aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform group-hover:scale-105">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={`Poster de ${movie.title}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <span className="text-gray-500">Imagem não disponível</span>
          </div>
        )}

        {movie.vote_average && movie.vote_average > 0 && (
          <div className="absolute top-2 right-2 bg-gray-900/80 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <Star className="w-3 h-3 fill-current mr-1" />
            {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>

      <div className="mt-2">
        <h3 className="font-medium text-white group-hover:text-red-400 transition-colors line-clamp-1">
          {movie.title}
        </h3>
        {movie.release_date && (
          <p className="text-gray-400 text-sm">
            {new Date(movie.release_date).getFullYear()}
          </p>
        )}
      </div>
    </Link>
  );
}
