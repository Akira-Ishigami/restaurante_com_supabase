import { useState, useEffect } from 'react';
import { supabase, isDemoMode, mockApiDelay } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { demoRestaurant } from '../utils/demo-data';

type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];
type MenuItem = Database['public']['Tables']['menu_items']['Row'];

export interface MenuCategoryWithItems extends MenuCategory {
  menu_items: MenuItem[];
}

export const useRealTimeMenu = (restaurantId: string | null) => {
  const [categories, setCategories] = useState<MenuCategoryWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      setCategories([]);
      setIsLoading(false);
      return;
    }

    // Load initial menu
    loadMenu();

    // Set up real-time subscriptions
    const categoriesSubscription = supabase
      .channel('menu_categories_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_categories',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        () => loadMenu()
      )
      .subscribe();

    const itemsSubscription = supabase
      .channel('menu_items_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_items',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        () => loadMenu()
      )
      .subscribe();

    return () => {
      categoriesSubscription.unsubscribe();
      itemsSubscription.unsubscribe();
    };
  }, [restaurantId]);

  const loadMenu = async () => {
    if (!restaurantId) return;

    // Return empty data in demo mode OR if using demo restaurant ID
    if (isDemoMode || restaurantId === demoRestaurant.id) {
      try {
        setError(null);
        await mockApiDelay(500);
        setCategories([]);
      } catch (err) {
        console.error('Error in demo mode:', err);
        setError('Demo mode error');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('menu_categories')
        .select(`
          *,
          menu_items (*)
        `)
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;

      setCategories(data || []);
    } catch (err) {
      console.error('Error loading menu:', err);
      setError(err instanceof Error ? err.message : 'Failed to load menu');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    categories,
    isLoading,
    error,
    refetch: loadMenu
  };
};