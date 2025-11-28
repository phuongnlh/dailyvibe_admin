import { Code, Heart } from "lucide-react";
import React from "react";

const AdminFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        {/* Copyright */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>© {currentYear} Social Media Platform.</span>
          <span>All rights reserved.</span>
        </div>

        {/* Made with love */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-red-500 fill-current" />
          <span>by</span>
          <Code className="w-4 h-4 text-purple-500" />
          <span className="font-medium text-purple-600 dark:text-purple-400">VTC Team</span>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6 text-sm">
          <a
            href="#"
            className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
