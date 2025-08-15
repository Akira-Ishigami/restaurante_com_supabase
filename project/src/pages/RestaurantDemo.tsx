import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealTimeMenu } from '../hooks/useRealTimeMenu';
import { isDemoMode } from '../lib/supabase';
import { LoadingTransition } from '../components/ui/LoadingTransition';
import { CheckoutWizard } from '../components/checkout/CheckoutWizard';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Star, 
  Clock, 
  MapPin, 
  Phone,
  User,
  X,
  Check,
  Home,
  Award,
  Users,
  Heart,
  ChefHat,
  Utensils,
  Car,
  Bus,
  Navigation,
  Mail,
  Instagram
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
  time: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Pizza Margherita',
    description: 'Molho de tomate, mussarela, manjericão fresco e azeite',
    price: 35.90,
    category: 'Pizzas',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    popular: true,
    time: '25min'
  },
  {
    id: '2',
    name: 'Hambúrguer Artesanal',
    description: 'Pão brioche, carne 180g, queijo cheddar, alface e tomate',
    price: 28.50,
    category: 'Lanches',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
    popular: true,
    time: '20min'
  },
  {
    id: '3',
    name: 'Lasanha Bolonhesa',
    description: 'Massa fresca, molho bolonhesa, queijo e molho branco',
    price: 32.90,
    category: 'Massas',
    image: 'https://images.pexels.com/photos/4079520/pexels-photo-4079520.jpeg?auto=compress&cs=tinysrgb&w=400',
    time: '30min'
  },
  {
    id: '4',
    name: 'Salmão Grelhado',
    description: 'Salmão fresco grelhado com legumes e arroz integral',
    price: 45.90,
    category: 'Pratos Principais',
    image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400',
    time: '35min'
  },
  {
    id: '5',
    name: 'Açaí Completo',
    description: 'Açaí cremoso com granola, banana, morango e mel',
    price: 18.90,
    category: 'Sobremesas',
    image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
    popular: true,
    time: '10min'
  },
  {
    id: '6',
    name: 'Refrigerante',
    description: 'Coca-Cola, Pepsi, Guaraná ou Fanta - 350ml',
    price: 6.50,
    category: 'Bebidas',
    image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400',
    time: '2min'
  }
];


const categories = ['Todos', 'Pizzas', 'Lanches', 'Massas', 'Pratos Principais', 'Sobremesas', 'Bebidas'];

