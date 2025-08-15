import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Customer = Database['public']['Tables']['customers']['Row'];

export const useRealTimeCustomers = (restaurantId: string | null) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      setCustomers([]);
      setIsLoading(false);
      return;
    }

    // Load initial customers
    loadCustomers();

    // Set up real-time subscription
    const subscription = supabase
      .channel('customers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          console.log('Customer change detected:', payload);
          loadCustomers();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [restaurantId]);

  const loadCustomers = async () => {
    if (!restaurantId) return;

    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCustomers(data || []);
    } catch (err) {
      console.error('Error loading customers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    customers,
    isLoading,
    error,
    refetch: loadCustomers
  };
};