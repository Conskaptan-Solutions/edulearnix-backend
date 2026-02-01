import { Link } from 'react-router-dom';

const Logo = ({ size = 'default', showText = true, linkTo = '/' }) => {
  const sizes = {
    small: { container: 'w-8 h-8', text: 'text-lg', letterSize: 'text-sm' },
    default: { container: 'w-10 h-10', text: 'text-xl', letterSize: 'text-lg' },
    large: { container: 'w-14 h-14', text: 'text-2xl', letterSize: 'text-xl' },
  };

  const currentSize = sizes[size] || sizes.default;

  const LogoContent = () => (
    <div className="flex items-center gap-2">
      {/* Logo Icon - Modern EL Design with Blue gradient */}
      <div className={`${currentSize.container} rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/25 relative overflow-hidden`}>
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
        <span className={`text-white font-bold ${currentSize.letterSize} tracking-tight relative z-10`}>EL</span>
      </div>
      
      {showText && (
        <span className={`${currentSize.text} font-bold font-display`}>
          <span className="text-blue-600 dark:text-blue-400">Edu</span>
          <span className="text-gray-900 dark:text-white">Learnix</span>
        </span>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="flex items-center">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
};

export default Logo;
