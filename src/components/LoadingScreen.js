import React from 'react';
import { useLoading } from '../components/LoadingContext';

const LoadingScreen = () => {
  const { loading } = useLoading();

  if (!loading) return null; // Don't render the loading screen if not loading

  return (
    <div className="loading-overlay">
      <div className="spinner">
            
      </div>
      {/* You can customize this spinner with CSS or any library */}
    </div>
  );
};

export default LoadingScreen;
