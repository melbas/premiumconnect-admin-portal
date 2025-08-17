import { supabase } from '@/integrations/supabase/client';

export interface FinancialKPI {
  id: string;
  metric_date: string;
  mrr_new: number;
  mrr_expansion: number;
  mrr_contraction: number;
  mrr_churn: number;
  mrr_total: number;
  nrr_percentage: number;
  arpu: number;
  arpu_b2b: number;
  arpu_b2c: number;
  churn_rate_customers: number;
  churn_rate_revenue: number;
  total_customers: number;
  new_customers: number;
  churned_customers: number;
  created_at: string;
}

export interface CustomerSatisfactionMetrics {
  id: string;
  metric_date: string;
  nps_score?: number;
  csat_score?: number;
  fcr_rate: number;
  ttfa_median_hours?: number;
  ttfa_p95_hours?: number;
  survey_responses: number;
  support_tickets: number;
  resolved_first_contact: number;
  segment?: string;
  acquisition_channel?: string;
  created_at: string;
}

export interface MRRBreakdown {
  new: number;
  expansion: number;
  contraction: number;
  churn: number;
  total: number;
  growth_rate: number;
}

export interface ChurnAnalysis {
  customer_churn_rate: number;
  revenue_churn_rate: number;
  is_healthy: boolean;
  trend: 'improving' | 'stable' | 'declining';
}

class FinancialKPIService {
  async getLatestFinancialKPIs(): Promise<FinancialKPI | null> {
    try {
      const { data, error } = await supabase
        .from('financial_kpis')
        .select('*')
        .order('metric_date', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching latest financial KPIs:', error);
      return null;
    }
  }

  async getFinancialKPIsRange(startDate: string, endDate: string): Promise<FinancialKPI[]> {
    try {
      const { data, error } = await supabase
        .from('financial_kpis')
        .select('*')
        .gte('metric_date', startDate)
        .lte('metric_date', endDate)
        .order('metric_date', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching financial KPIs range:', error);
      return [];
    }
  }

  async getMRRBreakdown(months = 6): Promise<MRRBreakdown[]> {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      
      const { data, error } = await supabase
        .from('financial_kpis')
        .select('metric_date, mrr_new, mrr_expansion, mrr_contraction, mrr_churn, mrr_total')
        .gte('metric_date', startDate.toISOString().split('T')[0])
        .order('metric_date', { ascending: true });
      
      if (error) throw error;
      
      return (data || []).map((item, index, array) => {
        const prevTotal = index > 0 ? array[index - 1].mrr_total : item.mrr_total;
        const growth_rate = prevTotal > 0 ? ((item.mrr_total - prevTotal) / prevTotal) * 100 : 0;
        
        return {
          new: item.mrr_new,
          expansion: item.mrr_expansion,
          contraction: item.mrr_contraction,
          churn: item.mrr_churn,
          total: item.mrr_total,
          growth_rate
        };
      });
    } catch (error) {
      console.error('Error fetching MRR breakdown:', error);
      return [];
    }
  }

  async getChurnAnalysis(): Promise<ChurnAnalysis> {
    try {
      const { data, error } = await supabase
        .from('financial_kpis')
        .select('churn_rate_customers, churn_rate_revenue, metric_date')
        .order('metric_date', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return {
          customer_churn_rate: 0,
          revenue_churn_rate: 0,
          is_healthy: true,
          trend: 'stable'
        };
      }
      
      const latest = data[0];
      const customer_churn_rate = latest.churn_rate_customers;
      const revenue_churn_rate = latest.churn_rate_revenue;
      
      // Determine trend
      let trend: 'improving' | 'stable' | 'declining' = 'stable';
      if (data.length >= 2) {
        const previous = data[1];
        const customerTrend = customer_churn_rate - previous.churn_rate_customers;
        const revenueTrend = revenue_churn_rate - previous.churn_rate_revenue;
        
        if (customerTrend < -0.5 || revenueTrend < -0.5) {
          trend = 'improving';
        } else if (customerTrend > 0.5 || revenueTrend > 0.5) {
          trend = 'declining';
        }
      }
      
      return {
        customer_churn_rate,
        revenue_churn_rate,
        is_healthy: customer_churn_rate < 8 && revenue_churn_rate < 10, // Industry benchmarks
        trend
      };
    } catch (error) {
      console.error('Error fetching churn analysis:', error);
      return {
        customer_churn_rate: 0,
        revenue_churn_rate: 0,
        is_healthy: true,
        trend: 'stable'
      };
    }
  }

  async getCustomerSatisfactionMetrics(months = 6): Promise<CustomerSatisfactionMetrics[]> {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      
      const { data, error } = await supabase
        .from('customer_satisfaction_metrics')
        .select('*')
        .gte('metric_date', startDate.toISOString().split('T')[0])
        .order('metric_date', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching customer satisfaction metrics:', error);
      return [];
    }
  }

  async getNRRTrend(months = 6): Promise<Array<{ date: string; nrr: number }>> {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      
      const { data, error } = await supabase
        .from('financial_kpis')
        .select('metric_date, nrr_percentage')
        .gte('metric_date', startDate.toISOString().split('T')[0])
        .order('metric_date', { ascending: true });
      
      if (error) throw error;
      
      return (data || []).map(item => ({
        date: item.metric_date,
        nrr: item.nrr_percentage
      }));
    } catch (error) {
      console.error('Error fetching NRR trend:', error);
      return [];
    }
  }

