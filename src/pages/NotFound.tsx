import { Link } from "react-router-dom";
import { Film, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Film className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-8xl font-bold text-white mb-2">404</h1>
          <h2 className="text-2xl text-gray-400">Página não encontrada</h2>
        </div>

        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          A página que você está procurando não existe ou foi movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Página Inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
