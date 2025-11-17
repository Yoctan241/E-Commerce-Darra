import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2d7a3e] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                <span className="text-[#2d7a3e] font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold">DARRA</span>
            </div>
            <p className="text-[#c8e6c9] text-sm">Votre confort commence ici</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Liens Rapides</h3>
            <ul className="space-y-2 text-sm text-[#c8e6c9]">
              <li><a href="#" className="hover:text-white transition">Home</a></li>
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Download</a></li>
              <li><a href="#" className="hover:text-white transition">Catalogue</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Support</h3>
            <ul className="space-y-2 text-sm text-[#c8e6c9]">
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Infos Livraison</a></li>
              <li><a href="#" className="hover:text-white transition">Retours</a></li>
              <li><a href="#" className="hover:text-white transition">Suivi Commande</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Infolettre</h3>
            <p className="text-sm text-[#c8e6c9] mb-4">Abonnez-vous pour des offres exclusives</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-3 py-2 bg-white/20 rounded text-sm text-white placeholder-[#a5d6a7] focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-4 py-2 bg-white text-[#2d7a3e] hover:bg-[#e8f5e9] rounded transition font-bold">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#4a9d5f] py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social */}
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/10 hover:bg-[#4a9d5f] rounded-full transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-[#4a9d5f] rounded-full transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-[#4a9d5f] rounded-full transition">
                <Instagram size={20} />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-[#c8e6c9]">
              © 2024 Darra. Tous droits réservés.
            </p>

            {/* Legal */}
            <div className="flex gap-4 text-sm text-[#c8e6c9]">
              <a href="#" className="hover:text-white transition">Confidentialité</a>
              <a href="#" className="hover:text-white transition">Conditions</a>
              <a href="#" className="hover:text-white transition">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}