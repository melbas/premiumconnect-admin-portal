
export interface DNSRecord {
  id?: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT';
  name: string;
  content: string;
  ttl?: number;
  proxied?: boolean;
}

export interface CloudflareDNSConfig {
  apiKey: string;
  zoneId: string;
  domain: string;
}

export class CloudflareDNSService {
  private config: CloudflareDNSConfig;
  private baseUrl = 'https://api.cloudflare.com/client/v4';

  constructor(config: CloudflareDNSConfig) {
    this.config = config;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async createSubdomain(subdomain: string, targetIp: string): Promise<DNSRecord | null> {
    try {
      const record: DNSRecord = {
        type: 'A',
        name: `${subdomain}.${this.config.domain}`,
        content: targetIp,
        ttl: 300,
        proxied: true // Enable Cloudflare proxy for DDoS protection
      };

      const response = await fetch(
        `${this.baseUrl}/zones/${this.config.zoneId}/dns_records`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(record)
        }
      );

      if (!response.ok) {
        console.error('Failed to create DNS record:', await response.text());
        return null;
      }

      const data = await response.json();
      console.log('✅ DNS record created:', data.result);
      return data.result;
    } catch (error) {
      console.error('Error creating DNS record:', error);
      return null;
    }
  }

  async updateSubdomain(recordId: string, targetIp: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/zones/${this.config.zoneId}/dns_records/${recordId}`,
        {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify({ content: targetIp })
        }
      );

      if (!response.ok) {
        console.error('Failed to update DNS record:', await response.text());
        return false;
      }

      console.log('✅ DNS record updated');
      return true;
    } catch (error) {
      console.error('Error updating DNS record:', error);
      return false;
    }
  }

  async deleteSubdomain(recordId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/zones/${this.config.zoneId}/dns_records/${recordId}`,
        {
          method: 'DELETE',
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        console.error('Failed to delete DNS record:', await response.text());
        return false;
      }

      console.log('✅ DNS record deleted');
      return true;
    } catch (error) {
      console.error('Error deleting DNS record:', error);
      return false;
    }
  }

  async listRecords(): Promise<DNSRecord[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/zones/${this.config.zoneId}/dns_records`,
        {
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        console.error('Failed to list DNS records:', await response.text());
        return [];
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error listing DNS records:', error);
      return [];
    }
  }

  async validateConfiguration(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/zones/${this.config.zoneId}`,
        {
          headers: this.getHeaders()
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error validating Cloudflare configuration:', error);
      return false;
    }
  }

  generateSubdomainName(siteId: string): string {
    // Generate a clean subdomain name from site ID
    return `site-${siteId.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  }
}
