import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-primary text-white mt-12 border-t border-white/20">
      <div className="max-w-7xl mx-auto px-[4%] py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-[15px]">
          
          {/* About */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-secondary">About UbubajiHub</h3>
            <p className="text-white/90 leading-relaxed text-sm">
              Connecting skilled carpenters and furniture makers with customers who value quality craftsmanship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-secondary">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-secondary transition">Home</Link></li>
              <li><Link to="/explore" className="hover:text-secondary transition">Explore</Link></li>
              <li><Link to="/allvendors" className="hover:text-secondary transition">Vendors</Link></li>
              <li><Link to="/about" className="hover:text-secondary transition">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-secondary">Contact</h3>
            <ul className="space-y-2 text-sm text-white/90">
              <li>info@ububajihub.com</li>
              <li>+250 780 000 000</li>
              <li>Kigali, Rwanda</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-secondary">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-secondary transition"><Facebook size={20} /></a>
              <a href="#" className="hover:text-secondary transition"><Instagram size={20} /></a>
              <a href="#" className="hover:text-secondary transition"><Twitter size={20} /></a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-10 pt-5 text-center text-white/80 text-sm">
          © 2025 UbubajiHub — All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;
