
export const getBaseUrl = () => {
  
  if (window.location.hostname === "localhost") {
    return "http://localhost:3000/api";
  }
  
  return "https://umubaji-hub-be.onrender.com/api";
};
