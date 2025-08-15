import { supabase, isDemoMode } from '../lib/supabase';
import { Database } from '../lib/database.types';

type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];
type MenuCategoryInsert = Database['public']['Tables']['menu_categories']['Insert'];
type MenuCategoryUpdate = Database['public']['Tables']['menu_categories']['Update'];

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert'];
type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update'];

export class MenuService {
  // Categories
  static async getCategories(restaurantId: string): Promise<MenuCategory[]> {
    // In demo mode, return mock data
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return [
        {
          id: 'demo-cat-1',
          restaurant_id: restaurantId,
          name: 'Pizzas',
          description: 'Pizzas artesanais',
          display_order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'demo-cat-2',
          restaurant_id: restaurantId,
          name: 'Lanches',
          description: 'Hambúrguers e sanduíches',
          display_order: 2,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }

    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .order('display_order');

    if (error) throw error;
    return data || [];
  }

  static async createCategory(category: MenuCategoryInsert): Promise<MenuCategory> {
    // In demo mode, return mock data
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockCategory: MenuCategory = {
        id: `demo-cat-${Date.now()}`,
        restaurant_id: category.restaurant_id,
        name: category.name,
        description: category.description || null,
        display_order: category.display_order || 0,
        is_active: category.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return mockCategory;
    }

    const { data, error } = await supabase
      .from('menu_categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCategory(id: string, updates: MenuCategoryUpdate): Promise<MenuCategory> {
    // In demo mode, return mock data
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockCategory: MenuCategory = {
        id: id,
        restaurant_id: 'demo-restaurant-1',
        name: updates.name || 'Updated Category',
        description: updates.description || null,
        display_order: updates.display_order || 0,
        is_active: updates.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return mockCategory;
    }

    const { data, error } = await supabase
      .from('menu_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteCategory(id: string): Promise<void> {
    // In demo mode, just simulate delay
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Menu Items
  static async getItems(restaurantId: string, categoryId?: string): Promise<MenuItem[]> {
    // In demo mode, return mock data only if items were "added by admin"
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return empty array initially - items will only appear when admin adds them
      return [];
    }

    let query = supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('display_order');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async getAvailableItems(restaurantId: string): Promise<MenuItem[]> {
    // In demo mode, return mock data
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    }

    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true)
      .order('display_order');

    if (error) throw error;
    return data || [];
  }

  // Create menu item with image support
  static async createItem(item: MenuItemInsert): Promise<MenuItem> {
    // In demo mode, return mock data
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockItem: MenuItem = {
        id: `demo-item-${Date.now()}`,
        restaurant_id: item.restaurant_id,
        category_id: item.category_id,
        name: item.name,
        description: item.description || null,
        price: item.price,
        preparation_time: item.preparation_time || 30,
        image_url: item.image_url || 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
        is_available: item.is_available ?? true,
        is_popular: item.is_popular ?? false,
        display_order: item.display_order || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return mockItem;
    }

    const { data, error } = await supabase
      .from('menu_items')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateItem(id: string, updates: MenuItemUpdate): Promise<MenuItem> {
    // In demo mode, return mock data
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockItem: MenuItem = {
        id: id,
        restaurant_id: 'demo-restaurant-1',
        category_id: 'demo-cat-1',
        name: updates.name || 'Updated Item',
        description: updates.description || null,
        price: updates.price || 25.90,
        preparation_time: updates.preparation_time || 30,
        image_url: updates.image_url || 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
        is_available: updates.is_available ?? true,
        is_popular: updates.is_popular ?? false,
        display_order: updates.display_order || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return mockItem;
    }

    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteItem(id: string): Promise<void> {
    // In demo mode, just simulate delay
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Get full menu with categories and items
  static async getFullMenu(restaurantId: string) {
    // In demo mode, return mock data
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    }

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
    return data || [];
  }

  // Get popular items
  static async getPopularItems(restaurantId: string, limit: number = 10): Promise<MenuItem[]> {
    // In demo mode, return mock data
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    }

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
  }

  // Upload image to Supabase Storage
  static async uploadImage(file: File, restaurantId: string): Promise<string> {
    // In demo mode, return mock URL
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=400`;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${restaurantId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('menu-images')
      .getPublicUrl(fileName);

    return publicUrl;
  }
}