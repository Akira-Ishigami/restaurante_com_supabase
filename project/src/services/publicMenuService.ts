import { supabase } from '../lib/supabase';
import { isDemoMode } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];
type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];
type MenuItem = Database['public']['Tables']['menu_items']['Row'];

export interface PublicMenuData {
  restaurant: Restaurant;
  categories: (MenuCategory & { menu_items: MenuItem[] })[];
}

export class PublicMenuService {
  // Get restaurant with full menu for public display
  static async getRestaurantMenu(restaurantId?: string): Promise<PublicMenuData | null> {
    // Return null in demo mode to avoid API calls
    if (isDemoMode) {
      return null;
    }

    try {
      // If no restaurantId provided, get the first active restaurant (demo mode)
      let restaurantQuery = supabase
        .from('restaurants')
        .select('*');
      
      if (restaurantId) {
        restaurantQuery = restaurantQuery.eq('id', restaurantId);
      } else {
        restaurantQuery = restaurantQuery.limit(1);
      }

      const { data: restaurant, error: restaurantError } = await restaurantQuery.single();

      if (restaurantError || !restaurant) {
        console.error('Restaurant not found:', restaurantError);
        return null;
      }

      // Get categories with menu items
      const { data: categories, error: categoriesError } = await supabase
        .from('menu_categories')
        .select(`
          *,
          menu_items (*)
        `)
        .eq('restaurant_id', restaurant.id)
        .eq('is_active', true)
        .order('display_order');

      if (categoriesError) {
        console.error('Error loading categories:', categoriesError);
        return null;
      }

      return {
        restaurant,
        categories: categories || []
      };
    } catch (error) {
      console.error('Error in getRestaurantMenu:', error);
      return null;
    }
  }

  // Get available menu items for a restaurant
  static async getAvailableItems(restaurantId: string): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_available', true)
        .order('display_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading available items:', error);
      return [];
    }
  }

  // Get popular items
  static async getPopularItems(restaurantId: string, limit: number = 6): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_available', true)
        .eq('is_popular', true)
        .order('display_order')
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading popular items:', error);
      return [];
    }
  }
}