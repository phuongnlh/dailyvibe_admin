import { AnimatePresence, motion } from "framer-motion";
import {
  ChartBar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Flag,
  Home,
  LogOut,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

interface AdminSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Users Management",
    icon: User,
    path: "/users",
    color: "text-green-600 dark:text-green-400",
  },
  {
    title: "Posts Management",
    icon: FileText,
    path: "/posts",
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    title: "Comments",
    icon: MessageSquare,
    path: "/comments",
    color: "text-cyan-600 dark:text-cyan-400",
  },
  {
    title: "Reports",
    icon: Flag,
    path: "/reports",
    color: "text-red-600 dark:text-red-400",
  },
  {
    title: "Groups Management",
    icon: Users,
    path: "/groups",
    color: "text-pink-600 dark:text-pink-400",
  },
  {
    title: "Ads Management",
    icon: ChartBar,
    path: "/ads",
    color: "text-yellow-600 dark:text-yellow-400",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
    color: "text-gray-600 dark:text-gray-400",
  },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, isCollapsed, onClose, onToggleCollapse }) => {
  const location = useLocation();
  const { admin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      const res = await Swal.fire({
        icon: "warning",
        title: "Logout",
        text: "Are you sure you want to log out?",
        showCancelButton: true,
        confirmButtonText: "Yes, log out",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        reverseButtons: true,
      });

      if (res.isConfirmed) {
        await logout();
        Swal.fire({
          icon: "success",
          title: "Logged out",
          text: "You have been logged out successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while logging out.",
      });
      console.error(error);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 256,
          x: 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex flex-col h-screen sticky top-0 left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30"
      >
        {/* Logo & Toggle */}
        <div
          className={`flex items-center p-4 border-b border-gray-200 dark:border-gray-700 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <img src="/logo.png" alt="Logo" className="object-cover w-full h-full rounded-lg" />
                </div>
                <span className="font-bold text-2xl text-gray-900 dark:text-white">Admin</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  } ${isCollapsed && "justify-center"}`}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : item.color} transition-colors`} />

                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="ml-3 font-medium"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {/* User Info */}
                <div className="flex items-center w-full space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <img
                    src={admin?.avatar_url || "/default-avatar.png"}
                    alt={admin?.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{admin?.fullName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Super Admin</p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {isDark ? (
                      <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="ml-3 text-sm font-medium">Logout</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-3"
              >
                <img
                  src={admin?.avatar_url || "/default-avatar.png"}
                  alt={admin?.fullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all duration-200 group relative"
                >
                  <LogOut className="w-4 h-4" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    Logout
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col"
          >
            {/* Logo */}
            <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="object-cover w-full h-full rounded-lg" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">Admin Panel</span>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto py-4">
              <div className="space-y-1 px-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-white" : item.color}`} />
                      <span className="ml-3 font-medium">{item.title}</span>
                    </NavLink>
                  );
                })}
              </div>
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                <img
                  src={admin?.avatar_url || "/default-avatar.png"}
                  alt={admin?.fullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{admin?.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Super Admin</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="ml-3 text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
