import React from "react";
import PekodaLogo from "../PekodaLogo";

interface LoadingScreenProps {
  isFading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isFading }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center 
        bg-gradient-to-br from-[#FCCBF0]/50 via-[#A259FF]/20 to-[#FF5A57]/20 
        dark:from-black dark:to-gray-700 z-50
        transition-opacity duration-1000 
        ${isFading ? "opacity-0" : "opacity-100"}`}
    >
      <div className="flex flex-col items-center justify-center gap-4 relative w-32 h-32">
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <PekodaLogo size="lg" showText={false} />
        </div>
        {/* Spinner ngoài quay quanh logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-4 border-transparent border-t-purple-700 rounded-full animate-spin"></div>
        </div>
        {/* Spinner trong quay quanh logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-transparent border-t-pink-400 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
