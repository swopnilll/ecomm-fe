import { Link, useLocation } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ROUTES } from "../../router/routes";
import { useAuth } from "../../hooks/auth/useAuth";
import { useState } from "react";
import CartIcon from "../cart/CartIcon"; // Import CartIcon
import CartModal from "../cart/CartModal"; // Import CartModal

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // New state for cart modal

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user?.role === "admin";
  const isEmployee = user?.role === "employee";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const NavLinks = () => (
    <>
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

      {isAuthenticated && isAdmin && (
        <>
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
          <Link
            to="/admin/users"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive("/admin/users")
                ? "text-blue-600 bg-blue-50"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            User Management
          </Link>
        </>
      )}

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

      {isAuthenticated && isEmployee && (
        <>
          <Link
            to="/products/add"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive("/products/add")
                ? "text-blue-600 bg-blue-50"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            Add Product
          </Link>

          <Link
            to="/products/manage"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive("/products/manage")
                ? "text-blue-600 bg-blue-50"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            Manage Products
          </Link>
        </>
      )}
    </>
  );

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={ROUTES.HOME} className="text-xl font-bold text-gray-900">
              MyApp
            </Link>

            {/* Desktop Nav and Cart Icon */}
            <nav className="hidden md:flex items-center space-x-6">
              <NavLinks />
              {/* Add CartIcon here */}
              <CartIcon onClick={() => setIsCartOpen(true)} />

              {/* User dropdown */}
              {isAuthenticated && !isLoading && (
                <Menu as="div" className="relative inline-block">
                  <MenuButton className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50">
                    {user?.firstName || "User"}
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  </MenuButton>
                  <MenuItems className="absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="py-1">
                      <MenuItem>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Account settings
                        </Link>
                      </MenuItem>
                      {isAdmin && (
                        <>
                          <MenuItem>
                            <Link
                              to="/admin/register"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Register User
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              to="/admin/users"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Manage Users
                            </Link>
                          </MenuItem>
                        </>
                      )}
                      <MenuItem>
                        <Link
                          to="/support"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Support
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link
                          to="/license"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          License
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              )}
              {isLoading && (
                <div className="animate-spin h-5 w-5 border-b-2 border-blue-600 rounded-full" />
              )}
            </nav>

            {/* Mobile button and Cart Icon */}
            <div className="md:hidden flex items-center">
              <CartIcon onClick={() => setIsCartOpen(true)} />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6 text-gray-700" />
                ) : (
                  <Bars3Icon className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-3 space-y-2">
              <NavLinks />
              {isAuthenticated && !isLoading && (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              )}
              {isLoading && (
                <div className="animate-spin h-5 w-5 border-b-2 border-blue-600 rounded-full" />
              )}
            </div>
          </div>
        )}
      </header>

      {/* Cart Modal outside the header */}
      <CartModal open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
