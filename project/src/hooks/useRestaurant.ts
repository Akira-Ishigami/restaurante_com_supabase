import { useState, useEffect } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import { RestaurantService } from '../services/restaurantService';
import { Database } from '../lib/database.types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

export const useRestaurant = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setRestaurant(null);
      setIsLoading(false);
      return;
    }

    loadRestaurant();
  }, [user]);

  const loadRestaurant = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const restaurantData = await RestaurantService.getByUserId(user.id);
      setRestaurant(restaurantData);
    } catch (err) {
      console.error('Error loading restaurant:', err);
      setError(err instanceof Error ? err.message : 'Failed to load restaurant');
    } finally {
      setIsLoading(false);
    }
  };

  const createRestaurant = async (restaurantData: {
    name: string;
    business_type: string;
    address: string;
    phone: string;
    email: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setIsLoading(true);
      setError(null);

      const newRestaurant = await RestaurantService.create({
        user_id: user.id,
        ...restaurantData
      });

      setRestaurant(newRestaurant);
      return newRestaurant;
    } catch (err) {
      console.error('Error creating restaurant:', err);
      setError(err instanceof Error ? err.message : 'Failed to create restaurant');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRestaurant = async (updates: Partial<Restaurant>) => {
    if (!restaurant) throw new Error('No restaurant to update');

    try {
      setIsLoading(true);
      setError(null);

      const updatedRestaurant = await RestaurantService.update(restaurant.id, updates);
      setRestaurant(updatedRestaurant);
      return updatedRestaurant;
    } catch (err) {
      console.error('Error updating restaurant:', err);
      setError(err instanceof Error ? err.message : 'Failed to update restaurant');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    restaurant,
    isLoading,
    error,
    hasRestaurant: !!restaurant,
    createRestaurant,
    updateRestaurant,
    refetch: loadRestaurant
  };
};