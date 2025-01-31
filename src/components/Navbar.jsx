import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import {
  ShoppingCartIcon,
  UserCircleIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const totalCartItems = items.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-primary to-primary-hover text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-20">
          <Link
            to="/"
            className="text-2xl font-bold hover:text-gray-200 transition-colors duration-200 flex items-center space-x-2"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2589/2589903.png"
              alt="Sneaker Store"
              className="h-10 w-10"
            />
            <span>Sneaker Store</span>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-primary-hover transition-colors"
          >
            {isMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              Home
            </Link>

            {user ? (
              <div className="flex items-center space-x-8">
                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <UserCircleIcon className="h-6 w-6" />
                    <span>{user.name}</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        {user.role === "manager" && (
                          <Link
                            to="/dashboard"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/cart"
                  className="text-white hover:text-gray-200 transition-colors duration-200 relative"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {totalCartItems}
                    </span>
                  )}
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
            </form>

            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block text-white hover:text-gray-200 transition-colors duration-200"
            >
              Home
            </Link>

            {user ? (
              <>
                <div className="flex items-center space-x-2 py-2">
                  <UserCircleIcon className="h-6 w-6" />
                  <span>{user.name}</span>
                </div>

                {user.role === "manager" && (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                )}

                <Link
                  to="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white hover:text-gray-200 transition-colors duration-200 relative inline-flex items-center"
                >
                  <ShoppingCartIcon className="h-6 w-6 mr-2" />
                  <span>Cart</span>
                  {totalCartItems > 0 && (
                    <span className="ml-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalCartItems}
                    </span>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="block w-full bg-white text-primary px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white hover:text-gray-200 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-white text-primary px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
