import { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X, Heart, LogOut, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
  onAuthClick?: () => void;
  isLoggedIn?: boolean;
  userRole?: 'user' | 'admin';
  userName?: string;
  onLogout?: () => void;
}

export default function Header({ 
  cartCount = 0, 
  onCartClick, 
  onAuthClick,
  isLoggedIn = false,
  userRole = 'user',
  userName = '',
  onLogout
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-[#faf8f3] border-b-2 border-[#e8f5e9] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 bg-[#2d7a3e] rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-lg font-bold text-[#2d7a3e]">DARRA</span>
          </div>

            {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-[#2d7a3e] hover:text-[#4a9d5f] transition font-medium">Accueil</a>
            <a href="#about" className="text-[#2d7a3e] hover:text-[#4a9d5f] transition font-medium">À Propos</a>
            <a href="#catalogue" className="text-[#2d7a3e] hover:text-[#4a9d5f] transition font-medium">Catalogue</a>
            {isLoggedIn && userRole === 'admin' && (
              <a href="/admin" className="text-[#d4a574] hover:text-[#b8935f] transition font-medium border border-[#d4a574] px-3 py-1 rounded">
                🛠️ Admin
              </a>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden sm:flex items-center bg-white rounded-lg px-3 py-2 border border-[#e8f5e9]">
              <Search size={18} className="text-[#999]" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-transparent ml-2 outline-none text-sm w-32 text-[#555]"
              />
            </div>

            {/* Wishlist */}
            <button className="p-2 text-[#2d7a3e] hover:text-[#4a9d5f] transition">
              <Heart size={24} />
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-[#2d7a3e] hover:text-[#4a9d5f] transition"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#ff9a56] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 text-[#2d7a3e] hover:text-[#4a9d5f] transition bg-white rounded-lg border border-[#e8f5e9]"
                >
                  <div className="w-8 h-8 bg-[#2d7a3e] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {userName.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block font-medium">{userName || 'Utilisateur'}</span>
                  {userRole === 'admin' && <Shield size={16} className="text-[#d4a574]" />}
                </button>

                {/* User Menu Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e8f5e9] z-50">
                    <div className="p-3 border-b border-[#e8f5e9]">
                      <p className="font-medium text-[#2d7a3e]">{userName || 'Utilisateur'}</p>
                      <p className="text-sm text-gray-500 capitalize">{userRole}</p>
                    </div>
                    <div className="py-2">
                      <a href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <User size={16} />
                        Mon Compte
                      </a>
                      <a href="/settings" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <Settings size={16} />
                        Paramètres
                      </a>
                      {userRole === 'admin' && (
                        <a href="/admin" className="flex items-center gap-2 px-4 py-2 text-[#d4a574] hover:bg-gray-100">
                          <Shield size={16} />
                          Interface Admin
                        </a>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          onLogout?.();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut size={16} />
                        Se Déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={onAuthClick}
                className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white px-4 py-2 rounded-lg font-medium"
              >
                Se Connecter
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#2d7a3e]"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2 border-t border-[#e8f5e9] pt-4">
            <a href="/" className="text-[#2d7a3e] hover:text-[#4a9d5f] py-2 font-medium">Accueil</a>
            <a href="#about" className="text-[#2d7a3e] hover:text-[#4a9d5f] py-2 font-medium">À Propos</a>
            <a href="#catalogue" className="text-[#2d7a3e] hover:text-[#4a9d5f] py-2 font-medium">Catalogue</a>
            
            {/* Mobile Auth Section */}
            <div className="pt-2 border-t border-[#e8f5e9] mt-2">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 py-2">
                    <div className="w-8 h-8 bg-[#2d7a3e] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {userName.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="font-medium text-[#2d7a3e]">{userName || 'Utilisateur'}</span>
                    {userRole === 'admin' && <Shield size={16} className="text-[#d4a574]" />}
                  </div>
                  <a href="/dashboard" className="text-[#2d7a3e] hover:text-[#4a9d5f] py-2 font-medium block">Mon Compte</a>
                  {userRole === 'admin' && (
                    <a href="/admin" className="text-[#d4a574] hover:text-[#b8935f] py-2 font-medium block">Interface Admin</a>
                  )}
                  <button
                    onClick={onLogout}
                    className="text-red-600 hover:text-red-700 py-2 font-medium text-left w-full"
                  >
                    Se Déconnecter
                  </button>
                </div>
              ) : (
                <Button
                  onClick={onAuthClick}
                  className="w-full bg-[#2d7a3e] hover:bg-[#1f5028] text-white py-2 rounded-lg font-medium"
                >
                  Se Connecter
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}