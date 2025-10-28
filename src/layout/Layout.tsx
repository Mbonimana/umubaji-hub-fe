import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/footer";
import Navbar from "../components/NavBar/navbar";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen " >
      <Navbar/>

      
      <main className="flex-1">
        <Outlet />
      </main>

     
      <Footer />
    </div>
  );
}
