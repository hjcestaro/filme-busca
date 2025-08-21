import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { Star, MessageSquare, User } from "lucide-react";

interface Props {
  id: string | undefined;
  maxItems?: number;
}

interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    rating?: number;
    username: string;
  };
}

export default function Review({ id, maxItems = 3 }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchReview = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const reviewRes = await api.get(`/movie/${id}/reviews`);
        setReviews(reviewRes.data.results);
      } catch (err) {
        console.error("Erro ao buscar reviews:", err);
        setError("Não foi possível carregar as críticas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  const toggleReview = (id: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 mt-8">
        <div className="h-8 w-1/4 bg-gray-700 rounded animate-pulse"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3 p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
              <div className="space-y-1">
                <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-gray-400">
        {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-600" />
        <p>Nenhuma crítica disponível</p>
      </div>
    );
  }

  return (
    <section className="space-y-6 mt-8">
      <h3 className="text-2xl font-bold flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-red-500" />
        Críticas
      </h3>
      
      <ul className="space-y-4">
        {reviews.slice(0, maxItems).map((review) => {
          const isExpanded = expandedReviews.has(review.id);
          const previewContent = 
            review.content.length > 250 && !isExpanded
              ? `${review.content.substring(0, 250)}...`
              : review.content;
              
          return (
            <li key={review.id} className="bg-gray-800 rounded-lg p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-white truncate">
                      {review.author_details.username || review.author}
                    </h4>
                    {review.author_details.rating && (
                      <span className="flex items-center gap-1 text-sm bg-gray-700 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span>{review.author_details.rating.toFixed(1)}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(review.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              <div className="text-gray-300 whitespace-pre-line">
                {previewContent}
              </div>
              
              {review.content.length > 250 && (
                <button
                  onClick={() => toggleReview(review.id)}
                  className="mt-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  {isExpanded ? 'Mostrar menos' : 'Ler mais'}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      
      {reviews.length > maxItems && (
        <div className="text-center pt-2">
          <button className="text-sm text-gray-400 hover:text-white transition-colors">
            Ver todas as críticas ({reviews.length})
          </button>
        </div>
      )}
    </section>
  );
}