import { supabase } from '../lib/supabase';
import { isDemoMode, mockApiDelay } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Customer = Database['public']['Tables']['customers']['Row'];
type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

export class CustomerService {
  // Get customers for restaurant
  static async getByRestaurant(restaurantId: string): Promise<Customer[]> {
    // Return mock data in demo mode
    if (isDemoMode()) {
      await mockApiDelay();
      return []; // No customers in demo mode
    }

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Find customer by phone
  static async findByPhone(restaurantId: string, phone: string): Promise<Customer | null> {
    // Return mock data in demo mode
    if (isDemoMode()) {
      await mockApiDelay();
      return null; // No existing customers in demo mode
    }

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('phone', phone)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Customer not found
      }
      throw error;
    }

    return data;
  }

  // Create customer
  static async create(customer: CustomerInsert): Promise<Customer> {
    // Return mock data in demo mode
    if (isDemoMode()) {
      await mockApiDelay();
      
      const mockCustomer: Customer = {
        id: `demo-customer-${Date.now()}`,
        restaurant_id: customer.restaurant_id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email || null,
        address: customer.address || null,
        total_orders: 0,
        total_spent: 0,
        last_order_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return mockCustomer;
    }

    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update customer
  static async update(id: string, updates: CustomerUpdate): Promise<Customer> {
    // Return mock data in demo mode
    if (isDemoMode()) {
      await mockApiDelay();
      
      const mockCustomer: Customer = {
        id: id,
        restaurant_id: 'demo-restaurant',
        name: updates.name || 'Demo Customer',
        phone: '(11) 99999-9999',
        email: updates.email || null,
        address: updates.address || null,
        total_orders: 1,
        total_spent: 50.00,
        last_order_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return mockCustomer;
    }

    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Find or create customer
  static async findOrCreate(
    restaurantId: string,
    customerData: {
      name: string;
      phone: string;
      email?: string;
      address?: string;
    }
  ): Promise<Customer> {
    // Return mock data in demo mode
    if (isDemoMode) {
      await mockApiDelay();
      
      const mockCustomer: Customer = {
        id: `demo-customer-${Date.now()}`,
        restaurant_id: restaurantId,
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email || null,
        address: customerData.address || null,
        total_orders: 0,
        total_spent: 0,
        last_order_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return mockCustomer;
    }

    // Try to find existing customer
    const existingCustomer = await this.findByPhone(restaurantId, customerData.phone);
    
    if (existingCustomer) {
      // Update customer data if provided
      const updates: CustomerUpdate = {};
      if (customerData.name && customerData.name !== existingCustomer.name) {
        updates.name = customerData.name;
      }
      if (customerData.email && customerData.email !== existingCustomer.email) {
        updates.email = customerData.email;
      }
      if (customerData.address && customerData.address !== existingCustomer.address) {
        updates.address = customerData.address;
      }

      if (Object.keys(updates).length > 0) {
        return this.update(existingCustomer.id, updates);
      }

      return existingCustomer;
    }

    // Create new customer
    return this.create({
      restaurant_id: restaurantId,
      ...customerData
    });
  }

  // Update customer stats after order
  static async updateOrderStats(
    customerId: string,
    orderAmount: number  
  ): Promise<Customer> {
    // Return mock data in demo mode
    if (isDemoMode) {
      await mockApiDelay();
      
      const mockCustomer: Customer = {
        id: customerId,
        restaurant_id: 'demo-restaurant',
        name: 'Demo Customer',
        phone: '(11) 99999-9999',
        email: null,
        address: null,
        total_orders: 1,
        total_spent: orderAmount,
        last_order_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return mockCustomer;
    }

    const { data, error } = await supabase
      .from('customers')
      .update({
        total_orders: 1, // Will be incremented by trigger
        total_spent: orderAmount, // Will be added by trigger  
        last_order_at: new Date().toISOString()
      })
      .eq('id', customerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get customer statistics
  static async getStats(restaurantId: string) {
    // Return mock data in demo mode
    if (isDemoMode()) {
      await mockApiDelay();
      
      return {
        totalCustomers: 0,
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        newCustomersThisMonth: 0
      };
    }

    const { data, error } = await supabase
      .from('customers')
      .select('total_orders, total_spent, created_at')
      .eq('restaurant_id', restaurantId);

    if (error) throw error;

    const customers = data || [];
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, customer) => sum + customer.total_spent, 0);
    const totalOrders = customers.reduce((sum, customer) => sum + customer.total_orders, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // New customers this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const newCustomersThisMonth = customers.filter(
      customer => new Date(customer.created_at) >= thisMonth
    ).length;

    return {
      totalCustomers,
      totalRevenue,
      totalOrders,
      averageOrderValue,
      newCustomersThisMonth
    };
  }

  // Get top customers
  static async getTopCustomers(restaurantId: string, limit: number = 10): Promise<Customer[]> {
    // Return mock data in demo mode
    if (isDemoMode()) {
      await mockApiDelay();
      return []; // No customers in demo mode
    }

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('total_spent', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}