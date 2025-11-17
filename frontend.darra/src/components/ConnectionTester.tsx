import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, AlertCircle, Server, Database } from 'lucide-react';

interface ApiTestResult {
  endpoint: string;
  status: 'success' | 'error' | 'loading';
  data?: any;
  error?: string;
  duration?: number;
}

export default function ConnectionTester() {
  const [tests, setTests] = useState<ApiTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const endpoints = [
    { name: 'Health Check', url: 'http://localhost:5000/health' },
    { name: 'Produits API', url: 'http://localhost:5000/api/products' },
    { name: 'Catégories API', url: 'http://localhost:5000/api/categories' },
    { name: 'Stats API', url: 'http://localhost:5000/api/stats' }
  ];

  const testEndpoint = async (endpoint: { name: string; url: string }): Promise<ApiTestResult> => {
    const startTime = Date.now();
    
    try {
      console.log(`🧪 Test de ${endpoint.name}...`);
      const response = await fetch(endpoint.url);
      const duration = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ ${endpoint.name} réussi:`, data);

      return {
        endpoint: endpoint.name,
        status: 'success',
        data,
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error(`❌ ${endpoint.name} échoué:`, errorMsg);

      return {
        endpoint: endpoint.name,
        status: 'error',
        error: errorMsg,
        duration
      };
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    setTests([]);

    for (const endpoint of endpoints) {
      // Mettre à jour l'état pour montrer que ce test est en cours
      setTests(prev => [
        ...prev,
        { endpoint: endpoint.name, status: 'loading' }
      ]);

      const result = await testEndpoint(endpoint);
      
      // Remplacer le résultat loading par le vrai résultat
      setTests(prev => [
        ...prev.slice(0, -1), // Retirer le dernier élément (loading)
        result
      ]);

      // Petite pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5" />
          Test de Connexion Frontend ↔ Backend
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Tests en cours...' : 'Relancer les tests'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {test.status === 'loading' && (
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                )}
                {test.status === 'success' && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {test.status === 'error' && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                
                <div>
                  <div className="font-medium">{test.endpoint}</div>
                  {test.status === 'loading' && (
                    <div className="text-sm text-gray-500">Test en cours...</div>
                  )}
                  {test.status === 'success' && test.data && (
                    <div className="text-sm text-gray-600">
                      {test.data.status === 'OK' && (
                        <span>Serveur opérationnel</span>
                      )}
                      {test.data.success && test.data.meta && (
                        <span>
                          {test.data.meta.total} élément(s) - 
                          DB: {test.data.meta.database?.mode || 'N/A'}
                        </span>
                      )}
                      {test.data.data && Array.isArray(test.data.data) && (
                        <span>{test.data.data.length} élément(s)</span>
                      )}
                    </div>
                  )}
                  {test.status === 'error' && (
                    <div className="text-sm text-red-600">{test.error}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {test.duration && (
                  <Badge variant="secondary" className="text-xs">
                    {test.duration}ms
                  </Badge>
                )}
                <Badge 
                  variant={
                    test.status === 'success' ? 'default' : 
                    test.status === 'error' ? 'destructive' : 
                    'secondary'
                  }
                >
                  {test.status === 'loading' ? 'En cours' : test.status}
                </Badge>
              </div>
            </div>
          ))}

          {tests.length === 0 && !isRunning && (
            <div className="text-center text-gray-500 py-8">
              Aucun test exécuté. Cliquez sur "Relancer les tests" pour commencer.
            </div>
          )}
        </div>

        {tests.length > 0 && !isRunning && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium mb-2">Résumé des tests:</div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                {tests.filter(t => t.status === 'success').length} réussis
              </div>
              <div className="flex items-center gap-1 text-red-600">
                <AlertCircle className="w-3 h-3" />
                {tests.filter(t => t.status === 'error').length} échoués
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}