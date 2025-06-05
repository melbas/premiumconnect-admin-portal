
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiteNetworkConfig } from './types';

interface DNSConfigurationProps {
  dnsConfig: SiteNetworkConfig['dnsConfig'];
  onDnsConfigChange: (key: string, value: string) => void;
}

const DNSConfiguration: React.FC<DNSConfigurationProps> = ({
  dnsConfig,
  onDnsConfigChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration DNS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="domain">Domaine</Label>
            <Input
              id="domain"
              value={dnsConfig?.domain || ''}
              onChange={(e) => onDnsConfigChange('domain', e.target.value)}
              placeholder="example.com"
            />
          </div>
          <div>
            <Label htmlFor="zoneId">Zone ID Cloudflare</Label>
            <Input
              id="zoneId"
              value={dnsConfig?.zoneId || ''}
              onChange={(e) => onDnsConfigChange('zoneId', e.target.value)}
              placeholder="Zone ID"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DNSConfiguration;
