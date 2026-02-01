import { User } from 'lucide-react';

/**
 * Reusable UserAvatar component that displays user's actual profile picture 
 * or falls back to initials/icon
 * 
 * @param {Object} props
 * @param {string} props.avatar - URL of the user's avatar image
 * @param {string} props.name - User's name (used for initials fallback)
 * @param {string} props.size - Size variant: 'xs', 'sm', 'md', 'lg', 'xl'
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.shape - Shape of avatar: 'circle' or 'rounded'
 * @param {string} props.gradientFrom - Tailwind gradient from color (for fallback)
 * @param {string} props.gradientTo - Tailwind gradient to color (for fallback)
 */
const UserAvatar = ({ 
  avatar, 
  name = '', 
  size = 'md', 
  className = '',
  shape = 'circle',
  gradientFrom = 'blue-500',
  gradientTo = 'blue-600',
  showIcon = false
}) => {
  // Get initials from name
  const getInitials = () => {
    if (!name) return showIcon ? null : '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0]?.toUpperCase() || '?';
  };

  // Size configurations
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-14 h-14 text-xl',
    '2xl': 'w-16 h-16 text-2xl',
    '3xl': 'w-20 h-20 text-3xl',
    '4xl': 'w-24 h-24 text-4xl',
    '5xl': 'w-28 h-28 text-5xl',
  };

  // Icon sizes for fallback
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
    '2xl': 'w-8 h-8',
    '3xl': 'w-10 h-10',
    '4xl': 'w-12 h-12',
    '5xl': 'w-14 h-14',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-xl',
    'rounded-lg': 'rounded-lg',
    'rounded-2xl': 'rounded-2xl',
  };

  const baseClasses = `${sizeClasses[size] || sizeClasses.md} ${shapeClasses[shape] || shapeClasses.circle} flex items-center justify-center font-bold overflow-hidden flex-shrink-0`;

  // If avatar URL exists, show the image
  if (avatar && avatar.trim() !== '') {
    return (
      <div className={`${baseClasses} ${className}`}>
        <img 
          src={avatar} 
          alt={name || 'User avatar'} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, replace with initials
            e.target.style.display = 'none';
            e.target.parentElement.classList.add(`bg-gradient-to-br`, `from-${gradientFrom}`, `to-${gradientTo}`);
            e.target.parentElement.innerHTML = `<span class="text-white font-bold">${getInitials()}</span>`;
          }}
        />
      </div>
    );
  }

  // Fallback to initials or icon
  return (
    <div className={`${baseClasses} bg-gradient-to-br from-${gradientFrom} to-${gradientTo} text-white ${className}`}>
      {showIcon ? (
        <User className={iconSizes[size] || iconSizes.md} />
      ) : (
        getInitials()
      )}
    </div>
  );
};

export default UserAvatar;
