import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import { 
  Mail, Lock, Eye, EyeOff, LogIn, Shield,
  Gift, Trophy, Coins, TrendingUp, Star, Sparkles
} from 'lucide-react';

// Rewards Info Component
const RewardsSection = () => {
  const [activeReward, setActiveReward] = useState(0);
  
  const rewards = [
    { points: '10', action: 'Post a Job', icon: '💼' },
    { points: '10', action: 'Share Resource', icon: '📚' },
    { points: '10', action: 'Write Blog', icon: '✍️' },
    { points: '25', action: 'Create Course', icon: '🎓' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReward((prev) => (prev + 1) % rewards.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 lg:p-12">
      <div className="text-center max-w-md">
        {/* Header */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
          <Gift className="w-5 h-5 text-yellow-300" />
          <span className="text-white font-medium">Earn While You Contribute</span>
        </div>
        
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Turn Your <span className="text-yellow-300">Skills</span> Into <span className="text-green-300">Rewards</span>
        </h2>
        <p className="text-blue-100 text-lg mb-10">
          Every contribution you make earns you points. Redeem them for real money!
        </p>
        
        {/* Animated Points Display */}
        <div className="relative mb-10">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-orange-500/30 animate-pulse">
            <div className="text-center">
              <p className="text-4xl font-bold text-white">
                +{rewards[activeReward].points}
              </p>
              <p className="text-white/80 text-xs font-medium">POINTS</p>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
            {rewards[activeReward].icon}
          </div>
        </div>
        
        {/* Current Action */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-8 border border-white/20">
          <p className="text-white font-semibold text-lg">{rewards[activeReward].action}</p>
          <p className="text-blue-200 text-sm">and earn {rewards[activeReward].points} points instantly!</p>
        </div>
        
        {/* Points Value */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <p className="text-white font-bold">10</p>
            <p className="text-blue-200 text-xs">= ₹10</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <p className="text-white font-bold">Top</p>
            <p className="text-blue-200 text-xs">Contributors</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-1" />
            <p className="text-white font-bold">Grow</p>
            <p className="text-blue-200 text-xs">Your Earnings</p>
          </div>
        </div>
        
        {/* CTA Text */}
        <p className="text-blue-100 text-sm flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          Join now and start earning from day one!
          <Sparkles className="w-4 h-4 text-yellow-300" />
        </p>
      </div>
    </div>
  );
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Redirect based on role
      if (result.data?.role === 'super_admin') {
        navigate('/super-admin', { replace: true });
      } else {
        // All other contributors go to contributor dashboard
        navigate('/contributor', { replace: true });
      }
    } else if (result.status === 'pending') {
      navigate('/pending-approval');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Animated Services (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
        
        <RewardsSection />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 bg-gray-50 dark:bg-dark-300">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <Logo size="default" showText={true} linkTo="/" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Login to access your admin dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-blue-500/25"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Login
                </span>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Sign up
            </Link>
          </p>

          {/* Admin Only Notice */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This portal is for admins only. Normal users don't need an account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
