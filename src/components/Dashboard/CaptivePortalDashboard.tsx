
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConnectionsOverviewSection from './Sections/ConnectionsOverviewSection';
import CaptivePortalMetricsSection from './Sections/CaptivePortalMetricsSection';
import UserActivitySection from './Sections/UserActivitySection';
import EnhancedChatSection from './Sections/EnhancedChatSection';
import AIOnboardingAssistant from './CaptivePortal/AIOnboardingAssistant';
import AIInsightsDashboard from './CaptivePortal/AIInsightsDashboard';
import TensorFlowBehaviorDashboard from './CaptivePortal/TensorFlowBehaviorDashboard';
import { MobileMoneyAssistant } from '../AI/MobileMoneyAssistant';
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
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="ai-insights">Insights IA</TabsTrigger>
          <TabsTrigger value="tensorflow">TensorFlow.js</TabsTrigger>
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
              userId="overview-user"
              initialLanguage="fr"
              enableCulturalContext={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <AIInsightsDashboard />
        </TabsContent>

        <TabsContent value="tensorflow" className="space-y-6">
          <TensorFlowBehaviorDashboard />
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedChatSection 
              userId="chat-support-user"
              initialLanguage="fr"
              enableCulturalContext={true}
            />
            <EnhancedChatSection 
              userId="chat-onboarding-user"
              initialLanguage="wo"
              enableCulturalContext={true}
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
              userId="payment-user-1"
              initialLanguage="fr"
              location="Dakar"
            />
            <MobileMoneyAssistant 
              userId="payment-user-2"
              initialLanguage="wo"
              location="Thiès"
            />
          </div>
          
          {/* Section recommandations familiales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <MobileMoneyAssistant 
              userId="family-user"
              initialLanguage="fr"
              location="Rufisque"
            />
            <MobileMoneyAssistant 
              userId="business-user"
              initialLanguage="fr"
              location="Dakar"
            />
            <MobileMoneyAssistant 
              userId="student-user"
              initialLanguage="wo"
              location="Saint-Louis"
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
