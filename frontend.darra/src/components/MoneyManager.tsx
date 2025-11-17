import { useState, useEffect } from 'react';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Smartphone,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  PieChart,
  BarChart3,
  Wallet,
  Receipt,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';

interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'refund';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  description: string;
  date: string;
  orderId?: string;
  fees?: number;
}

interface WalletBalance {
  available: number;
  pending: number;
  total: number;
  currency: string;
}

interface MoneyStats {
  totalIncome: number;
  totalExpenses: number;
  totalRefunds: number;
  transactionCount: number;
  averageOrder: number;
}

export default function MoneyManager() {
  const { user, isLoggedIn } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    available: 0,
    pending: 0,
    total: 0,
    currency: 'FCFA'
  });
  const [stats, setStats] = useState<MoneyStats>({
    totalIncome: 0,
    totalExpenses: 0,
    totalRefunds: 0,
    transactionCount: 0,
    averageOrder: 0
  });
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('last30days');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (isLoggedIn) {
      loadFinancialData();
    }
  }, [isLoggedIn, dateFilter, typeFilter]);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      // Simulation - remplacer par un vrai appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTransactions: Transaction[] = [
        {
          id: 'TXN-001',
          type: 'expense',
          amount: 47500,
          currency: 'FCFA',
          status: 'completed',
          method: 'Orange Money',
          description: 'Commande DARRA-2024-001 - Attiéké & Poisson',
          date: '2024-01-15T10:30:00Z',
          orderId: 'DARRA-2024-001',
          fees: 950
        },
        {
          id: 'TXN-002',
          type: 'expense',
          amount: 32000,
          currency: 'FCFA',
          status: 'completed',
          method: 'MTN Mobile Money',
          description: 'Commande DARRA-2024-002 - Sauce arachide & Riz',
          date: '2024-01-20T14:15:00Z',
          orderId: 'DARRA-2024-002',
          fees: 640
        },
        {
          id: 'TXN-003',
          type: 'expense',
          amount: 28500,
          currency: 'FCFA',
          status: 'pending',
          method: 'Visa',
          description: 'Commande DARRA-2024-003 - Garba & Alloco',
          date: '2024-01-22T09:45:00Z',
          orderId: 'DARRA-2024-003',
          fees: 570
        },
        {
          id: 'TXN-004',
          type: 'refund',
          amount: 15000,
          currency: 'FCFA',
          status: 'completed',
          method: 'Orange Money',
          description: 'Remboursement - Article non disponible',
          date: '2024-01-18T16:20:00Z'
        },
        {
          id: 'TXN-005',
          type: 'income',
          amount: 50000,
          currency: 'FCFA',
          status: 'completed',
          method: 'Virement bancaire',
          description: 'Rechargement du portefeuille',
          date: '2024-01-10T11:00:00Z'
        }
      ];
      
      // Calculs des statistiques
      const filteredTransactions = mockTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        const now = new Date();
        const daysAgo = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        let dateMatches = true;
        switch (dateFilter) {
          case 'last7days':
            dateMatches = daysAgo <= 7;
            break;
          case 'last30days':
            dateMatches = daysAgo <= 30;
            break;
          case 'last90days':
            dateMatches = daysAgo <= 90;
            break;
        }
        
        const typeMatches = typeFilter === 'all' || t.type === typeFilter;
        return dateMatches && typeMatches;
      });

      const newStats: MoneyStats = {
        totalIncome: filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        totalExpenses: filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
        totalRefunds: filteredTransactions.filter(t => t.type === 'refund').reduce((sum, t) => sum + t.amount, 0),
        transactionCount: filteredTransactions.length,
        averageOrder: filteredTransactions.filter(t => t.type === 'expense').length > 0 
          ? filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) / filteredTransactions.filter(t => t.type === 'expense').length 
          : 0
      };

      const newBalance: WalletBalance = {
        available: 125750,
        pending: 28500,
        total: 154250,
        currency: 'FCFA'
      };

      setTransactions(filteredTransactions);
      setStats(newStats);
      setWalletBalance(newBalance);
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string, method: string) => {
    if (type === 'income') {
      return <ArrowDownLeft className="text-green-600" size={16} />;
    } else if (type === 'refund') {
      return <RefreshCw className="text-blue-600" size={16} />;
    } else {
      if (method.toLowerCase().includes('orange') || method.toLowerCase().includes('mtn') || method.toLowerCase().includes('moov')) {
        return <Smartphone className="text-orange-600" size={16} />;
      }
      return <CreditCard className="text-purple-600" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Complété';
      case 'pending': return 'En attente';
      case 'failed': return 'Échec';
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income': return 'text-green-600';
      case 'expense': return 'text-red-600';
      case 'refund': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'income': return 'Recette';
      case 'expense': return 'Dépense';
      case 'refund': return 'Remboursement';
      default: return type;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Wallet size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion requise</h2>
            <p className="text-gray-600 mb-6">Connectez-vous pour gérer vos finances.</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion financière</h1>
          <p className="text-gray-600">Suivez vos transactions et gérez votre argent</p>
        </div>

        {/* Wallet Balance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Solde disponible</p>
                  <p className="text-2xl font-bold text-green-600">
                    {walletBalance.available.toLocaleString()} {walletBalance.currency}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Wallet className="text-green-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {walletBalance.pending.toLocaleString()} {walletBalance.currency}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="text-yellow-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Solde total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {walletBalance.total.toLocaleString()} {walletBalance.currency}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <DollarSign className="text-blue-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recettes totales</p>
                  <p className="text-xl font-bold text-green-600">
                    {stats.totalIncome.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingDown className="text-red-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dépenses totales</p>
                  <p className="text-xl font-bold text-red-600">
                    {stats.totalExpenses.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <RefreshCw className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Remboursements</p>
                  <p className="text-xl font-bold text-blue-600">
                    {stats.totalRefunds.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <BarChart3 className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Commande moyenne</p>
                  <p className="text-xl font-bold text-purple-600">
                    {stats.averageOrder.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex gap-4">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                >
                  <option value="last7days">7 derniers jours</option>
                  <option value="last30days">30 derniers jours</option>
                  <option value="last90days">90 derniers jours</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                >
                  <option value="all">Tous les types</option>
                  <option value="income">Recettes</option>
                  <option value="expense">Dépenses</option>
                  <option value="refund">Remboursements</option>
                </select>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={loadFinancialData}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  Actualiser
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Download size={16} />
                  Exporter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt size={20} />
              Historique des transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune transaction</h3>
                <p className="text-gray-600">
                  {dateFilter !== 'all' || typeFilter !== 'all' 
                    ? 'Aucune transaction ne correspond aux filtres sélectionnés.'
                    : 'Vous n\'avez pas encore effectué de transaction.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getTransactionIcon(transaction.type, transaction.method)}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-gray-900">{transaction.description}</h4>
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusText(transaction.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{transaction.method}</span>
                        <span>•</span>
                        <span>{new Date(transaction.date).toLocaleDateString('fr-FR')}</span>
                        {transaction.orderId && (
                          <>
                            <span>•</span>
                            <span>Commande: {transaction.orderId}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getTypeColor(transaction.type)}`}>
                        {transaction.type === 'expense' ? '-' : '+'}
                        {transaction.amount.toLocaleString()} {transaction.currency}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="capitalize">{getTypeText(transaction.type)}</span>
                        {transaction.fees && transaction.fees > 0 && (
                          <>
                            <span>•</span>
                            <span>Frais: {transaction.fees} FCFA</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-4">
                <Wallet className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Recharger le portefeuille</h3>
              <p className="text-sm text-gray-600 mb-4">Ajoutez des fonds à votre compte</p>
              <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                Recharger
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                <CreditCard className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gérer les paiements</h3>
              <p className="text-sm text-gray-600 mb-4">Modifiez vos méthodes de paiement</p>
              <Button variant="outline" className="w-full">
                Configurer
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                <BarChart3 className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Rapports détaillés</h3>
              <p className="text-sm text-gray-600 mb-4">Analysez vos dépenses</p>
              <Button variant="outline" className="w-full">
                Voir rapports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}