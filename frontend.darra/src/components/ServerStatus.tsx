import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ServerStatusProps {
  onServerReady?: () => void;
}

export default function ServerStatus({ onServerReady }: ServerStatusProps) {
  const [serverStatus, setServerStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const checkServerConnection = async () => {
    setServerStatus('checking');
    try {
      console.log('🔍 Vérification connexion serveur...');
      // Essayer la nouvelle API
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/health`);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Serveur connecté:', data);
        setServerStatus('connected');
        onServerReady?.();
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Erreur serveur:', error);
      setServerStatus('error');
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkServerConnection();
    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkServerConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (serverStatus === 'connected') {
    return null; // Ne rien afficher si tout va bien
  }

  return (
    <Card className="mb-4 border-orange-200 bg-orange-50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          {serverStatus === 'checking' && (
            <>
              <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
              <div>
                <h3 className="font-medium text-blue-900">Vérification du serveur...</h3>
                <p className="text-sm text-blue-700">Connexion au backend en cours</p>
              </div>
            </>
          )}

          {serverStatus === 'error' && (
            <>
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div className="flex-1">
                <h3 className="font-medium text-red-900">Serveur non disponible</h3>
                <p className="text-sm text-red-700 mb-2">
                  Le serveur backend n'est pas accessible. Assurez-vous qu'il est démarré.
                </p>
                <div className="text-xs text-red-600 mb-3">
                  <p>• Ouvrez un terminal dans le dossier backend</p>
                  <p>• Lancez la commande: <code className="bg-red-100 px-1 rounded">npm start</code></p>
                  <p>• Vérifiez que le port 5000 est libre</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={checkServerConnection}
                    variant="outline"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Réessayer
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="text-xs text-gray-500 mt-3">
          Dernière vérification: {lastCheck.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}