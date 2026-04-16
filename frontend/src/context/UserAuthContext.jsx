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
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const res = await api.get('/user-auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data.user);
        } catch (err) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
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
