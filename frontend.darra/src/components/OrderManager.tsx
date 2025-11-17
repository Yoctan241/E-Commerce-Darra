import { useState, useEffect } from 'react';
import { 
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  Phone,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Download,
  Star,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  currency: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  shipping: {
    address: string;
    city: string;
    country: string;
    estimatedDelivery?: string;
    trackingNumber?: string;
  };
  payment: {
    method: string;
    last4?: string;
    status: 'pending' | 'completed' | 'failed';
  };
}

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
}

const OrderDetails = ({ order, onClose }: OrderDetailsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'processing': return <RefreshCw size={16} className="animate-spin" />;
      case 'shipped': return <Truck size={16} />;
      case 'delivered': return <CheckCircle size={16} />;
      case 'cancelled': return <Package size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En cours de traitement';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Commande {order.id}</h2>
          <Button onClick={onClose} variant="outline" size="sm">
            ✕
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    <p className="font-semibold">{getStatusText(order.status)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100 text-green-800">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-semibold">{order.total.toLocaleString()} {order.currency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-800">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">{new Date(order.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package size={20} />
                Articles commandés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={(u => {
                            if (!u) return '/images/placeholder.jpg';
                            if (u.startsWith('http') || u.startsWith('data:')) return u;
                            const base = import.meta.env.VITE_API_BASE_URL || '';
                            return base ? `${base}${u}` : u;
                          })(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                      <p className="text-sm text-gray-600">{item.price.toLocaleString()} FCFA/unité</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin size={20} />
                  Livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Adresse</p>
                    <p className="font-medium">{order.shipping.address}</p>
                    <p className="text-gray-700">{order.shipping.city}, {order.shipping.country}</p>
                  </div>
                  {order.shipping.trackingNumber && (
                    <div>
                      <p className="text-sm text-gray-600">Numéro de suivi</p>
                      <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {order.shipping.trackingNumber}
                      </p>
                    </div>
                  )}
                  {order.shipping.estimatedDelivery && (
                    <div>
                      <p className="text-sm text-gray-600">Livraison estimée</p>
                      <p className="font-medium">{order.shipping.estimatedDelivery}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard size={20} />
                  Paiement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Méthode</p>
                    <p className="font-medium">
                      {order.payment.method}
                      {order.payment.last4 && ` •••• ${order.payment.last4}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut du paiement</p>
                    <Badge className={
                      order.payment.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                      order.payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }>
                      {order.payment.status === 'completed' ? 'Payé' :
                       order.payment.status === 'pending' ? 'En attente' : 'Échec'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Télécharger la facture
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare size={16} />
              Contacter le support
            </Button>
            {order.status === 'delivered' && (
              <Button variant="outline" className="flex items-center gap-2">
                <Star size={16} />
                Laisser un avis
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OrderManager() {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      loadOrders();
    }
  }, [isLoggedIn]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // Simulation - remplacer par un vrai appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOrders: Order[] = [
        {
          id: 'DARRA-2024-001',
          date: '2024-01-15T10:30:00Z',
          status: 'delivered',
          total: 47500,
          currency: 'FCFA',
          items: [
            { id: '1', name: 'Attiéké traditionnel', price: 15000, quantity: 2 },
            { id: '2', name: 'Poisson braisé', price: 17500, quantity: 1 }
          ],
          shipping: {
            address: 'Cocody Riviera, Rue des Jardins',
            city: 'Abidjan',
            country: 'Côte d\'Ivoire',
            estimatedDelivery: '2024-01-17',
            trackingNumber: 'DARRA-TRK-12345'
          },
          payment: {
            method: 'Orange Money',
            status: 'completed'
          }
        },
        {
          id: 'DARRA-2024-002',
          date: '2024-01-20T14:15:00Z',
          status: 'shipped',
          total: 32000,
          currency: 'FCFA',
          items: [
            { id: '3', name: 'Sauce arachide', price: 12000, quantity: 1 },
            { id: '4', name: 'Riz parfumé', price: 20000, quantity: 1 }
          ],
          shipping: {
            address: 'Marcory Zone 4, Près du marché',
            city: 'Abidjan',
            country: 'Côte d\'Ivoire',
            estimatedDelivery: '2024-01-25',
            trackingNumber: 'DARRA-TRK-67890'
          },
          payment: {
            method: 'MTN Mobile Money',
            status: 'completed'
          }
        },
        {
          id: 'DARRA-2024-003',
          date: '2024-01-22T09:45:00Z',
          status: 'processing',
          total: 28500,
          currency: 'FCFA',
          items: [
            { id: '5', name: 'Garba', price: 8500, quantity: 2 },
            { id: '6', name: 'Alloco', price: 12000, quantity: 1 }
          ],
          shipping: {
            address: 'Plateau, Rue du Commerce',
            city: 'Abidjan',
            country: 'Côte d\'Ivoire',
            estimatedDelivery: '2024-01-27'
          },
          payment: {
            method: 'Visa',
            last4: '4242',
            status: 'completed'
          }
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En cours';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion requise</h2>
            <p className="text-gray-600 mb-6">Connectez-vous pour voir vos commandes.</p>
            <Button className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white w-full">
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes commandes</h1>
          <p className="text-gray-600">Suivez et gérez toutes vos commandes DARRA</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par numéro de commande ou produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="processing">En cours</option>
                  <option value="shipped">Expédiées</option>
                  <option value="delivered">Livrées</option>
                  <option value="cancelled">Annulées</option>
                </select>
                
                <Button
                  onClick={loadOrders}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  Actualiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune commande trouvée</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche.'
                  : 'Vous n\'avez pas encore passé de commande.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white">
                  Commencer les achats
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-lg font-bold text-gray-900">{order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>Commandé le {new Date(order.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package size={16} />
                          <span>{order.items.length} article{order.items.length > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>{order.shipping.city}, {order.shipping.country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} />
                          <span>{order.payment.method}</span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {order.items.slice(0, 2).map(item => (
                            <span key={item.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                              {item.name} x{item.quantity}
                            </span>
                          ))}
                          {order.items.length > 2 && (
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-500">
                              +{order.items.length - 2} autres
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="md:text-right flex flex-col justify-between">
                      <div className="mb-4">
                        <p className="text-2xl font-bold text-[#2d7a3e]">
                          {order.total.toLocaleString()} {order.currency}
                        </p>
                        {order.shipping.estimatedDelivery && (
                          <p className="text-sm text-gray-600 mt-1">
                            Livraison: {order.shipping.estimatedDelivery}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Voir détails
                        </Button>
                        
                        {order.shipping.trackingNumber && (
                          <Button variant="outline" className="flex items-center gap-2">
                            <Truck size={16} />
                            Suivre
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetails 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
          />
        )}
      </div>
    </div>
  );
}