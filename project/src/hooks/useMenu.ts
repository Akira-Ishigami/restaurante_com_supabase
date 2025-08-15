import { useState, useEffect } from 'react';
import { MenuService } from '../services/menuService';
import { Database } from '../lib/database.types';

type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];
type MenuItem = Database['public']['Tables']['menu_items']['Row'];

export const useMenu = (restaurantId: string | null) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      setCategories([]);
      setItems([]);
      setIsLoading(false);
      return;
    }

    loadMenu();
  }, [restaurantId]);

  const loadMenu = async () => {
    if (!restaurantId) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const [categoriesData, itemsData] = await Promise.all([
        MenuService.getCategories(restaurantId),
        MenuService.getItems(restaurantId)
      ]);

      setCategories(categoriesData);
      setItems(itemsData);
    } catch (err) {
      console.error('Error loading menu:', err);
      setError(err instanceof Error ? err.message : 'Failed to load menu');
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async (categoryData: {
    name: string;
    description?: string;
  }) => {
    if (!restaurantId) throw new Error('Restaurant ID required');

    try {
      const newCategory = await MenuService.createCategory({
        restaurant_id: restaurantId,
        ...categoryData
      });

      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      console.error('Error creating category:', err);
      throw err;
    }
  };

  const createItem = async (itemData: {
    category_id: string;
    name: string;
    description?: string;
    price: number;
    preparation_time?: number;
    image_url?: string;
    is_available?: boolean;
    is_popular?: boolean;
  }) => {
    if (!restaurantId) throw new Error('Restaurant ID required');

    try {
      const newItem = await MenuService.createItem({
        restaurant_id: restaurantId,
        ...itemData
      });

      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      console.error('Error creating menu item:', err);
      throw err;
    }
  };

  const updateItem = async (itemId: string, updates: Partial<MenuItem>) => {
    try {
      const updatedItem = await MenuService.updateItem(itemId, updates);
      
      setItems(prev => 
        prev.map(item => 
          item.id === itemId ? updatedItem : item
        )
      );

      return updatedItem;
    } catch (err) {
      console.error('Error updating menu item:', err);
      throw err;
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await MenuService.deleteItem(itemId);
      
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error deleting menu item:', err);
      throw err;
    }
  };

  const getItemsByCategory = (categoryId: string) => {
    return items.filter(item => item.category_id === categoryId);
  };

  const getAvailableItems = () => {
    return items.filter(item => item.is_available);
  };

  const getPopularItems = () => {
    return items.filter(item => item.is_popular && item.is_available);
  };

  return {
    categories,
    items,
    isLoading,
    error,
    createCategory,
    createItem,
    updateItem,
    deleteItem,
    getItemsByCategory,
    getAvailableItems,
    getPopularItems,
    refetch: loadMenu
  };
};