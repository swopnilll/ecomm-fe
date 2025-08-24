import { Link, useLocation } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ROUTES } from "../../router/routes";
import { useAuth } from "../../hooks/auth/useAuth";

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={ROUTES.HOME} className="text-xl font-bold text-gray-900">
            MyApp
          </Link>

          <nav className="flex items-center space-x-8">
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

            {isAuthenticated && (
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
            )}

            {/* Admin-specific navigation */}
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin/register"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/admin/register")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Register User
              </Link>
            )}

            {/* Show login/register links only when not authenticated */}
            {!isAuthenticated && !isLoading && (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(ROUTES.LOGIN)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Login
                </Link>

                <Link
                  to={ROUTES.REGISTER}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(ROUTES.REGISTER)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Register
                </Link>
              </>
            )}

            {/* Show user dropdown when authenticated */}
            {isAuthenticated && !isLoading && (
              <Menu as="div" className="relative inline-block">
                <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50">
                  {user?.firstName || "User"}
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="-mr-1 size-5 text-gray-400"
                  />
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <div className="py-1">
                    <MenuItem>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                      >
                        Account settings
                      </Link>
                    </MenuItem>

                    {/* Admin-only menu items */}
                    {isAdmin && (
                      <>
                        <MenuItem>
                          <Link
                            to="/admin/register"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                          >
                            Register User
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            to="/admin/users"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                          >
                            Manage Users
                          </Link>
                        </MenuItem>
                      </>
                    )}

                    <MenuItem>
                      <Link
                        to="/support"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                      >
                        Support
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        to="/license"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                      >
                        License
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                      >
                        Sign out
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
            )}

            {/* Show loading indicator while checking auth status */}
            {isLoading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
