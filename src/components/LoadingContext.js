import React, { createContext, useState, useContext } from 'react';

// Create a context for loading state
const LoadingContext = createContext();

export const useLoading = () => {
  return useContext(LoadingContext);
};

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // Function to show the loading screen
  const showLoading = () => setLoading(true);

  // Function to hide the loading screen
  const hideLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
