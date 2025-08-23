import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../router/routes';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={ROUTES.HOME} className="text-xl font-bold text-gray-900">
            MyApp
          </Link>

          <nav className="flex space-x-8">
            <Link
              to={ROUTES.HOME}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(ROUTES.HOME)
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>
            <Link
              to={ROUTES.ABOUT}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(ROUTES.ABOUT)
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
