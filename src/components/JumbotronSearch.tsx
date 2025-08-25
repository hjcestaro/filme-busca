import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function JumbotronSearch() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-purple-600/10 to-blue-600/10 transform skew-y-2 -rotate-2"></div>

      <div className="relative bg-gray-800/50 backdrop-blur-md p-8 md:p-12 lg:p-16 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
          Pronto para encontrar o seu {" "}
          <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            filme favorito
          </span>
          ?
        </h2>

        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Descubra curiosidades sobre seu filme favoritos.
        </p>

        <Link
          to="/busca"
          className="group inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-red-500/20"
        >
          <span>Comece a explorar agora</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="mt-8 flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>10,000+ Filmes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Próximos lançamentos</span>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
    </div>
  );
}
