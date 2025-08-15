import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  today: {
    orders: number;
    revenue: number;
    customers: number;
  };
  week: {
    orders: number;
    revenue: number;
    customers: number;
  };
  month: {
    orders: number;
    revenue: number;
    customers: number;
  };
}

export const useDashboardStats = (restaurantId: string | null) => {
  const [stats, setStats] = useState<DashboardStats>({
    today: { orders: 0, revenue: 0, customers: 0 },
    week: { orders: 0, revenue: 0, customers: 0 },
    month: { orders: 0, revenue: 0, customers: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      setIsLoading(false);
      return;
    }

    loadStats();

    // Update stats every 5 minutes
    const interval = setInterval(() => {
      loadStats();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [restaurantId]);

  const loadStats = async () => {
    if (!restaurantId) return;

    try {
      setError(null);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get today's stats
      const { data: todayOrders } = await supabase
        .from('orders')
        .select('total_amount, customer_id')
        .eq('restaurant_id', restaurantId)
        .gte('created_at', today.toISOString());

      // Get week's stats
      const { data: weekOrders } = await supabase
        .from('orders')
        .select('total_amount, customer_id')
        .eq('restaurant_id', restaurantId)
        .gte('created_at', weekStart.toISOString());

      // Get month's stats
      const { data: monthOrders } = await supabase
        .from('orders')
        .select('total_amount, customer_id')
        .eq('restaurant_id', restaurantId)
        .gte('created_at', monthStart.toISOString());

      setStats({
        today: {
          orders: todayOrders?.length || 0,
          revenue: todayOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0,
          customers: new Set(todayOrders?.map(order => order.customer_id)).size || 0
        },
        week: {
          orders: weekOrders?.length || 0,
          revenue: weekOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0,
          customers: new Set(weekOrders?.map(order => order.customer_id)).size || 0
        },
        month: {
          orders: monthOrders?.length || 0,
          revenue: monthOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0,
          customers: new Set(monthOrders?.map(order => order.customer_id)).size || 0
        }
      });
    } catch (err) {
      console.error('Error loading stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stats,
    isLoading,
    error,
    refetch: loadStats
  };
};