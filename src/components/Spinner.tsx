import { Film } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div
          className={`
            ${sizeClasses[size]}
            animate-spin rounded-full border-3 border-solid border-red-500 border-r-transparent
          `}
          role="status"
        >
          <span className="sr-only">Carregando...</span>
        </div>

        {size !== "sm" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Film
              className={`${
                size === "lg" ? "w-5 h-5" : "w-3 h-3"
              } text-red-500`}
            />
          </div>
        )}
      </div>

      {size === "lg" && (
        <p className="mt-3 text-red-500 text-sm font-medium animate-pulse">
          Carregando...
        </p>
      )}
    </div>
  );
}
