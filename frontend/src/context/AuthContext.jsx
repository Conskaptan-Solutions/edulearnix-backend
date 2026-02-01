import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('edulearnix_token');
      const savedUser = localStorage.getItem('edulearnix_user');

      if (token && savedUser) {
        try {
          // Verify token by fetching current user
          const response = await api.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.data);
            setIsAuthenticated(true);
          }
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('edulearnix_token');
          localStorage.removeItem('edulearnix_user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signup = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      if (response.data.success) {
        toast.success(response.data.message);
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, ...userData } = response.data.data;
        
        localStorage.setItem('edulearnix_token', token);
        localStorage.setItem('edulearnix_user', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        
        toast.success('Login successful!');
        return { success: true, data: userData };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      const status = error.response?.data?.status;
      
      toast.error(message);
      return { success: false, message, status };
    }
  };

  const logout = () => {
    localStorage.removeItem('edulearnix_token');
    localStorage.removeItem('edulearnix_user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      if (response.data.success) {
        setUser(response.data.data);
        localStorage.setItem('edulearnix_user', JSON.stringify(response.data.data));
        toast.success('Profile updated successfully');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signup,
    login,
    logout,
    updateProfile,
    isSuperAdmin: user?.role === 'super_admin',
    canPostJobs: ['super_admin', 'job_poster'].includes(user?.role),
    canPostResources: ['super_admin', 'resource_poster'].includes(user?.role),
    canPostBlogs: ['super_admin', 'blog_poster', 'tech_blog_poster'].includes(user?.role),
    canPostProducts: ['super_admin', 'digital_product_poster'].includes(user?.role),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
