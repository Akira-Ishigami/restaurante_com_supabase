import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];

type OrderItem = Database['public']['Tables']['order_items']['Row'];
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];

export interface CreateOrderData {
  order: Omit<OrderInsert, 'order_number'>;
  items: Omit<OrderItemInsert, 'order_id'>[];
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
  customer?: {
    name: string;
    phone: string;
    email?: string;
  };
}

export class OrderService {
  // Generate order number
  static async generateOrderNumber(): Promise<string> {
    const { data, error } = await supabase.rpc('generate_order_number');
    
    if (error) throw error;
    return data;
  }

  // Create order with items
  static async create(orderData: CreateOrderData): Promise<OrderWithItems> {
    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        ...orderData.order,
        order_number: orderNumber
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = orderData.items.map(item => ({
      ...item,
      order_id: order.id
    }));

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select();

    if (itemsError) throw itemsError;

    return {
      ...order,
      order_items: items || []
    };
  }

  // Get orders for restaurant
  static async getByRestaurant(
    restaurantId: string,
    status?: string,
    limit: number = 50
  ): Promise<OrderWithItems[]> {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        customers (name, phone, email)
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  // Get order by ID
  static async getById(orderId: string): Promise<OrderWithItems | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        customers (name, phone, email)
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  }

  // Update order status
  static async updateStatus(
    orderId: string, 
    status: Order['status'],
    additionalUpdates?: Partial<OrderUpdate>
  ): Promise<Order> {
    const updates: OrderUpdate = {
      status,
      ...additionalUpdates
    };

    // Set delivered_at when status is delivered
    if (status === 'delivered') {
      updates.delivered_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update payment status
  static async updatePaymentStatus(
    orderId: string,
    paymentStatus: Order['payment_status']
  ): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get orders by status for restaurant
  static async getByStatus(
    restaurantId: string,
    status: Order['status']
  ): Promise<OrderWithItems[]> {
    return this.getByRestaurant(restaurantId, status);
  }

  // Get today's orders
  static async getTodaysOrders(restaurantId: string): Promise<OrderWithItems[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        customers (name, phone, email)
      `)
      .eq('restaurant_id', restaurantId)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get order statistics
  static async getStats(restaurantId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('orders')
      .select('status, total_amount, created_at')
      .eq('restaurant_id', restaurantId)
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const orders = data || [];
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      statusCounts
    };
  }
}