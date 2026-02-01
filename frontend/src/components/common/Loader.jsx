const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: { container: 'w-12 h-12', logo: 'w-8 h-8 text-xs', border: 'border-2' },
    md: { container: 'w-16 h-16', logo: 'w-11 h-11 text-sm', border: 'border-[3px]' },
    lg: { container: 'w-20 h-20', logo: 'w-14 h-14 text-base', border: 'border-[3px]' },
    xl: { container: 'w-24 h-24', logo: 'w-18 h-18 text-lg', border: 'border-4' },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Compact Logo with Spinning Ring */}
      <div className={`relative ${currentSize.container} flex items-center justify-center`}>
        {/* Spinning Ring - tight around logo */}
        <div 
          className={`absolute inset-0 ${currentSize.border} border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin`}
          style={{ animationDuration: '0.8s' }}
        />
        
        {/* Circle Logo - EL */}
        <div className={`${currentSize.logo} rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg`}>
          EL
        </div>
      </div>
      
      {/* Loading Text */}
      {text && (
        <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
