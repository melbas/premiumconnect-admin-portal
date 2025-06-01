
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings, 
  Database, 
  Activity, 
  RefreshCw,
  AlertCircle,
  CheckCircle 
} from 'lucide-react';

const DevelopmentPanel = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  
  const runTest = async (testName: string, testFn: () => Promise<boolean>) => {
    try {
      const result = await testFn();
      setTestResults(prev => ({ ...prev, [testName]: result }));
    } catch (error) {
      console.error(`Test ${testName} failed:`, error);
      setTestResults(prev => ({ ...prev, [testName]: false }));
    }
  };

  const tests = [
    {
      name: 'Mock Data',
      fn: async () => {
        const { MockStatisticsService } = await import('@/services/portal/mockStatisticsService');
        const data = await MockStatisticsService.getPortalStatistics();
        return data.length > 0;
      }
    },
    {
      name: 'Cache Service',
      fn: async () => {
        const { CacheService } = await import('@/services/portal/cacheService');
        CacheService.set('test', 'value', 1000);
        const result = CacheService.get('test');
        return result === 'value';
      }
    },
    {
      name: 'Statistics Provider',
      fn: async () => {
        const { StatisticsProvider } = await import('@/services/portal/statisticsProvider');
        const health = await StatisticsProvider.getSystemHealth();
        return !!health;
      }
    }
  ];

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.name, test.fn);
    }
  };

  return (
    <Card className="mb-6 border-dashed border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Settings className="h-5 w-5" />
          Panneau de Développement
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            Mode Dev
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={runAllTests}
            className="border-orange-300 hover:bg-orange-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tests Complets
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-blue-300 hover:bg-blue-100"
          >
            <Activity className="h-4 w-4 mr-2" />
            Recharger
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => console.clear()}
            className="border-gray-300 hover:bg-gray-100"
          >
            <Database className="h-4 w-4 mr-2" />
            Vider Console
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tests.map((test) => (
            <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg bg-white">
              <span className="text-sm font-medium">{test.name}</span>
              <div className="flex items-center gap-2">
                {testResults[test.name] !== undefined && (
                  testResults[test.name] ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )
                )}
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => runTest(test.name, test.fn)}
                >
                  Test
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-orange-700 bg-orange-100 p-3 rounded-lg">
          <p className="font-medium mb-1">Mode développement actif :</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Données simulées pour éviter les erreurs de base de données</li>
            <li>Cache en mémoire pour les tests</li>
            <li>Logs détaillés dans la console</li>
            <li>Tests automatisés pour valider les composants</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DevelopmentPanel;
