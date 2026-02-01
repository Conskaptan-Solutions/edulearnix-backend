import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import { 
  User, Mail, Lock, Eye, EyeOff, UserPlus, CheckSquare, Square,
  Gift, Trophy, Coins, TrendingUp, Sparkles, Wallet, Clock, Home, CheckCircle
} from 'lucide-react';

// Rewards Info Component
const RewardsSection = () => {
  const [count, setCount] = useState(0);
  
  const stats = [
    { value: '₹10', label: 'Per 10 Points', icon: Coins },
    { value: '100+', label: 'Active Contributors', icon: User },
    { value: '₹20K+', label: 'Paid Out', icon: Wallet },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev < 1250 ? prev + 25 : 0));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 lg:p-12">
      <div className="text-center max-w-md">
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
          <Gift className="w-5 h-5 text-yellow-300" />
          <span className="text-white font-medium">Rewards Program</span>
        </div>
        
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Contribute & <span className="text-green-300">Earn</span> Money
        </h2>
        <p className="text-blue-100 text-lg mb-8">
          Join our community of contributors and get rewarded for every post you share
        </p>
        
        {/* Animated Counter */}
        <div className="relative mb-8">
          <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{count}</p>
              <p className="text-white/80 text-sm font-medium">YOUR POINTS</p>
            </div>
          </div>
          <div className="absolute top-0 right-1/4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
            <span className="text-lg">⭐</span>
          </div>
          <div className="absolute bottom-4 left-1/4 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <span className="text-sm">💎</span>
          </div>
        </div>
        
        {/* How it works */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-8 border border-white/20 text-left">
          <h3 className="text-white font-semibold text-center mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            How It Works
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">1</span>
              <p className="text-blue-100 text-sm">Sign up as a Contributor</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">2</span>
              <p className="text-blue-100 text-sm">Post Jobs, Resources & Blogs</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">3</span>
              <p className="text-blue-100 text-sm">Earn points & redeem for cash!</p>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/5 rounded-xl p-3 border border-white/10">
              <stat.icon className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-white font-bold text-sm">{stat.value}</p>
              <p className="text-blue-200 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'job_poster',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { value: 'job_poster', label: 'Job Contributor' },
    { value: 'resource_poster', label: 'Resource Contributor' },
    { value: 'tech_blog_poster', label: 'Tech Blog/Event Contributor' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      alert('Please accept the Terms & Conditions to continue');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setLoading(true);
    const result = await signup(formData);

    if (result.success) {
      setSubmitted(true);
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

      {/* Right Side - Form or Pending Approval */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 bg-gray-50 dark:bg-dark-300">
        <div className="w-full max-w-md">
          {submitted ? (
            /* Pending Approval Message */
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Request Submitted!</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Your contributor request has been submitted successfully. Please wait for admin approval.
              </p>

              {/* What happens next */}
              <div className="bg-white dark:bg-dark-100 rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700 text-left">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  What happens next?
                </h3>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-500 text-xs font-medium">1</span>
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Admin reviews your request</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-500 text-xs font-medium">2</span>
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">You'll be notified via email</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-500 text-xs font-medium">3</span>
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Login & start earning rewards!</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/" 
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all text-sm"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
                <Link 
                  to="/login" 
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-dark-100 hover:bg-gray-200 dark:hover:bg-dark-200 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all text-sm border border-gray-200 dark:border-gray-700"
                >
                  Sign In
                </Link>
              </div>
            </div>
          ) : (
            /* Signup Form */
            <>
              {/* Logo & Header */}
              <div className="text-center mb-6">
                <div className="flex justify-center">
                  <Logo size="default" showText={true} linkTo="/" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-1">
                  Request Admin Access
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Sign up to become an admin contributor
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Role Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Select Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm appearance-none cursor-pointer"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
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
                      minLength={6}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                      placeholder="Create a password"
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setAcceptTerms(!acceptTerms)}
                    className="flex-shrink-0 mt-0.5"
                  >
                    {acceptTerms ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <Link to="/terms-of-service" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Terms & Conditions
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !acceptTerms}
                  className="w-full py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-blue-500/25"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Submit Request
                    </span>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
