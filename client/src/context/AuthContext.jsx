import React, { createContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearCartState } from '../redux/cartSlice'; // new action to reset cart

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userToken', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    dispatch(clearCartState()); // clear cart when logging out
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
