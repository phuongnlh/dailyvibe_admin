import React from 'react';

interface PekodaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  textColor?: string;
}

const PekodaLogo: React.FC<PekodaLogoProps> = ({ 
  size = 'md', 
  className = '', 
  showText = false,
  textColor = 'text-white'
}) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-20 w-auto'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Pekoda Logo Image with enhanced visibility */}
      <div className="relative">
        <img 
          src="/logo.png" 
          alt="Pekoda Logo" 
          className={`${sizeClasses[size]} rounded-full shadow-md ring-2 ring-white/50 backdrop-blur-sm`}
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))' }}
        />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className={`mt-3 ${textSizeClasses[size]} font-bold font-poppins ${textColor}`}>
          Pekoda
        </div>
      )}
    </div>
  );
};

export default PekodaLogo;