export const RestaurantDemo: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>('demo-restaurant-1');
  const navigate = useNavigate();

  // Get menu data from database or use demo data
  const { categories: dbCategories, isLoading } = useRealTimeMenu(restaurantId);
  
  // Convert database format to component format
  const menuItemsFromDB = dbCategories.flatMap(category =>
    category.menu_items.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: category.name,
      image: item.image_url || 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
      popular: item.is_popular,
      time: `${item.preparation_time}min`
    }))
  );
  
  // Use database data if available, otherwise use demo data
  const currentMenuItems = menuItemsFromDB.length > 0 ? menuItemsFromDB : menuItems;
  const currentCategories = menuItemsFromDB.length > 0 
    ? ['Todos', ...Array.from(new Set(menuItemsFromDB.map(item => item.category)))]
    : categories;

  const filteredItems = selectedCategory === 'Todos' 
    ? currentMenuItems 
    : currentMenuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    // In a real implementation, this would use the actual menu item data
    console.log('🛒 Adding item to cart:', item);
    
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prevCart.filter(cartItem => cartItem.id !== itemId);
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalTime = () => {
    if (cart.length === 0) return '0min';
    
    // Separa itens por categoria para calcular tempo de forma mais inteligente
    const beverageItems = cart.filter(item => item.category === 'Bebidas');
    const foodItems = cart.filter(item => item.category !== 'Bebidas');
    
    // Se só tem bebidas, tempo é muito rápido
    if (foodItems.length === 0) {
      return beverageItems.length > 0 ? '3min' : '0min';
    }
    
    // Para itens de comida, pega o maior tempo (pois são preparados em paralelo)
    // e adiciona tempo extra baseado na quantidade total
    const maxFoodTime = Math.max(...foodItems.map(item => parseInt(item.time)));
    const totalFoodQuantity = foodItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Adiciona 2 minutos para cada item extra além do primeiro
    const extraTime = Math.max(0, (totalFoodQuantity - 1) * 2);
    const estimatedTime = maxFoodTime + extraTime;
    
    // Bebidas não afetam o tempo total pois são preparadas rapidamente
    return `${estimatedTime}min`;
  };

  const handleOrder = () => {
    navigate('/checkout', { state: { cart } });
  };

  const handleOrderComplete = () => {
    alert('🎉 Pedido realizado com sucesso!\n\nVocê receberá uma confirmação via WhatsApp em breve.');
    setCart([]);
  };

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu-section');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoading) {
    return <LoadingTransition duration={1000} />;
  }

  return (
    <LoadingTransition duration={600}>
      <div className="min-h-screen bg-gray-50 page-transition">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Restaurante Demo</h1>
                <p className="text-sm text-gray-600">Comida Italiana</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  (11) 99999-9999
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Vila Bela - São Paulo, SP
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => navigate('/admin')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  ADM
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Início
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Check className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">
              DEMONSTRAÇÃO: Este é um exemplo de como seu site ficará após a personalização. Todos os dados são fictícios para fins demonstrativos.
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">4.9/5 - Mais de 500 clientes satisfeitos</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Sabores autênticos nas mãos de{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-orange-600">
                  especialistas. Peça online!
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Escolha o prato, confirma os ingredientes e garanta sua refeição sem sair de casa.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={scrollToMenu}
                  className="bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white px-8 py-3 text-lg"
                >
                  🍕 Pedir Agora
                </Button>
              </div>
            </div>

            {/* Menu Section */}
            <div id="menu-section" className="scroll-mt-24">
              {/* Categories */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2 justify-center">
                  {currentCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'Todos' ? 'Nosso Cardápio' : selectedCategory}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                      <div className="relative">
                        {item.popular && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 text-xs font-bold rounded-full flex items-center">
                              ⭐ Popular
                            </span>
                          </div>
                        )}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      
                      <div className="p-6">
                        <div className="mb-3">
                          <h3 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-green-600 font-bold text-xl">
                              R$ {item.price.toFixed(2)}
                            </span>
                            <div className="flex items-center text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-full">
                              <Clock className="h-4 w-4 mr-1" />
                              {item.time}
                            </div>
                          </div>
                          {(() => {
                            const isInCart = cart.some(cartItem => cartItem.id === item.id);
                            return (
                          <Button
                            onClick={() => addToCart(item)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 border-2 ${
                              isInCart 
                                ? 'bg-red-600 text-white border-red-600' 
                                : 'bg-white text-black border-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600'
                            }`}
                          >
                            {isInCart ? 'Selecionado' : 'Selecionar'}
                          </Button>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 card-hover">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-red-600" />
                  Itens Selecionados
                  {getTotalItems() > 0 && (
                    <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                      {getTotalItems()}
                    </span>
                  )}
                </h3>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum item selecionado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-green-600 font-semibold">R$ {item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Total:</span>
                      <span className="text-green-600 font-bold text-xl">
                        R$ {getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">Tempo estimado:</span>
                      <span className="text-sm font-medium">{getTotalTime()}</span>
                    </div>
                    
                    <Button
                      onClick={handleOrder}
                      className="w-full bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white py-3"
                    >
                      🛒 Finalizar Pedido
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* About Section - Redesigned */}
        <div className="mt-20 bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Side - Content */}
            <div className="p-8 lg:p-12">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-2xl mr-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Nossa História</h2>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Há mais de <strong>10 anos</strong>, o <strong>Restaurante Demo</strong> nasceu do sonho 
                de criar um espaço onde cada cliente se sinta especial e único. Localizada no coração da Vila Bela, 
                nos tornamos referência em cuidados culinários e bem-estar gastronômico.
              </p>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Com uma equipe de chefs altamente qualificados e apaixonados pelo que fazem, oferecemos pratos 
                personalizados que realçam os sabores autênticos da Itália com um toque brasileiro especial.
              </p>

              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-2xl text-white">
                <div className="flex items-center mb-3">
                  <Award className="h-6 w-6 mr-3" />
                  <h3 className="text-lg font-bold">Nossa Missão</h3>
                </div>
                <p className="text-white/90">
                  Proporcionar experiências únicas de sabor e bem-estar, 
                  utilizando técnicas modernas e produtos de qualidade, sempre 
                  com atendimento humanizado e personalizado.
                </p>
              </div>
            </div>

            {/* Right Side - Images */}
            <div className="bg-gray-50 p-8 lg:p-12">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl mr-4">
                  <Utensils className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Nosso Ambiente</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img 
                    src="https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt="Interior do restaurante" 
                    className="w-full h-32 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  />
                  <img 
                    src="https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt="Mesa elegante" 
                    className="w-full h-40 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  />
                </div>
                <div className="space-y-4">
                  <img 
                    src="https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt="Cozinha profissional" 
                    className="w-full h-40 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  />
                  <img 
                    src="https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt="Área de relaxamento" 
                    className="w-full h-32 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 lg:px-12 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-4xl font-bold text-red-600 mb-2">500+</div>
                <div className="text-gray-600 text-sm font-medium">Clientes Satisfeitos</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-4xl font-bold text-orange-600 mb-2">10+</div>
                <div className="text-gray-600 text-sm font-medium">Anos de Experiência</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-4xl font-bold text-red-600 mb-2">50+</div>
                <div className="text-gray-600 text-sm font-medium">Pratos no Cardápio</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-4xl font-bold text-orange-600 mb-2">4.9★</div>
                <div className="text-gray-600 text-sm font-medium">Avaliação Média</div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Section - Redesigned */}
        <div className="mt-20 bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-2xl mr-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Nossa Localização</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Side - Info Cards */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl border border-red-100">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-xl">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Endereço</h4>
                      <p className="text-gray-700 font-medium">Rua das Flores, 123 - Vila Bela</p>
                      <p className="text-gray-600">São Paulo, SP - CEP: 01234-567</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
                      <Car className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Estacionamento</h4>
                      <p className="text-gray-700">Vagas gratuitas na frente do estabelecimento</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                      <Bus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Transporte Público</h4>
                      <p className="text-gray-700">Ponto de ônibus a 50m - Linhas 123, 456, 789</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Contato</h4>
                      <p className="text-gray-700 font-medium">(11) 99999-9999</p>
                      <p className="text-gray-600">contato@restaurantedemo.com</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-2xl border border-yellow-200">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-3 rounded-xl">
                      <Navigation className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Dica</h4>
                      <p className="text-gray-700">Estamos bem próximos ao Shopping Vila Bela e ao Mercado Central</p>
                      <p className="text-gray-600 text-sm mt-2">📞 Ligue para (11) 99999-9999 se tiver dúvidas sobre como chegar</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Map */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 rounded-2xl h-96 flex items-center justify-center relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    🛍️ Shopping
                  </div>
                  
                  <div className="absolute bottom-20 left-6 bg-white p-4 rounded-2xl shadow-lg border-2 border-red-200">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-2 mx-auto">
                      <span className="text-white text-sm">📍</span>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-red-600 text-sm">Restaurante Demo</p>
                      <p className="text-xs text-gray-600">Rua das Flores, 123</p>
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-6 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    🏪 Mercado
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                      <MapPin className="h-16 w-16 mx-auto mb-4 text-gradient-to-r from-red-500 to-orange-500" />
                      <p className="font-bold text-gray-900 text-lg">Mapa Interativo</p>
                      <p className="text-gray-600">Vila Bela - São Paulo</p>
                      <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                        📍 Abrir no Google Maps
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Left side - Company Info */}
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-r from-red-700 to-orange-600 flex-shrink-0">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">NEXLA</h3>
                <p className="text-gray-400 text-sm">Inteligência Artificial para Negócios</p>
                <p className="text-gray-400 text-sm mt-2">
                  Automatizamos seu negócio com tecnologia
                  de ponta e inteligência artificial
                </p>
              </div>
            </div>

            {/* Center - Contact Info */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-red-400" />
                  <span className="text-gray-400 text-sm">+55 69 99930-0101</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-red-400" />
                  <span className="text-gray-400 text-sm">nexla@nexla.com.br</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Instagram className="h-4 w-4 text-red-400" />
                  <span className="text-gray-400 text-sm">@nexla_ia</span>
                </div>
              </div>
            </div>

            {/* Right side - Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Links Rápidos</h4>
              <div className="space-y-2">
                <div>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block">
                    Ver Demonstração
                  </a>
                </div>
                <div>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block">
                    Falar no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-6 text-center">
            <p className="text-gray-400">
              © 2024 NEXLA - Inteligência Artificial para Negócios. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      </div>
    </LoadingTransition>
  );
};