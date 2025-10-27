import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-primary text-white py-10 px-4 mt-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 ml-6">
        <div>
          <h3 className=" text-lg mb-2 text-secondary ">About UbubajiHub</h3>
          <p className="text-sm">
            Connecting skilled carpenters and furniture makers with customers who value quality craftsmanship.
          </p>
        </div>

        
        <div>
          <h3 className="font-medium text-lg mb-2 text-secondary">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link to="/" className="hover:text-gray-300">Explore</Link></li>
            <li><Link to="/" className="hover:text-gray-300">Vendors</Link></li>
            <li><Link to="/" className="hover:text-gray-300">About Us</Link></li>
          </ul>
        </div>

       
        <div>
          <h3 className="font- text-lg mb-2 text-secondary">Contact</h3>
          <ul className="space-y-1 text-sm">
            <li>info@ububajihub.com</li>
            <li>+250 780 000 000</li>
            <li>Kigali, Rwanda</li>
          </ul>
        </div>

       
        <div>
          <h3 className="font-bold text-lg mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-300"><Facebook size={20} /></a>
            <a href="#" className="hover:text-gray-300"><Instagram size={20} /></a>
            <a href="#" className="hover:text-gray-300"><Twitter size={20} /></a>
          </div>
        </div>

      </div>

      
      <div className="text-center text-sm mt-8 border-t border-slate-gray-300 pt-4">
        © 2025 UbubajiHub. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
