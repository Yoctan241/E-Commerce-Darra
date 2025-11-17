import { useState } from 'react';
import { 
  User, 
  Package, 
  CreditCard, 
  Settings, 
  Heart, 
  MapPin, 
  Bell,
  Wallet,
  Receipt,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Star,
  Gift,
  HelpCircle,
  Shield,
  LogOut,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import PaymentMethods from './PaymentMethods';
import OrderManager from './OrderManager';
import MoneyManager from './MoneyManager';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  joinDate: string;
}

interface QuickStats {
  totalOrders: number;
  totalSpent: number;
  favoriteItems: number;
  loyaltyPoints: number;
}

interface UserDashboardProps {
  onLogout?: () => void;
}

export default function UserDashboard({ onLogout }: UserDashboardProps) {
  const { user, isLoggedIn, logout, role } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || 'Utilisateur DARRA',
    email: user?.email || 'user@darra.com',
    phone: '+225 07 12 34 56 78',
    address: 'Cocody Riviera, Rue des Jardins',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    joinDate: '2024-01-01'
  });

  const [quickStats] = useState<QuickStats>({
    totalOrders: 12,
    totalSpent: 487500,
    favoriteItems: 8,
    loyaltyPoints: 2450
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditingProfile(false);
  };

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion requise</h2>
            <p className="text-gray-600 mb-6">Connectez-vous pour accéder à votre tableau de bord.</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bonjour, {profile.name} 👋
              </h1>
              <p className="text-gray-600">
                Bienvenue dans votre espace personnel DARRA
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              {role === 'admin' && (
                <Badge className="bg-[#2d7a3e] text-white">
                  Administrateur
                </Badge>
              )}
              <Badge variant="outline">
                Membre depuis {new Date(profile.joinDate).getFullYear()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-8 bg-white">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp size={16} />
              <span className="hidden sm:inline">Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package size={16} />
              <span className="hidden sm:inline">Commandes</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard size={16} />
              <span className="hidden sm:inline">Paiements</span>
            </TabsTrigger>
            <TabsTrigger value="money" className="flex items-center gap-2">
              <Wallet size={16} />
              <span className="hidden sm:inline">Finances</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              <span className="hidden sm:inline">Paramètres</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <ShoppingBag className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Commandes</p>
                      <p className="text-2xl font-bold text-blue-600">{quickStats.totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Wallet className="text-green-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total dépensé</p>
                      <p className="text-2xl font-bold text-green-600">
                        {quickStats.totalSpent.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-full">
                      <Heart className="text-red-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Favoris</p>
                      <p className="text-2xl font-bold text-red-600">{quickStats.favoriteItems}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Star className="text-yellow-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Points fidélité</p>
                      <p className="text-2xl font-bold text-yellow-600">{quickStats.loyaltyPoints}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package size={20} />
                    Commandes récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">DARRA-2024-003</p>
                        <p className="text-sm text-gray-600">22 Jan 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#2d7a3e]">28,500 FCFA</p>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          En cours
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">DARRA-2024-002</p>
                        <p className="text-sm text-gray-600">20 Jan 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#2d7a3e]">32,000 FCFA</p>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Livrée
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setActiveTab('orders')} 
                    variant="outline" 
                    className="w-full mt-4"
                  >
                    Voir toutes les commandes
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift size={20} />
                    Offres spéciales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        🎉 Livraison gratuite
                      </h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Profitez de la livraison gratuite sur toutes vos commandes de plus de 50,000 FCFA
                      </p>
                      <Button size="sm" className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white">
                        En profiter
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        ⭐ Programme fidélité
                      </h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Échangez vos points contre des réductions exclusives
                      </p>
                      <Button size="sm" variant="outline">
                        Mes points
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <OrderManager />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <PaymentMethods />
          </TabsContent>

          {/* Money Management Tab */}
          <TabsContent value="money">
            <MoneyManager />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User size={20} />
                    Informations personnelles
                  </span>
                  {!isEditingProfile && (
                    <Button
                      onClick={() => {
                        setEditedProfile(profile);
                        setIsEditingProfile(true);
                      }}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      Modifier
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditingProfile ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          value={editedProfile.name}
                          onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville
                        </label>
                        <input
                          type="text"
                          value={editedProfile.city || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, city: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse
                      </label>
                      <textarea
                        value={editedProfile.address || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                        placeholder="Entrez votre adresse complète..."
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white flex items-center gap-2"
                      >
                        <Save size={18} />
                        Sauvegarder
                      </Button>
                      <Button
                        onClick={() => setIsEditingProfile(false)}
                        variant="outline"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Nom complet</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Téléphone</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.phone}</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Ville</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Pays</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.country}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Adresse</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell size={20} />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Notifications par email</h4>
                        <p className="text-sm text-gray-600">Recevez les mises à jour par email</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded border-gray-300 text-[#2d7a3e] focus:ring-[#2d7a3e]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Notifications SMS</h4>
                        <p className="text-sm text-gray-600">Recevez les alertes par SMS</p>
                      </div>
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-[#2d7a3e] focus:ring-[#2d7a3e]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Offres promotionnelles</h4>
                        <p className="text-sm text-gray-600">Recevez les offres spéciales</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded border-gray-300 text-[#2d7a3e] focus:ring-[#2d7a3e]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle size={20} />
                    Support & Aide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <HelpCircle size={16} className="mr-2" />
                      Centre d'aide
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Bell size={16} className="mr-2" />
                      Nous contacter
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings size={16} className="mr-2" />
                      Conditions d'utilisation
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <LogOut size={20} />
                    Zone de déconnexion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Vous déconnecter de votre compte DARRA.
                  </p>
                  <Button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white w-full"
                  >
                    Se déconnecter
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}