  async getARPUSegmentBreakdown(): Promise<Array<{ segment: string; arpu: number; change: number }>> {
    try {
      const { data, error } = await supabase
        .from('financial_kpis')
        .select('arpu, arpu_b2b, arpu_b2c, metric_date')
        .order('metric_date', { ascending: false })
        .limit(2);
      
      if (error) throw error;
      
      if (!data || data.length === 0) return [];
      
      const latest = data[0];
      const previous = data.length > 1 ? data[1] : latest;
      
      return [
        {
          segment: 'Global',
          arpu: latest.arpu,
          change: ((latest.arpu - previous.arpu) / previous.arpu) * 100
        },
        {
          segment: 'B2B',
          arpu: latest.arpu_b2b,
          change: ((latest.arpu_b2b - previous.arpu_b2b) / previous.arpu_b2b) * 100
        },
        {
          segment: 'B2C',
          arpu: latest.arpu_b2c,
          change: ((latest.arpu_b2c - previous.arpu_b2c) / previous.arpu_b2c) * 100
        }
      ];
    } catch (error) {
      console.error('Error fetching ARPU segment breakdown:', error);
      return [];
    }
  }

  async recordFinancialKPI(kpi: Omit<FinancialKPI, 'id' | 'created_at'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('financial_kpis')
        .insert([kpi]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error recording financial KPI:', error);
      throw error;
    }
  }

  async recordCustomerSatisfactionMetrics(metrics: Omit<CustomerSatisfactionMetrics, 'id' | 'created_at'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('customer_satisfaction_metrics')
        .insert([metrics]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error recording customer satisfaction metrics:', error);
      throw error;
    }
  }

  // Health check for financial metrics
  async getFinancialHealthScore(): Promise<{
    score: number;
    factors: Array<{ factor: string; weight: number; score: number; status: 'good' | 'warning' | 'critical' }>;
  }> {
    try {
      const latest = await this.getLatestFinancialKPIs();
      const churnAnalysis = await this.getChurnAnalysis();
      
      if (!latest) {
        return {
          score: 0,
          factors: [{ factor: 'No Data', weight: 1, score: 0, status: 'critical' }]
        };
      }
      
      const factors = [
        {
          factor: 'NRR',
          weight: 0.3,
          score: Math.min(latest.nrr_percentage / 120 * 100, 100), // Target 120%
          status: latest.nrr_percentage >= 110 ? 'good' : latest.nrr_percentage >= 100 ? 'warning' : 'critical' as 'good' | 'warning' | 'critical'
        },
        {
          factor: 'Customer Churn',
          weight: 0.25,
          score: Math.max(0, 100 - (churnAnalysis.customer_churn_rate / 8 * 100)), // Target <8%
          status: churnAnalysis.customer_churn_rate <= 5 ? 'good' : churnAnalysis.customer_churn_rate <= 8 ? 'warning' : 'critical' as 'good' | 'warning' | 'critical'
        },
        {
          factor: 'MRR Growth',
          weight: 0.25,
          score: latest.mrr_expansion > latest.mrr_churn ? 100 : 50,
          status: latest.mrr_expansion > latest.mrr_churn ? 'good' : 'warning' as 'good' | 'warning' | 'critical'
        },
        {
          factor: 'ARPU Stability',
          weight: 0.2,
          score: latest.arpu > 0 ? 100 : 0,
          status: latest.arpu > 0 ? 'good' : 'critical' as 'good' | 'warning' | 'critical'
        }
      ];
      
      const totalScore = factors.reduce((sum, factor) => sum + (factor.score * factor.weight), 0);
      
      return {
        score: Math.round(totalScore),
        factors
      };
    } catch (error) {
      console.error('Error calculating financial health score:', error);
      return {
        score: 0,
        factors: [{ factor: 'Error', weight: 1, score: 0, status: 'critical' }]
      };
    }
  }
}

export const financialKPIService = new FinancialKPIService();
export default financialKPIService;