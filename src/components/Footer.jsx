import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '/src/assets/synclon-logo.jpg';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 border-b border-gray-800 pb-10">
          {/* Branding & Description */}
          <div className="flex-1 min-w-[220px] mb-8 md:mb-0">
            <span className="text-2xl font-bold tracking-tight">Green Reuse Exchange</span>
            <p className="text-gray-400 text-base mb-4 max-w-sm">
              Building a sustainable future through community-driven reuse and exchange.
            </p>

            {/* Quick Links removed as requested */}
          </div>

          {/* Center: Logo & Built By */}
          <div className="flex flex-col items-start md:items-center justify-center flex-1 min-w-[180px] mb-8 md:mb-0">
            <div className="flex flex-col items-start md:items-center mb-4">
              <img src={logo} alt="Synclon Technologies Logo" className="w-20 h-20 rounded-full shadow-lg mb-2" />
              <span className="text-sm text-gray-350">Built by <b><u>Synclon Technologies</u></b></span>
            </div>
          </div>

          {/* Contact */}
          <div className="flex-1 min-w-[220px]">
            <h3 className="text-lg font-semibold mb-4 tracking-wide">Contact Us:</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-green-400" />
                <a href="mailto:clintonmg17@gmail.com" className="text-gray-400 hover:text-green-400 transition-colors text-base">
                  clintonmg17@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-green-400" />
                <a href="tel:+254717833069" className="text-gray-400 hover:text-green-400 transition-colors text-base">
                  +254 717 833 069
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-400" />
                <span className="text-gray-400 text-base">Kisii County, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Green Reuse Exchange. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
