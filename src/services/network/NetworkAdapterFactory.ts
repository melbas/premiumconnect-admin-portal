
import { NetworkAdapter, NetworkEquipment } from './types';
import { EquipmentDetectionService } from './EquipmentDetectionService';

export class NetworkAdapterFactory {
  private static adapters = new Map<string, NetworkAdapter>();

  static async createAdapter(equipment: NetworkEquipment): Promise<NetworkAdapter> {
    const key = `${equipment.type}_${equipment.id}`;
    
    if (this.adapters.has(key)) {
      return this.adapters.get(key)!;
    }

    let adapter: NetworkAdapter;

    switch (equipment.type) {
      case 'mikrotik':
        const { MikrotikAdapter } = await import('./adapters/MikrotikAdapter');
        adapter = new MikrotikAdapter(equipment);
        break;
      
      case 'cisco_meraki':
        const { CiscoMerakiAdapter } = await import('./adapters/CiscoMerakiAdapter');
        adapter = new CiscoMerakiAdapter(equipment);
        break;
      
      case 'tplink_omada':
        const { TPLinkOmadaAdapter } = await import('./adapters/TPLinkOmadaAdapter');
        adapter = new TPLinkOmadaAdapter(equipment);
        break;
      
      case 'ubiquiti':
        const { UbiquitiAdapter } = await import('./adapters/UbiquitiAdapter');
        adapter = new UbiquitiAdapter(equipment);
        break;

      case 'openwisp':
        const { OpenWispAdapter } = await import('./adapters/OpenWispAdapter');
        adapter = new OpenWispAdapter(equipment);
        break;

      case 'cloudflare_tunnel':
        const { CloudflareTunnelAdapter } = await import('./adapters/CloudflareTunnelAdapter');
        adapter = new CloudflareTunnelAdapter(equipment);
        break;

      case 'wireguard':
        const { WireGuardAdapter } = await import('./adapters/WireGuardAdapter');
        adapter = new WireGuardAdapter(equipment);
        break;

      case 'tailscale':
        const { TailscaleAdapter } = await import('./adapters/TailscaleAdapter');
        adapter = new TailscaleAdapter(equipment);
        break;

      case 'openvpn':
        const { OpenVPNAdapter } = await import('./adapters/OpenVPNAdapter');
        adapter = new OpenVPNAdapter(equipment);
        break;

      case 'direct':
        const { DirectConnectionAdapter } = await import('./adapters/DirectConnectionAdapter');
        adapter = new DirectConnectionAdapter(equipment);
        break;
      
      default:
        const { GenericRADIUSAdapter } = await import('./adapters/GenericRADIUSAdapter');
        adapter = new GenericRADIUSAdapter(equipment);
    }

    this.adapters.set(key, adapter);
    return adapter;
  }

  static getAdapter(equipmentId: string, type: string): NetworkAdapter | null {
    const key = `${type}_${equipmentId}`;
    return this.adapters.get(key) || null;
  }

  static async detectEquipmentType(ipAddress: string): Promise<NetworkEquipment['type'] | null> {
    return EquipmentDetectionService.detectEquipmentType(ipAddress);
  }

  static clearCache(): void {
    this.adapters.clear();
  }
}

// Re-export types for backwards compatibility
export type { NetworkAdapter, NetworkEquipment } from './types';
