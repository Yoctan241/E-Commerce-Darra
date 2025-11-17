import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  MapPin, 
  Truck, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Smartphone,
  Building2,
  ArrowLeft,
  ArrowRight,
  Lock,
  Package,
  Clock,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { CartItem } from './CartSidebar';

interface CheckoutProps {
  items: CartItem[];
  onOrderComplete?: (orderId: string) => void;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'mobile_money' | 'bank_transfer';
  last4?: string;
  brand?: string;
  holderName?: string;
  isDefault: boolean;
  phoneNumber?: string;
  provider?: string; // Pour Mobile Money: Orange, MTN, Moov
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  commune: string;
  country: string;
  phone: string;
  additionalInfo?: string;
}

interface OrderData {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  estimatedDelivery: string;
}

const AFRICAN_COUNTRIES = [
  'Côte d\'Ivoire', 'Sénégal', 'Mali', 'Burkina Faso', 'Niger', 'Ghana', 'Nigeria', 'Cameroun'
];

const IVORIAN_CITIES = [
  'Abidjan', 'Bouaké', 'Daloa', 'Yamoussoukro', 'San-Pédro', 'Korhogo', 'Man', 'Divo', 'Gagnoa', 'Abengourou'
];

const MOBILE_MONEY_PROVIDERS = [
  { id: 'orange', name: 'Orange Money', icon: '🧡', code: 'OM' },
  { id: 'mtn', name: 'MTN Mobile Money', icon: '💛', code: 'MTN' },
  { id: 'moov', name: 'Moov Money', icon: '💙', code: 'MOOV' },
  { id: 'airtel', name: 'Airtel Money', icon: '🔴', code: 'AM' },
  { id: 'wave', name: 'Wave', icon: '💚', code: 'WAVE' }
];

