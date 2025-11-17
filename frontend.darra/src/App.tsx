import { Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./components/home";
import Checkout from "./components/Checkout";
import UserDashboard from "./components/UserDashboard";
import AdminPanel from "./components/AdminPanel";
import AuthModal from "./components/AuthModal";
import { CartItem } from "./components/CartSidebar";

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            <Route path="/" element={<Home authModalOpen={authModalOpen} setAuthModalOpen={setAuthModalOpen} />} />
            <Route path="/checkout" element={<Checkout items={cartItems} />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>

          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
          />
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;