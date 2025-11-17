import { useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import ProductGrid from './ProductGrid';
import CartSidebar, { CartItem } from './CartSidebar';
import ProductDetailModal from './ProductDetailModal';
import Footer from './Footer';
import RoleSwitcher from './RoleSwitcher';
import ServerStatus from './ServerStatus';
import { Product } from './ProductCard';
import { useAuth } from '../contexts/AuthContext';

interface HomeProps {
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

function Home({ authModalOpen, setAuthModalOpen }: HomeProps) {
  const { user, isLoggedIn, logout } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleAddToCart = (product: Product, quantity: number = 1, variant: string = 'M') => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(productId);
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  const handleProductDetailAddToCart = (product: Product, quantity: number, variant: string) => {
    handleAddToCart(product, quantity, variant);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        cartCount={cartItems.length}
        onCartClick={() => setCartOpen(true)}
        onAuthClick={() => setAuthModalOpen(true)}
        isLoggedIn={isLoggedIn}
        userRole={user?.role}
        userName={user?.name}
        onLogout={logout}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ServerStatus />
      </div>
      <Hero onShopClick={() => {}} />
      <ProductGrid
        onAddToCart={handleAddToCart}
        onViewDetails={handleViewDetails}
      />
      <Footer />
      
      {/* Role Switcher for Demo */}
      <RoleSwitcher />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setCartOpen(false);
          // TODO: Navigate to checkout
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        product={selectedProduct || undefined}
        onAddToCart={handleProductDetailAddToCart}
      />
    </div>
  );
}

export default Home;