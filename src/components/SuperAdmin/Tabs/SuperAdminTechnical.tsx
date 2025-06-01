
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChartComponent } from '@/components/Dashboard/Chart';
import { NetworkConfigPanel, ServerMonitoring } from './TechnicalComponents';
import { networkStats, deviceData } from '../mockData';

interface SuperAdminTechnicalProps {
  initialView?: string;
}

const SuperAdminTechnical: React.FC<SuperAdminTechnicalProps> = ({ initialView = 'dashboard' }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="dashboard-title">Technical Dashboard</h1>
      </div>

      <Tabs defaultValue={initialView} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="captive-portal">Captive Portal</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Network Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartComponent
                    type="line"
                    data={networkStats}
                    height={300}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Connected Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartComponent
                    type="bar"
                    data={deviceData}
                    height={300}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <ServerMonitoring />
          </div>
        </TabsContent>

        <TabsContent value="network" className="mt-6">
          <NetworkConfigPanel />
        </TabsContent>

        <TabsContent value="captive-portal" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Captive Portal Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Captive portal management content would go here.</p>
              <Button>Configure Portal</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminTechnical;