export default function Checkout({ items, onOrderComplete }: CheckoutProps) {
  const { user, isLoggedIn } = useAuth();
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review, 4: Processing, 5: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for form data
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    address: '',
    city: 'Abidjan',
    commune: '',
    country: 'Côte d\'Ivoire',
    phone: '',
    additionalInfo: ''
  });
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  // Calculate totals in FCFA
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 50000 ? 0 : 2500; // Livraison gratuite au-dessus de 50,000 FCFA
  const tax = Math.round(subtotal * 0.18); // 18% TVA
  const total = subtotal + shippingCost + tax;

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    // Simulation - remplacer par un vrai appel API
    const mockMethods: PaymentMethod[] = [
      {
        id: '1',
        type: 'mobile_money',
        phoneNumber: '+225 07 12 34 56 78',
        provider: 'orange',
        isDefault: true
      },
      {
        id: '2',
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        holderName: user?.name || 'Utilisateur',
        isDefault: false
      },
      {
        id: '3',
        type: 'mobile_money',
        phoneNumber: '+225 05 87 65 43 21',
        provider: 'mtn',
        isDefault: false
      },
      {
        id: '4',
        type: 'mobile_money',
        phoneNumber: '+225 01 23 45 67 89',
        provider: 'moov',
        isDefault: false
      },
      {
        id: '5',
        type: 'mobile_money',
        phoneNumber: '+225 08 98 76 54 32',
        provider: 'airtel',
        isDefault: false
      },
      {
        id: '6',
        type: 'paypal',
        isDefault: false
      }
    ];
    setPaymentMethods(mockMethods);
    
    // Sélectionner la méthode par défaut
    const defaultMethod = mockMethods.find(m => m.isDefault);
    if (defaultMethod) {
      setSelectedPaymentMethod(defaultMethod.id);
    }
  };

  const processOrder = async () => {
    setLoading(true);
    setError(null);
    setStep(4); // Processing
    
    try {
      // Simulation du traitement de la commande
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newOrderId = `DARRA-${Date.now()}`;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 jours de livraison
      
      const newOrderData: OrderData = {
        id: newOrderId,
        status: 'processing',
        estimatedDelivery: deliveryDate.toLocaleDateString('fr-FR')
      };
      
      setOrderData(newOrderData);
      setStep(5); // Success
      
      onOrderComplete?.(newOrderId);
    } catch (err) {
      setError('Erreur lors du traitement de la commande. Veuillez réessayer.');
      setStep(3); // Back to review
    } finally {
      setLoading(false);
    }
  };

  const validateAddressForm = () => {
    return shippingAddress.fullName && 
           shippingAddress.address && 
           shippingAddress.city && 
           shippingAddress.phone &&
           shippingAddress.commune;
  };

  const getPaymentMethodDisplay = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return (
          <div className="flex items-center gap-3">
            <CreditCard size={20} />
            <span>{method.brand} •••• {method.last4}</span>
          </div>
        );
      case 'mobile_money':
        const provider = MOBILE_MONEY_PROVIDERS.find(p => p.id === method.provider);
        return (
          <div className="flex items-center gap-3">
            <Smartphone size={20} />
            <span>{provider?.name || 'Mobile Money'} - {method.phoneNumber}</span>
          </div>
        );
      case 'paypal':
        return (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">P</div>
            <span>PayPal</span>
          </div>
        );
      case 'bank_transfer':
        return (
          <div className="flex items-center gap-3">
            <Building2 size={20} />
            <span>Virement Bancaire</span>
          </div>
        );
      default:
        return 'Méthode inconnue';
    }
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion requise</h2>
            <p className="text-gray-600 mb-6">Vous devez être connecté pour passer une commande.</p>
            <Button 
              onClick={() => window.location.href = '/'} 
              className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white w-full"
            >
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Panier vide</h2>
            <p className="text-gray-600 mb-6">Ajoutez des produits à votre panier avant de passer commande.</p>
            <Button 
              onClick={() => window.location.href = '/'} 
              className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white w-full"
            >
              Continuer les achats
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step >= stepNum
                      ? 'bg-[#2d7a3e] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > stepNum ? <CheckCircle size={20} /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                    step > stepNum ? 'bg-[#2d7a3e]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto mt-2 text-sm">
            <span className={step >= 1 ? 'text-[#2d7a3e]' : 'text-gray-500'}>Livraison</span>
            <span className={step >= 2 ? 'text-[#2d7a3e]' : 'text-gray-500'}>Paiement</span>
            <span className={step >= 3 ? 'text-[#2d7a3e]' : 'text-gray-500'}>Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="text-[#2d7a3e]" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">Adresse de livraison</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => handleAddressChange('fullName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                        placeholder="Entrez votre nom complet"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pays *
                        </label>
                        <select
                          value={shippingAddress.country}
                          onChange={(e) => handleAddressChange('country', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                        >
                          {AFRICAN_COUNTRIES.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville *
                        </label>
                        <select
                          value={shippingAddress.city}
                          onChange={(e) => handleAddressChange('city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                        >
                          {IVORIAN_CITIES.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Commune/Quartier *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.commune}
                        onChange={(e) => handleAddressChange('commune', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                        placeholder="Ex: Cocody, Plateau, Marcory..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse complète *
                      </label>
                      <textarea
                        value={shippingAddress.address}
                        onChange={(e) => handleAddressChange('address', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                        placeholder="Entrez votre adresse complète avec des points de repère..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                        placeholder="+225 XX XX XX XX XX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Informations supplémentaires
                      </label>
                      <textarea
                        value={shippingAddress.additionalInfo}
                        onChange={(e) => handleAddressChange('additionalInfo', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                        placeholder="Instructions de livraison, étage, code d'accès..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!validateAddressForm()}
                      className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white px-8 py-3 flex items-center gap-2"
                    >
                      Continuer <ArrowRight size={18} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="text-[#2d7a3e]" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">Mode de paiement</h2>
                  </div>

                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedPaymentMethod === method.id
                            ? 'border-[#2d7a3e] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          {getPaymentMethodDisplay(method)}
                          {method.isDefault && (
                            <span className="text-xs bg-[#2d7a3e] text-white px-2 py-1 rounded">
                              Par défaut
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add new payment method */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <CreditCard size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600 mb-3">Ajouter un nouveau mode de paiement</p>
                      <Button variant="outline" className="text-[#2d7a3e] border-[#2d7a3e]">
                        + Ajouter
                      </Button>
                    </div>
                  </div>

                  {/* Security notice */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                    <Shield className="text-blue-600 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-semibold text-blue-900">Paiement sécurisé</h4>
                      <p className="text-sm text-blue-700">
                        Toutes les transactions sont cryptées et sécurisées. Vos données bancaires ne sont jamais stockées.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="px-8 py-3 flex items-center gap-2"
                    >
                      <ArrowLeft size={18} /> Retour
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!selectedPaymentMethod}
                      className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white px-8 py-3 flex items-center gap-2"
                    >
                      Continuer <ArrowRight size={18} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Order Review */}
            {step === 3 && (
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="text-[#2d7a3e]" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">Confirmation de commande</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Shipping Info */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin size={18} /> Livraison à:
                      </h3>
                      <div className="text-gray-700">
                        <p className="font-medium">{shippingAddress.fullName}</p>
                        <p>{shippingAddress.address}</p>
                        <p>{shippingAddress.commune}, {shippingAddress.city}</p>
                        <p>{shippingAddress.country}</p>
                        <p className="mt-2 text-sm">📞 {shippingAddress.phone}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Lock size={18} /> Mode de paiement:
                      </h3>
                      {paymentMethods.find(m => m.id === selectedPaymentMethod) && (
                        <div className="text-gray-700">
                          {getPaymentMethodDisplay(paymentMethods.find(m => m.id === selectedPaymentMethod)!)}
                        </div>
                      )}
                    </div>

                    {/* Items Review */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Package size={18} /> Articles commandés:
                      </h3>
                      <div className="space-y-3">
                        {items.map(item => (
                          <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
                      <Truck className="text-blue-600" size={24} />
                      <div>
                        <h4 className="font-semibold text-blue-900">Livraison estimée</h4>
                        <p className="text-sm text-blue-700">2-4 jours ouvrables</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button
                      onClick={() => setStep(2)}
                      variant="outline"
                      className="px-8 py-3 flex items-center gap-2"
                    >
                      <ArrowLeft size={18} /> Retour
                    </Button>
                    <Button
                      onClick={processOrder}
                      disabled={loading}
                      className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white px-8 py-3 flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          <Lock size={18} /> Confirmer la commande
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Processing */}
            {step === 4 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#2d7a3e] border-t-transparent mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Traitement de votre commande</h2>
                  <p className="text-gray-600">Veuillez patienter pendant que nous préparons votre commande...</p>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Success */}
            {step === 5 && orderData && (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h2>
                  <p className="text-gray-600 mb-6">
                    Votre commande a été passée avec succès. Vous recevrez bientôt un email de confirmation.
                  </p>
                  
                  <div className="bg-green-50 p-6 rounded-lg mb-6">
                    <h3 className="font-semibold text-green-900 mb-3">Détails de votre commande</h3>
                    <div className="text-left space-y-2">
                      <p><strong>Numéro de commande:</strong> {orderData.id}</p>
                      <p><strong>Statut:</strong> En cours de traitement</p>
                      <p><strong>Livraison estimée:</strong> {orderData.estimatedDelivery}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => window.location.href = '/'}
                      variant="outline"
                      className="px-6"
                    >
                      Continuer les achats
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/dashboard'}
                      className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white px-6"
                    >
                      Suivre ma commande
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {error && (
              <Card className="mt-4">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-red-600">
                    <AlertTriangle size={24} />
                    <p>{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Récapitulatif</h3>
                
                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-500">Qté: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>TVA (18%)</span>
                    <span>{tax.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span className="flex items-center gap-1">
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-medium">GRATUIT</span>
                      ) : (
                        `${shippingCost.toLocaleString()} FCFA`
                      )}
                      <Truck size={14} />
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-[#2d7a3e]">{total.toLocaleString()} FCFA</span>
                  </div>
                </div>

                {/* Delivery info */}
                {shippingCost === 0 && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-sm text-green-700 font-medium">
                      🚚 Livraison gratuite !
                    </p>
                  </div>
                )}

                {/* Security badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield size={16} />
                  <span>Paiement 100% sécurisé</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
