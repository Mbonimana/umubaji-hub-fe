export const getBaseUrl = () => {
  // Check if running in the browser and on localhost
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
      return 'https://umubaji-hub-bn.andasy.dev/api';
    }
  }

  // If not localhost, 
  return 'https://umubaji-hub-bn.andasy.dev/api'; // replace with your real deployed URL
};
