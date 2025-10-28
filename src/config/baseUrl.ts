
export const getBaseUrl = () => {
  
  if (window.location.hostname === "localhost") {
    return "http://localhost:3000/api";
  }
  
  return "https://your-production-domain.com/api";
};
