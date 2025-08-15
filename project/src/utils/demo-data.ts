import { Restaurant, User, MenuCategory, Product } from '../types';

export const demoRestaurant: Restaurant = {
  id: 'demo-restaurant-1',
  name: 'Restaurante Demo',
  businessType: 'restaurant',
  address: 'Rua Demo, 123, Centro, São Paulo - SP',
  phone: '(11) 99999-9999',
  email: 'contato@restaurantedemo.com.br',
  createdAt: new Date().toISOString()
};

export const demoUser: User = {
  id: 'demo-user-1',
  email: 'admin@demo.com',
  name: 'Administrador Demo',
  role: 'admin',
  restaurantId: 'demo-restaurant-1',
  createdAt: new Date().toISOString()
};

export const demoCategories: MenuCategory[] = [
  { id: 'cat-1', name: 'Pratos Principais', description: 'Nossos pratos principais' },
  { id: 'cat-2', name: 'Bebidas', description: 'Bebidas variadas' },
  { id: 'cat-3', name: 'Sobremesas', description: 'Doces e sobremesas' }
];

export const demoProducts: Product[] = [
  { id: 'prod-1', categoryId: 'cat-1', name: 'Prato Feito', price: 25.90, description: 'Arroz, feijão, carne e salada' },
  { id: 'prod-2', categoryId: 'cat-1', name: 'Pizza Margherita', price: 35.00, description: 'Molho de tomate, mussarela e manjericão' },
  { id: 'prod-3', categoryId: 'cat-2', name: 'Refrigerante', price: 5.50, description: 'Coca-Cola, Pepsi ou Guaraná' },
  { id: 'prod-4', categoryId: 'cat-3', name: 'Pudim', price: 8.90, description: 'Pudim de leite condensado' }
];

export const businessTypes = [
  { value: 'restaurant', label: 'Restaurante' },
  { value: 'lanchonete', label: 'Lanchonete' },
  { value: 'pizzaria', label: 'Pizzaria' },
  { value: 'hamburgueria', label: 'Hamburgueria' },
  { value: 'cafeteria', label: 'Cafeteria' },
  { value: 'padaria', label: 'Padaria' },
  { value: 'sorveteria', label: 'Sorveteria' },
  { value: 'outros', label: 'Outros' }
];

export const userRoles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'manager', label: 'Gerente' },
  { value: 'attendant', label: 'Atendente' }
];