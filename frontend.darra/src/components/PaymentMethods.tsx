import { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'mobile_money' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  holderName?: string;
  isDefault: boolean;
  phoneNumber?: string;
  email?: string;
  bankName?: string;
  accountNumber?: string;
}

export default function PaymentMethods() {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMethod, setNewMethod] = useState<Partial<PaymentMethod>>({
    type: 'card',
    isDefault: false
  });

  // Simuler le chargement des méthodes de paiement
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    setLoading(true);
    try {
      // Simulation - remplacer par un vrai appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMethods: PaymentMethod[] = [
        {
          id: '1',
          type: 'card',
          last4: '4242',
          brand: 'Visa',
          expiryMonth: 12,
          expiryYear: 2026,
          holderName: user?.name || 'Utilisateur',
          isDefault: true
        },
        {
          id: '2',
          type: 'mobile_money',
          phoneNumber: '+225 07 12 34 56 78',
          isDefault: false
        }
      ];
      setPaymentMethods(mockMethods);
    } catch (err) {
      setError('Erreur lors du chargement des méthodes de paiement');
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async () => {
    if (!newMethod.type) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const method: PaymentMethod = {
        id: Date.now().toString(),
        ...newMethod,
        isDefault: paymentMethods.length === 0 // Premier = par défaut
      } as PaymentMethod;

      setPaymentMethods(prev => [...prev, method]);
      setShowAddForm(false);
      setNewMethod({ type: 'card', isDefault: false });
    } catch (err) {
      setError('Erreur lors de l\'ajout de la méthode de paiement');
    } finally {
      setLoading(false);
    }
  };

  const removePaymentMethod = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette méthode de paiement ?')) {
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
    }
  };

  const setDefaultPaymentMethod = async (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const getPaymentMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'card': return <CreditCard size={20} />;
      case 'paypal': return <span className="text-blue-600 font-bold">PP</span>;
      case 'mobile_money': return <span className="text-orange-600 font-bold">📱</span>;
      case 'bank_transfer': return <span className="text-green-600 font-bold">🏦</span>;
      default: return <CreditCard size={20} />;
    }
  };

  const getPaymentMethodLabel = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'card': return 'Carte Bancaire';
      case 'paypal': return 'PayPal';
      case 'mobile_money': return 'Mobile Money';
      case 'bank_transfer': return 'Virement Bancaire';
      default: return 'Autre';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Méthodes de Paiement</h2>
              <p className="text-gray-600 mt-1">Gérez vos moyens de paiement de manière sécurisée</p>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white"
            >
              <Plus size={16} className="mr-2" />
              Ajouter
            </Button>
          </div>
        </div>

        {/* Payment Methods List */}
        <div className="p-6">
          {loading && paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#2d7a3e] border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune méthode de paiement</h3>
              <p className="text-gray-600 mb-6">Ajoutez votre première méthode de paiement pour commencer vos achats</p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white"
              >
                <Plus size={16} className="mr-2" />
                Ajouter une méthode
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border rounded-lg p-4 ${
                    method.isDefault 
                      ? 'border-[#2d7a3e] bg-[#f8fdf9]' 
                      : 'border-gray-200 hover:border-gray-300'
                  } transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getPaymentMethodIcon(method.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">
                            {getPaymentMethodLabel(method.type)}
                          </h4>
                          {method.isDefault && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#2d7a3e] text-white">
                              <CheckCircle size={12} className="mr-1" />
                              Par défaut
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {method.type === 'card' && `•••• •••• •••• ${method.last4} - ${method.brand} (${method.expiryMonth}/${method.expiryYear})`}
                          {method.type === 'mobile_money' && method.phoneNumber}
                          {method.type === 'paypal' && method.email}
                          {method.type === 'bank_transfer' && `${method.bankName} - ••••${method.accountNumber?.slice(-4)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!method.isDefault && (
                        <Button
                          onClick={() => setDefaultPaymentMethod(method.id)}
                          variant="outline"
                          size="sm"
                          className="text-[#2d7a3e] border-[#2d7a3e] hover:bg-[#2d7a3e] hover:text-white"
                        >
                          Définir par défaut
                        </Button>
                      )}
                      <Button
                        onClick={() => removePaymentMethod(method.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Payment Method Form */}
        {showAddForm && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter une méthode de paiement</h3>
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertCircle size={16} className="text-red-600 mr-2" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Method Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de paiement
              </label>
              <select
                value={newMethod.type}
                onChange={(e) => setNewMethod(prev => ({ ...prev, type: e.target.value as PaymentMethod['type'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
              >
                <option value="card">Carte Bancaire</option>
                <option value="mobile_money">Mobile Money (Orange/MTN/Moov)</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Virement Bancaire</option>
              </select>
            </div>

            {/* Conditional Fields */}
            {newMethod.type === 'card' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                    onChange={(e) => setNewMethod(prev => ({ ...prev, last4: e.target.value.slice(-4) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du titulaire
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                    onChange={(e) => setNewMethod(prev => ({ ...prev, holderName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mois d'expiration
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                    onChange={(e) => setNewMethod(prev => ({ ...prev, expiryMonth: parseInt(e.target.value) }))}
                  >
                    <option value="">Mois</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>{month.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année d'expiration
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                    onChange={(e) => setNewMethod(prev => ({ ...prev, expiryYear: parseInt(e.target.value) }))}
                  >
                    <option value="">Année</option>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {newMethod.type === 'mobile_money' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  placeholder="+225 07 12 34 56 78"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                  onChange={(e) => setNewMethod(prev => ({ ...prev, phoneNumber: e.target.value }))}
                />
              </div>
            )}

            {newMethod.type === 'paypal' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email PayPal
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                  onChange={(e) => setNewMethod(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            )}

            {newMethod.type === 'bank_transfer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la banque
                  </label>
                  <input
                    type="text"
                    placeholder="Banque Atlantique"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                    onChange={(e) => setNewMethod(prev => ({ ...prev, bankName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de compte
                  </label>
                  <input
                    type="text"
                    placeholder="123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                    onChange={(e) => setNewMethod(prev => ({ ...prev, accountNumber: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center">
                <Shield size={16} className="text-blue-600 mr-2" />
                <p className="text-blue-800 text-sm">
                  Vos informations de paiement sont chiffrées et sécurisées selon les normes PCI DSS.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  setNewMethod({ type: 'card', isDefault: false });
                  setError(null);
                }}
                variant="outline"
              >
                Annuler
              </Button>
              <Button
                onClick={addPaymentMethod}
                disabled={loading}
                className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Ajout...
                  </div>
                ) : (
                  'Ajouter la méthode'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}