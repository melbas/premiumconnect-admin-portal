import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CustomerMetrics {
  total_customers: number;
  new_customers: number;
  churned_customers: number;
  monthly_revenue: number;
  expansion_revenue: number;
  contraction_revenue: number;
  churn_revenue: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting financial KPI calculation...');

    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Calculate current month KPIs
    const currentKPIs = await calculateMonthlyKPIs(supabase, currentMonth);
    const previousKPIs = await getPreviousMonthKPIs(supabase, previousMonth);

    // Calculate derived metrics
    const kpiData = {
      metric_date: currentMonth.toISOString().split('T')[0],
      ...currentKPIs,
      // NRR calculation
      nrr_percentage: calculateNRR(currentKPIs, previousKPIs),
      // ARPU calculations
      arpu: currentKPIs.total_customers > 0 ? currentKPIs.monthly_revenue / currentKPIs.total_customers : 0,
      arpu_b2b: currentKPIs.total_customers > 0 ? (currentKPIs.monthly_revenue * 0.7) / (currentKPIs.total_customers * 0.3) : 0, // Assume 30% B2B
      arpu_b2c: currentKPIs.total_customers > 0 ? (currentKPIs.monthly_revenue * 0.3) / (currentKPIs.total_customers * 0.7) : 0, // Assume 70% B2C
      // Churn rates
      churn_rate_customers: previousKPIs?.total_customers > 0 ? (currentKPIs.churned_customers / previousKPIs.total_customers) * 100 : 0,
      churn_rate_revenue: previousKPIs?.monthly_revenue > 0 ? (currentKPIs.churn_revenue / previousKPIs.monthly_revenue) * 100 : 0
    };

    // Insert or update KPI record
    const { error: upsertError } = await supabase
      .from('financial_kpis')
      .upsert(kpiData, { 
        onConflict: 'metric_date',
        ignoreDuplicates: false 
      });

    if (upsertError) {
      throw new Error(`Failed to upsert financial KPIs: ${upsertError.message}`);
    }

    console.log('Financial KPI calculation completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Financial KPIs calculated successfully',
        data: kpiData,
        timestamp: today.toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in financial KPI calculation:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function calculateMonthlyKPIs(supabase: any, month: Date): Promise<CustomerMetrics> {
  const monthStart = month.toISOString().split('T')[0];
  const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
  const monthEnd = nextMonth.toISOString().split('T')[0];

  // Get total active customers at month end
  const { count: totalCustomers } = await supabase
    .from('wifi_users')
    .select('*', { count: 'exact', head: true })
    .lte('created_at', monthEnd);

  // Get new customers this month
  const { count: newCustomers } = await supabase
    .from('wifi_users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', monthStart)
    .lt('created_at', monthEnd);

  // Calculate churned customers (simplified - users with no activity in the last 60 days)
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
  const { count: churned } = await supabase
    .from('wifi_users')
    .select('id', { count: 'exact', head: true })
    .not('last_seen', 'is', null)
    .lt('last_seen', sixtyDaysAgo);

  // Get completed transactions this month
  const { data: transactions, error: transError } = await supabase
    .from('transactions')
    .select('amount, user_id, created_at')
    .eq('status', 'completed')
    .gte('created_at', monthStart)
    .lt('created_at', monthEnd);

  if (transError) {
    console.error('Error fetching transactions:', transError);
  }

  // Calculate revenue metrics
  const monthlyRevenue = transactions?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
  
  // Simulate expansion/contraction (in real implementation, compare to previous month per customer)
  const expansionRevenue = monthlyRevenue * 0.15; // 15% from upsells
  const contractionRevenue = monthlyRevenue * 0.05; // 5% from downgrades
  const churnRevenue = monthlyRevenue * 0.08; // 8% from churned customers

  return {
    total_customers: totalCustomers || 0,
    new_customers: newCustomers || 0,
    churned_customers: churned || 0,
    monthly_revenue: monthlyRevenue,
    expansion_revenue: expansionRevenue,
    contraction_revenue: contractionRevenue,
    churn_revenue: churnRevenue
  };
}

async function getPreviousMonthKPIs(supabase: any, previousMonth: Date): Promise<CustomerMetrics | null> {
  const monthDate = previousMonth.toISOString().split('T')[0];
  
  const { data: kpis, error } = await supabase
    .from('financial_kpis')
    .select('*')
    .eq('metric_date', monthDate)
    .single();

  if (error || !kpis) {
    console.log('No previous month KPIs found, using defaults');
    return null;
  }

  return {
    total_customers: kpis.total_customers,
    new_customers: kpis.new_customers,
    churned_customers: kpis.churned_customers,
    monthly_revenue: kpis.mrr_total,
    expansion_revenue: kpis.mrr_expansion,
    contraction_revenue: kpis.mrr_contraction,
    churn_revenue: kpis.mrr_churn
  };
}

function calculateNRR(current: CustomerMetrics, previous: CustomerMetrics | null): number {
  if (!previous || previous.monthly_revenue === 0) {
    return 100; // Default if no previous data
  }

  // NRR = (Starting MRR + Expansion - Contraction - Churn) / Starting MRR * 100
  const startingMRR = previous.monthly_revenue;
  const endingMRR = startingMRR + current.expansion_revenue - current.contraction_revenue - current.churn_revenue;
  
  return (endingMRR / startingMRR) * 100;
}