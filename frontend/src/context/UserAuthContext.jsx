import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const UserAuthContext = createContext();

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within UserAuthProvider');
  }
  return context;
};

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const userToken = localStorage.getItem('userToken');
      const adminToken = localStorage.getItem('token');

      if (userToken) {
        try {
          const res = await api.get('/user-auth/me', {
            headers: { Authorization: `Bearer ${userToken}` }
          });
          setUser(res.data.user);
        } catch (err) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
        }
      } else if (adminToken) {
        // If admin token exists, restore session from stored user data
        const adminData = localStorage.getItem('user');
        if (adminData) {
          try {
            setUser(JSON.parse(adminData));
          } catch (err) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/user-auth/login', { email, password });
    const { token, user: userData, role } = res.data;

    if (role === 'admin') {
      // Store admin credentials in the admin storage keys
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData); // Set user state for admin as well
      return { ...res.data, isAdmin: true };
    }

    // Regular user
    localStorage.setItem('userToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const register = async (formData) => {
    const res = await api.post('/user-auth/register', formData);
    return res.data;
  };

  const verifyOTP = async (email, otp) => {
    const res = await api.post('/user-auth/verify-otp', { email, otp });
    const { token, user: userData } = res.data;
    localStorage.setItem('userToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const forgotPassword = async (email) => {
    const res = await api.post('/user-auth/forgot-password', { email });
    return res.data;
  };

  const resetPassword = async (email, otp, newPassword) => {
    const res = await api.post('/user-auth/reset-password', { email, otp, newPassword });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    verifyOTP,
    forgotPassword,
    resetPassword,
    logout,
    isAuthenticated: !!user
  };

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
};
