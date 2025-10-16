import { Menu } from "lucide-react";
import React from "react";

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
