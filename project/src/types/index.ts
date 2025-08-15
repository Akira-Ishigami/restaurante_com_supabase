export interface Restaurant {
  id?: string;
  name: string;
  businessType: string;
  address: string;
  phone: string;
  email: string;
  createdAt?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  description?: string;
}

export interface User {
  id?: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'attendant';
  restaurantId?: string;
  createdAt?: string;
}

export interface OnboardingData {
  restaurant: Restaurant;
  categories: MenuCategory[];
  products: Product[];
  whatsapp: {
    number: string;
    welcomeMessage: string;
    autoReply: boolean;
  };
  users: Omit<User, 'id' | 'restaurantId'>[];
}