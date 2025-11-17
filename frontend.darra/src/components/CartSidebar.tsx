import { X, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from './ProductCard';

export interface CartItem extends Product {
  quantity: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemoveItem?: (productId: string) => void;
  onCheckout?: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartSidebarProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[calc(100vh-300px)]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
              <Button
                onClick={onClose}
                className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200">
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                    <p className="text-[#2d7a3e] font-bold mt-1">${item.price.toFixed(2)}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity?.(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-gray-100 rounded transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => onRemoveItem?.(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-[#2d7a3e]">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={onCheckout}
              className="w-full bg-[#2d7a3e] hover:bg-[#1f5028] text-white py-3 rounded-lg font-semibold"
            >
              Proceed to Checkout
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-[#2d7a3e] text-[#2d7a3e] hover:bg-[#e8f5e9]"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
