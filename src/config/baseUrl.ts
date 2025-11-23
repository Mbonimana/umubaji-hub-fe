export const getBaseUrl = () => {
  // Check if running in the browser and on localhost
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3000/api';
    }
  }

  // If not localhost, assume deployed
  return 'https://your-deployed-domain.com/api'; 
};
