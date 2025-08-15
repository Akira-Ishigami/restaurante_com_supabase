import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];
type RestaurantInsert = Database['public']['Tables']['restaurants']['Insert'];
type RestaurantUpdate = Database['public']['Tables']['restaurants']['Update'];

export class RestaurantService {
  // Get restaurant by user ID
  static async getByUserId(userId: string): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No restaurant found
      }
      throw error;
    }

    return data;
  }

  // Create a new restaurant
  static async create(restaurant: RestaurantInsert): Promise<Restaurant> {
    const { data, error } = await supabase
      .from('restaurants')
      .insert(restaurant)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update restaurant
  static async update(id: string, updates: RestaurantUpdate): Promise<Restaurant> {
    const { data, error } = await supabase
      .from('restaurants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete restaurant
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Get restaurant with full details (including categories and items)
  static async getWithDetails(restaurantId: string) {
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single();

    if (restaurantError) throw restaurantError;

    const { data: categories, error: categoriesError } = await supabase
      .from('menu_categories')
      .select(`
        *,
        menu_items (*)
      `)
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .order('display_order');

    if (categoriesError) throw categoriesError;

    return {
      ...restaurant,
      categories: categories || []
    };
  }
}