'use client';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context
const UserContext = createContext();

// Create a context provider
export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState({}); // Set initial state to empty object
  const token = Cookies.get('token');
  const router = useRouter();

  // Get the current route
  const currentPath = window.location.pathname;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        // Check if the user is trying to access a non-auth page
        if (!currentPath.startsWith('/auth')) {
          console.log('Redirecting to login due to no token...');
          router.push('/auth/login');
        }
        return; // Don't proceed if there is no token
      }

      try {
        const { data } = await axios.get(`/auth/me`);

        // Check if data exists and set it
        if (data) {
          console.log('working');
          setUserData(data);
        } else {
          console.log('Redirecting to login due to no user data...');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          router.push('/auth/login');
        }
      }
    };

    // Only fetch user data on client side
    fetchUserData();
  }, [token]);

  // Log userData to help with debugging
  console.log('User Data:', userData);

  return <UserContext.Provider value={{ userData, setUserData }}>{children}</UserContext.Provider>;
};

// Custom hook to consume the context
export const useUserData = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }

  return context;
};
