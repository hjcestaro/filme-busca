import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  isLoading?: boolean;
  onPageChange: (newPage: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  isLoading = false,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const handleChange = (newPage: number) => {
    if (!isLoading && newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      {/* Botão anterior */}
      <button
        onClick={() => handleChange(page - 1)}
        disabled={page === 1 || isLoading}
        className={`flex items-center gap-1 px-4 py-2 rounded-full ${
          page === 1 || isLoading
            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Anterior</span>
      </button>

      {/* Números */}
      <div className="flex items-center gap-2">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (page <= 3) {
            pageNum = i + 1;
          } else if (page >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = page - 2 + i;
          }

          return (
            <button
              key={pageNum}
              onClick={() => handleChange(pageNum)}
              disabled={isLoading}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                page === pageNum
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {totalPages > 5 && page < totalPages - 2 && (
          <>
            <span className="text-gray-400">...</span>
            <button
              onClick={() => handleChange(totalPages)}
              disabled={isLoading}
              className="w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Botão próxima */}
      <button
        onClick={() => handleChange(page + 1)}
        disabled={page === totalPages || isLoading}
        className={`flex items-center gap-1 px-4 py-2 rounded-full ${
          page === totalPages || isLoading
            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
      >
        <span>Próxima</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
