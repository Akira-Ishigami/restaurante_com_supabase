import { useState, useEffect } from 'react';
import { OrderService, OrderWithItems } from '../services/orderService';
import { Database } from '../lib/database.types';

type OrderStatus = Database['public']['Tables']['orders']['Row']['status'];

export const useOrders = (restaurantId: string | null) => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    loadOrders();
  }, [restaurantId]);

  const loadOrders = async () => {
    if (!restaurantId) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const ordersData = await OrderService.getByRestaurant(restaurantId);
      setOrders(ordersData);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await OrderService.updateStatus(orderId, status);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status }
            : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      throw err;
    }
  };

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter(order => order.status === status);
  };

  const getTodaysOrders = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });
  };

  return {
    orders,
    isLoading,
    error,
    updateOrderStatus,
    getOrdersByStatus,
    getTodaysOrders,
    refetch: loadOrders
  };
};