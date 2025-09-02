import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Brain, 
  History, 
  Settings, 
  BarChart3, 
  Users, 
  Building2,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const userMenuItems = [
    { path: '/analysis', label: 'Analysis', icon: Brain },
    { path: '/history', label: 'History', icon: History },
    { path: '/profile', label: 'Profile Settings', icon: Settings },
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/partners', label: 'Partners', icon: Building2 },
    { path: '/admin/profile', label: 'Admin Profile', icon: User },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0  w-64 bg-gradient-to-b from-[#2A1458] to-[#9B177E] 
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <Link to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/analysis') : '/'} className="flex items-center space-x-3 group">
              <div className="bg-white/10 rounded-full p-2 group-hover:bg-white/20 transition-colors duration-200">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CogniVoice</h1>
                <p className="text-xs text-white/80">AI Speech Analysis</p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
        {/* --- AVATAR DISPLAY LOGIC --- */}
        <img
        src={user?.avatarUrl ? `${import.meta.env.VITE_REACT_APP_API_URL}${user.avatarUrl}` : '/default-avatar.png'}
        alt="User Avatar"
        className="w-12 h-12 rounded-full object-cover bg-white/20 border-2 border-white/50"
          />
        {/* --- END OF AVATAR LOGIC --- */}
        <div>
          <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
          <p className="text-white/70 text-sm capitalize">{user?.role}</p>
        </div>
      </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${location.pathname === item.path
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/20">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;