import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, Menu, X, User, LogOut, History, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/partners', label: 'Partners' },
  ];

  return (
    <header className="bg-white shadow-lg border-b-2 border-[#FFEAD8] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/analysis') : '/'} className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-[#9B177E] to-[#2A1458] rounded-full p-2 group-hover:scale-105 transition-transform duration-200">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2A1458]">CogniVoice</h1>
              <p className="text-xs text-[#9B177E]">AI Speech Analysis</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors duration-200 hover:text-[#9B177E] ${
                  location.pathname === item.path
                    ? 'text-[#9B177E] border-b-2 border-[#9B177E] pb-1'
                    : 'text-[#2A1458]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-[#E8988A] to-[#9B177E] text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  <span>{user.firstName}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-[#FFEAD8] py-2 z-50">
                    <Link
                      to={user.role === 'admin' ? '/admin/dashboard' : '/analysis'}
                      className="block px-4 py-2 text-[#2A1458] hover:bg-[#FFEAD8] transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-[#2A1458] hover:bg-[#FFEAD8] transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    {user.role === 'user' && (
                      <Link
                        to="/history"
                        className="block px-4 py-2 text-[#2A1458] hover:bg-[#FFEAD8] transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        History
                      </Link>
                    )}
                    <hr className="my-2 border-[#FFEAD8]" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-[#2A1458] font-medium hover:text-[#9B177E] transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-[#9B177E] to-[#2A1458] text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#2A1458] hover:text-[#9B177E] transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#FFEAD8]">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-medium transition-colors duration-200 hover:text-[#9B177E] ${
                    location.pathname === item.path ? 'text-[#9B177E]' : 'text-[#2A1458]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {user ? (
                <div className="pt-4 border-t border-[#FFEAD8]">
                  <Link
                    to={user.role === 'admin' ? '/admin/dashboard' : '/analysis'}
                    className="block text-[#2A1458] font-medium hover:text-[#9B177E] transition-colors duration-200 mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block text-[#2A1458] font-medium hover:text-[#9B177E] transition-colors duration-200 mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  {user.role === 'user' && (
                    <Link
                      to="/history"
                      className="block text-[#2A1458] font-medium hover:text-[#9B177E] transition-colors duration-200 mb-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      History
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block text-red-600 font-medium hover:text-red-800 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-[#FFEAD8] space-y-2">
                  <Link
                    to="/login"
                    className="block text-[#2A1458] font-medium hover:text-[#9B177E] transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-gradient-to-r from-[#9B177E] to-[#2A1458] text-white px-6 py-2 rounded-full text-center hover:shadow-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;