// src/pages/NotFound.tsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>404 - Sorry, Page Not Found</h1>
      
      <Link to="/">Go Back Home</Link>
    </div>
  );
}
