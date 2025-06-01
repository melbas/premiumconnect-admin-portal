
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConnectionsOverviewSection from './Sections/ConnectionsOverviewSection';
import CaptivePortalMetricsSection from './Sections/CaptivePortalMetricsSection';
import UserActivitySection from './Sections/UserActivitySection';
import EnhancedChatSection from './Sections/EnhancedChatSection';
import AIOnboardingAssistant from './CaptivePortal/AIOnboardingAssistant';
import AIInsightsDashboard from './CaptivePortal/AIInsightsDashboard';
import MobileMoneyAssistant from '../AI/MobileMoneyAssistant';
import { useUserStatistics } from '@/hooks/use-user-statistics';

const CaptivePortalDashboard = () => {
  const { chartData } = useUserStatistics(30);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Portail Captif IA</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="ai-insights">Insights IA</TabsTrigger>
          <TabsTrigger value="chat">Assistant IA</TabsTrigger>
          <TabsTrigger value="onboarding">Accueil IA</TabsTrigger>
          <TabsTrigger value="payments">Mobile Money IA</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CaptivePortalMetricsSection />
          <ConnectionsOverviewSection />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserActivitySection chartData={chartData} />
            <EnhancedChatSection 
              title="Support IA Instantané"
              aiContext="captive-portal"
              enableMultilingual={true}
              enableRecommendations={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <AIInsightsDashboard />
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedChatSection 
              title="Assistant IA Captive Portal"
              placeholder="Demandez de l'aide en français ou wolof..."
              aiContext="support"
              enableMultilingual={true}
              enableRecommendations={true}
            />
            <EnhancedChatSection 
              title="Guide de Connexion IA"
              placeholder="Comment puis-je vous aider à vous connecter ?"
              aiContext="onboarding"
              enableMultilingual={true}
              enableRecommendations={false}
            />
          </div>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIOnboardingAssistant 
              language="fr"
              userProfile={{
                isFirstTime: true,
                deviceType: 'mobile',
                connectionQuality: 'medium'
              }}
            />
            <AIOnboardingAssistant 
              language="wo"
              userProfile={{
                isFirstTime: false,
                deviceType: 'mobile',
                connectionQuality: 'slow'
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MobileMoneyAssistant 
              amount={500}
              context="wifi_payment"
              language="fr"
              onPaymentSelected={(provider, amount) => {
                console.log('💰 Payment selected:', provider, amount);
              }}
            />
            <MobileMoneyAssistant 
              amount={1000}
              context="wifi_payment"
              language="wo"
              onPaymentSelected={(provider, amount) => {
                console.log('💰 Payment selected:', provider, amount);
              }}
            />
          </div>
          
          {/* Section recommandations familiales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <MobileMoneyAssistant 
              amount={300}
              context="family_plan"
              language="fr"
            />
            <MobileMoneyAssistant 
              amount={750}
              context="business_plan"
              language="fr"
            />
            <MobileMoneyAssistant 
              amount={150}
              context="student_plan"
              language="wo"
            />
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <UserActivitySection chartData={chartData} />
          <ConnectionsOverviewSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaptivePortalDashboard;
