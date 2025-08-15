import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];
type Customer = Database['public']['Tables']['customers']['Row'];

export interface OrderWithDetails extends Order {
  order_items: (OrderItem & {
    menu_items: {
      name: string;
      price: number;
    };
  })[];
  customers: Customer | null;
}

export const useRealTimeOrders = (restaurantId: string | null) => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    // Load initial orders
    loadOrders();

    // Set up real-time subscription
    const subscription = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          console.log('Order change detected:', payload);
          loadOrders(); // Reload orders when changes occur
        }
      )
      .subscribe();

    // Set up polling as backup (every 5 minutes)
    const interval = setInterval(() => {
      loadOrders();
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [restaurantId]);

  const loadOrders = async () => {
    if (!restaurantId) return;

    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (
              name,
              price
            )
          ),
          customers (*)
        `)
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state immediately for better UX
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      throw err;
    }
  };

  return {
    orders,
    isLoading,
    error,
    updateOrderStatus,
    refetch: loadOrders
  };
};