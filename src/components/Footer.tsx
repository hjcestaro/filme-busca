import { Heart, Github, Film, Popcorn } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Film className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-bold text-white">MovieHub</span>
            </div>
            <p className="text-gray-400">
              O seu portal definitivo para descobrir, explorar e salvar seus
              filmes favoritos.
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <span>Feito com</span>
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <span>Henrique Julio Cestaro</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/popular"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  Filmes Populares
                </Link>
              </li>
              <li>
                <Link
                  to="/em-cartaz"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  Em Cartaz
                </Link>
              </li>
              <li>
                <Link
                  to="/favoritos"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  Seus Favoritos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.themoviedb.org/"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  TMDB
                </a>
              </li>
              <li>
                <a
                  href="https://developer.themoviedb.org/docs/getting-started"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  Documentação
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Conecte-se
            </h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://github.com/hjcestaro"
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400">cestarodev@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} MovieHub. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1 mt-4 md:mt-0">
            <Popcorn className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">
              Dados providos por The Movie Database (TMDb)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
