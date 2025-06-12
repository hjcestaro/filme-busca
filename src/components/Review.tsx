import { useEffect, useState } from "react";
import { api } from "../utils/api";

interface Props {
  id: string | undefined;
}

interface Review {
  author: string;
  content: string;
}

export default function Review({ id }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const reviewRes = await api.get(`/movie/${id}/reviews`);
        setReviews(reviewRes.data.results);
        console.log(reviewRes.data.results);
      } catch (err) {
        console.error("Erro ao buscar review:", err);
      }
    };

    if (id) {
      fetchReview();
    }
  }, [id]);

  return (
    <div>
      {reviews.length > 0 && (
        <div className="mt-8 text-white">
          <h3 className="text-xl font-bold mb-4">Críticas</h3>
          <ul className="space-y-4">
            {reviews.slice(0, 5).map((review, index) => (
              <li key={index}>
                <p className="text-sm text-blue-300 font-medium">
                  {review.author}
                </p>
                <p className="text-base mt-1">{review.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
