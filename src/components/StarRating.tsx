type Props = {
  rating: number;
};

export default function StarRating({ rating }: Props) {
  const filledStars = Math.round(rating / 2);
  const emptyStars = 5 - filledStars;

  return (
    <div className="flex items-center text-yellow-400 text-lg">
      {Array(filledStars).fill(0).map((_, i) => (
        <span key={`filled-${i}`}>★</span>
      ))}
      {Array(emptyStars).fill(0).map((_, i) => (
        <span key={`empty-${i}`}>☆</span>
      ))}
      <span className="text-white text-sm ml-2">{rating.toFixed(1)}/10</span>
    </div>
  );
}
