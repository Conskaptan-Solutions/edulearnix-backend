import { Check } from 'lucide-react';

const VerifiedBadge = ({ user, size = 'sm' }) => {
  // Show verified badge only for super_admin
  if (user?.role !== 'super_admin') return null;

  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm`}
      title="Verified Super Admin"
      style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
      }}
    >
      <Check 
        className={`${iconSizes[size]} text-white stroke-[3.5] font-bold`}
        strokeWidth={3.5}
      />
    </div>
  );
};

export default VerifiedBadge;
