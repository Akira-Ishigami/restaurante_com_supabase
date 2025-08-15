import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider';
import { useRealTimeOrders } from '../hooks/useRealTimeOrders';
import { useRealTimeCustomers } from '../hooks/useRealTimeCustomers';
import { useRealTimeMenu } from '../hooks/useRealTimeMenu';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { LoadingTransition } from '../components/ui/LoadingTransition';
import { 
  ArrowLeft,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  Users,
  Utensils,
  Edit,
  Trash2,
  Star,
  X,
  TrendingUp,
  GripVertical,
  Truck,
  ChefHat,
  MoreVertical
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { FilterModal } from '../components/ui/FilterModal';
import { Toast, ToastProvider, useToast } from '../components/ui/Toast';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  session?: string;
  isActive: boolean;
  isPopular: boolean;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  ordersToday: number;
  totalToday: number;
  lastOrderTime: string;
}

interface Order {
  id: string;
  customer: string;
  phone: string;
  items: string;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered';
  time: string;
  date: string;
}

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Pizza Margherita',
    description: 'Molho de tomate, mussarela e manjericão fresco',
    price: 35.90,
    duration: 25,
    category: 'Pizzas',
    isActive: true,
    isPopular: true
  },
  {
    id: '2',
    name: 'Hambúrguer Artesanal',
    description: 'Pão brioche, carne 180g, queijo cheddar',
    price: 28.50,
    duration: 20,
    category: 'Lanches',
    isActive: true,
    isPopular: false
  },
  {
    id: '3',
    name: 'Lasanha Bolonhesa',
    description: 'Massa fresca com molho bolonhesa',
    price: 32.90,
    duration: 30,
    category: 'Massas',
    isActive: true,
    isPopular: false
  },
  {
    id: '4',
    name: 'Salmão Grelhado',
    description: 'Salmão fresco com legumes',
    price: 45.90,
    duration: 35,
    category: 'Pratos Principais',
    isActive: true,
    isPopular: false
  }
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Maria Silva',
    phone: '(11) 99999-9999',
    email: 'maria@email.com',
    ordersToday: 2,
    totalToday: 85.50,
    lastOrderTime: '14:30'
  },
  {
    id: '2',
    name: 'Ana Costa',
    phone: '(11) 88888-8888',
    email: 'ana@email.com',
    ordersToday: 1,
    totalToday: 45.00,
    lastOrderTime: '12:15'
  },
  {
    id: '3',
    name: 'Julia Santos',
    phone: '(11) 77777-7777',
    email: 'julia@email.com',
    ordersToday: 3,
    totalToday: 125.90,
    lastOrderTime: '16:45'
  },
  {
    id: '4',
    name: 'Carla Oliveira',
    phone: '(11) 66666-6666',
    email: 'carla@email.com',
    ordersToday: 1,
    totalToday: 32.50,
    lastOrderTime: '11:20'
  }
];

const mockOrders: Order[] = [
  {
    id: '001',
    customer: 'Maria Silva',
    phone: '(11) 99999-9999',
    items: 'Pizza Margherita, Refrigerante',
    total: 55.00,
    status: 'pending',
    time: '09:00',
    date: '12/08/2025'
  },
  {
    id: '002',
    customer: 'Ana Costa',
    phone: '(11) 88888-8888',
    items: 'Hambúrguer Artesanal',
    total: 45.00,
    status: 'preparing',
    time: '14:30',
    date: '12/08/2025'
  },
  {
    id: '003',
    customer: 'João Santos',
    phone: '(11) 77777-7777',
    items: 'Lasanha Bolonhesa, Suco Natural',
    total: 38.90,
    status: 'confirmed',
    time: '15:45',
    date: '12/08/2025'
  },
  {
    id: '004',
    customer: 'Carlos Oliveira',
    phone: '(11) 66666-6666',
    items: 'Salmão Grelhado, Vinho',
    total: 89.90,
    status: 'ready',
    time: '16:20',
    date: '12/08/2025'
  },
  {
    id: '005',
    customer: 'Fernanda Lima',
    phone: '(11) 55555-5555',
    items: 'Açaí Completo',
    total: 18.90,
    status: 'delivering',
    time: '17:00',
    date: '12/08/2025'
  },
  {
    id: '006',
    customer: 'Roberto Santos',
    phone: '(11) 44444-4444',
    items: 'Pizza Calabresa, Refrigerante',
    total: 42.50,
    status: 'delivered',
    time: '12:30',
    date: '12/08/2025'
  }
];

const calendarDays = [
  { day: 13, weekday: 'qua', hasOrders: true, selected: true },
  { day: 14, weekday: 'qui', hasOrders: true, selected: false },
  { day: 15, weekday: 'sex', hasOrders: true, selected: false },
  { day: 16, weekday: 'sáb', hasOrders: false, selected: false },
  { day: 18, weekday: 'seg', hasOrders: false, selected: false },
  { day: 19, weekday: 'ter', hasOrders: false, selected: false },
  { day: 20, weekday: 'qua', hasOrders: false, selected: false },
  { day: 21, weekday: 'qui', hasOrders: false, selected: false },
  { day: 22, weekday: 'sex', hasOrders: false, selected: false },
  { day: 23, weekday: 'sáb', hasOrders: false, selected: false },
  { day: 25, weekday: 'seg', hasOrders: false, selected: false },
  { day: 26, weekday: 'ter', hasOrders: false, selected: false },
  { day: 27, weekday: 'qua', hasOrders: false, selected: false },
  { day: 28, weekday: 'qui', hasOrders: false, selected: false }
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, restaurant } = useAuth();
  const { orders, isLoading: ordersLoading, updateOrderStatus } = useRealTimeOrders(restaurant?.id || null);
  const { customers, isLoading: customersLoading } = useRealTimeCustomers(restaurant?.id || null);
  const { categories, isLoading: menuLoading } = useRealTimeMenu(restaurant?.id || null);
  const { stats, isLoading: statsLoading } = useDashboardStats(restaurant?.id || null);
  
  const [activeTab, setActiveTab] = useState('pedidos');
  const [timeFilter, setTimeFilter] = useState('Hoje');
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isBusinessHoursConfirmOpen, setIsBusinessHoursConfirmOpen] = useState(false);
  const [isBusinessHoursModalOpen, setIsBusinessHoursModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { showToast } = useToast();
  
  const [businessHours, setBusinessHours] = useState({
    monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    saturday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    sunday: { isOpen: false, openTime: '08:00', closeTime: '18:00' }
  });
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    duration: '30',
    category: 'Geral',
    session: '',
    imageFile: null as File | null,
    imageUrl: '',
    isActive: true,
    isPopular: false
  });

  const handleBusinessHoursChange = (day: keyof typeof businessHours, field: string, value: any) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const dashboardStats = [
    {
      title: 'Pedidos',
      subtitle: 'Hoje',
      value: stats.today.orders.toString(),
      icon: Calendar,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Confirmados',
      value: orders.filter(order => order.status === 'confirmed').length.toString(),
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pendentes',
      value: orders.filter(order => order.status === 'pending').length.toString(),
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Receita',
      subtitle: 'Hoje',
      value: `R$ ${stats.today.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      dropdown: true
    }
  ];

  const customerStats = [
    {
      title: 'Total Clientes',
      value: customers.length.toString(),
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pedidos Hoje',
      value: stats.today.orders.toString(),
      icon: Calendar,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Receita Hoje',
      value: `R$ ${stats.today.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Ticket Médio',
      value: `R$ ${stats.today.orders > 0 ? (stats.today.revenue / stats.today.orders).toFixed(2) : '0.00'}`,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  const tabs = [
    { id: 'pedidos', label: 'Pedidos', icon: Calendar },
    { id: 'cardapio', label: 'Cardápio', icon: Utensils },
    { id: 'clientes', label: 'Clientes', icon: Users }
  ];

  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const statusColumns = [
    { 
      id: 'pending', 
      label: 'Pendente', 
      color: '#ef4444', 
      bgColor: '#fef2f2', 
      borderColor: '#fecaca',
      icon: Clock 
    },
    { 
      id: 'confirmed', 
      label: 'Confirmado', 
      color: '#3b82f6', 
      bgColor: '#eff6ff', 
      borderColor: '#bfdbfe',
      icon: CheckCircle 
    },
    { 
      id: 'preparing', 
      label: 'Preparando', 
      color: '#f59e0b', 
      bgColor: '#fffbeb', 
      borderColor: '#fed7aa',
      icon: ChefHat 
    },
    { 
      id: 'ready', 
      label: 'Pronto', 
      color: '#8b5cf6', 
      bgColor: '#f5f3ff', 
      borderColor: '#c4b5fd',
      icon: CheckCircle 
    },
    { 
      id: 'delivering', 
      label: 'Saindo', 
      color: '#f97316', 
      bgColor: '#fff7ed', 
      borderColor: '#fed7aa',
      icon: Truck 
    },
    { 
      id: 'delivered', 
      label: 'Entregue', 
      color: '#10b981', 
      bgColor: '#f0fdf4', 
      borderColor: '#bbf7d0',
      icon: CheckCircle 
    }
  ];

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus as any);

      const statusLabel = statusColumns.find(s => s.id === newStatus)?.label;
    showToast(`Pedido #${orderId} atualizado para ${statusLabel}!`, 'success');
    } catch (error) {
      showToast('Erro ao atualizar pedido', 'error');
    }
  };

  // Drag and Drop handlers
  const [draggedOrder, setDraggedOrder] = useState<any>(null);
  
  const handleDragStart = (e: React.DragEvent, order: any) => {
    setDraggedOrder(order);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedOrder && draggedOrder.status !== newStatus) {
      handleUpdateOrderStatus(draggedOrder.id, newStatus);
    }
    setDraggedOrder(null);
  };

  const OrderCard: React.FC<{ order: any }> = ({ order }) => {
    const currentStatus = statusColumns.find(col => col.id === order.status);
    
    const customerName = order.customers?.name || 'Cliente';
    const customerPhone = order.customers?.phone || '';
    const orderItems = order.order_items?.map((item: any) => item.menu_items?.name).join(', ') || 'Itens do pedido';
    
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, order)}
        className="bg-white rounded-lg border border-gray-200 p-4 mb-3 cursor-move hover:shadow-md transition-all duration-200 group"
        style={{
          opacity: draggedOrder?.id === order.id ? 0.5 : 1
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900 text-sm">#{order.order_number}</span>
            <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString('pt-BR')}</span>
          </div>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
        </div>
        
        <div className="mb-3">
          <div className="font-medium text-gray-900 text-sm mb-1">{customerName}</div>
          <div className="text-xs text-gray-600 mb-2">{customerPhone}</div>
          <div className="text-xs text-gray-700 leading-relaxed">{orderItems}</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="font-semibold text-green-600 text-sm">
            R$ {order.total.toFixed(2)}
          </div>
          <div className="flex items-center">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    );
  };

  const handleCreateItem = () => {
    if (!newItem.name.trim() || !newItem.price) return;
    
    // Mock create item with image
    const itemData = {
      ...newItem,
      image_url: newItem.imageUrl || 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    console.log('Creating new menu item:', itemData);
    setIsNewItemModalOpen(false);
    setNewItem({
      name: '',
      description: '',
      price: '',
      duration: '30',
      category: 'Geral',
      session: '',
      imageFile: null,
      imageUrl: '',
      isActive: true,
      isPopular: false
    });
    showToast('Item adicionado ao cardápio com sucesso!', 'success');
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsEditItemModalOpen(true);
  };

  const handleUpdateItem = () => {
    if (!editingItem || !editingItem.name.trim() || !editingItem.price) return;
    
    // Mock update item
    console.log('Updating menu item:', editingItem);
    setIsEditItemModalOpen(false);
    setEditingItem(null);
    showToast('Item atualizado com sucesso!', 'success');
  };

  const handleDeleteItem = (item: MenuItem) => {
    setItemToDelete(item);
    setIsDeleteConfirmModalOpen(true);
  };

  const confirmDeleteItem = () => {
    if (!itemToDelete) return;
    
    // Mock delete item
    console.log('Deleting menu item:', itemToDelete);
    setIsDeleteConfirmModalOpen(false);
    setItemToDelete(null);
    showToast('Item excluído com sucesso!', 'success');
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    setUploadingImage(true);
    
    try {
      // Mock upload - in real implementation, upload to Supabase Storage
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock URL
      const mockUrl = `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=400`;
      
      setNewItem(prev => ({
        ...prev,
        imageFile: file,
        imageUrl: mockUrl
      }));
      
      showToast('Imagem carregada com sucesso!', 'success');
    } catch (error) {
      showToast('Erro ao carregar imagem', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Applying filters:', filters);
    const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;
    if (activeFiltersCount > 0) {
      showToast(`Filtros aplicados! ${activeFiltersCount} pedidos encontrados.`, 'success');
    } else {
      showToast('Filtros limpos. Mostrando todos os pedidos.', 'info');
    }
  };

  if (ordersLoading || customersLoading || menuLoading || statsLoading) {
    return <LoadingTransition duration={600} />;
  }

  const renderPedidos = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Pedidos</h2>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </button>
          <div className="flex space-x-2">
            {['Hoje', 'Semana', 'Mês'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  timeFilter === filter
                    ? 'bg-red-100 text-red-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-1">Controle de Pedidos - Kanban</h3>
          <p className="text-sm text-gray-600">Arraste os cards entre as colunas para atualizar o status dos pedidos</p>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {statusColumns.map((column) => {
              const columnOrders = orders.filter(order => order.status === column.id);
              const Icon = column.icon;
              
              return (
                <div
                  key={column.id}
                  className={`bg-gray-50 rounded-lg p-3 min-h-[400px] transition-all duration-200 ${
                    dragOverColumn === column.id ? 'ring-2 ring-blue-400 bg-blue-50' : ''
                  }`}
                  onDragOver={(e) => handleDragOver(e, column.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.id)}
                  style={{
                    borderTop: `3px solid ${column.color}`
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        className="h-4 w-4" 
                        style={{ color: column.color }}
                      />
                      <h4 
                        className="font-medium text-sm"
                        style={{ color: column.color }}
                      >
                        {column.label}
                      </h4>
                    </div>
                    <span 
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: column.bgColor,
                        color: column.color 
                      }}
                    >
                      {columnOrders.length}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {columnOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                    
                    {columnOrders.length === 0 && (
                      <div className="text-center py-8">
                        <div 
                          className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                          style={{ backgroundColor: column.bgColor }}
                        >
                          <Icon 
                            className="h-6 w-6" 
                            style={{ color: column.color }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">Nenhum pedido</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Add button for new orders in pending column */}
                  {column.id === 'pending' && (
                    <button className="w-full mt-3 p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm">
                      + Adicionar pedido
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCardapio = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Gerenciar Cardápio</h2>
          <p className="text-sm text-gray-600">{categories.reduce((total, cat) => total + cat.menu_items.length, 0)} itens cadastrados</p>
        </div>
        <Button 
          onClick={() => setIsNewItemModalOpen(true)}
          className="bg-red-700 hover:bg-red-800 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </div>

      <div className="space-y-6">
        {/* Group by category */}
        {categories.map(category => {
          if (category.menu_items.length === 0) return null;

          return (
            <div key={category.id} className="bg-white border rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.menu_items.length} itens</p>
              </div>
              
              <div className="divide-y">
                {category.menu_items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          {item.is_popular && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {item.preparation_time} min
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            R$ {item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => console.log('Edit item:', item)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => console.log('Delete item:', item)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderClientes = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Gerenciar Clientes</h2>
          <p className="text-sm text-gray-600">{customers.length} clientes cadastrados</p>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {customerStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer List */}
      {customers.length === 0 ? (
        <div className="bg-white border rounded-lg p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum cliente cadastrado ainda</p>
        </div>
      ) : (
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Clientes</h3>
        </div>
        
        <div className="divide-y">
          {customers.map((customer) => (
            <div key={customer.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{customer.name}</h4>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                    {customer.email && <p className="text-sm text-blue-600">{customer.email}</p>}
                    {customer.last_order_at && (
                      <p className="text-sm text-gray-500">
                        Último pedido: {new Date(customer.last_order_at).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{customer.total_orders}</p>
                      <p className="text-xs text-gray-500">Total Pedidos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-green-600">R$ {customer.total_spent.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Total Gasto</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );

  return (
    <LoadingTransition duration={600}>
      <>
      <div className="min-h-screen bg-gray-50 page-transition">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
                <p className="text-sm text-gray-600">Sistema de Gestão de Restaurante - Nexla IA</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setIsNewItemModalOpen(true)}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      {stat.subtitle && (
                        <p className="text-sm text-gray-500">{stat.subtitle}</p>
                      )}
                      {stat.dropdown && (
                        <select className="text-sm border-none bg-transparent text-gray-600 focus:outline-none">
                          <option>Hoje</option>
                          <option>Semana</option>
                          <option>Mês</option>
                        </select>
                      )}
                    </div>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-700 text-red-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'pedidos' && renderPedidos()}
            {activeTab === 'cardapio' && renderCardapio()}
            {activeTab === 'clientes' && renderClientes()}
          </div>
        </div>
      </main>

      {/* New Item Modal */}
      <Modal
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        title="Novo Item"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <Input
              label="Nome do Item *"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Ex: Pizza Margherita"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descrição do item..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Preço (R$) *"
                type="number"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempo de Preparo (min) *
              </label>
              <select
                value={newItem.duration}
                onChange={(e) => setNewItem({ ...newItem, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="15">15 min</option>
                <option value="20">20 min</option>
                <option value="25">25 min</option>
                <option value="30">30 min</option>
                <option value="35">35 min</option>
                <option value="40">40 min</option>
                <option value="45">45 min</option>
              </select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto do Produto
            </label>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    ) : (
                      <>
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG ou JPEG (MAX. 5MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    disabled={uploadingImage}
                  />
                </label>
              </div>
              
              {newItem.imageUrl && (
                <div className="relative">
                  <img
                    src={newItem.imageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setNewItem(prev => ({ ...prev, imageUrl: '', imageFile: null }))}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Geral">Geral</option>
                <option value="Pizzas">Pizzas</option>
                <option value="Lanches">Lanches</option>
                <option value="Massas">Massas</option>
                <option value="Pratos Principais">Pratos Principais</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Sobremesas">Sobremesas</option>
              </select>
            </div>
            <div>
              <Input
                label="Sessão"
                value={newItem.session}
                onChange={(e) => setNewItem({ ...newItem, session: e.target.value })}
                placeholder="Ex: Almoço, Jantar"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newItem.isActive}
                onChange={(e) => setNewItem({ ...newItem, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
              />
              <span className="text-sm text-gray-700">Item ativo</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newItem.isPopular}
                onChange={(e) => setNewItem({ ...newItem, isPopular: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
              />
              <span className="text-sm text-gray-700">Item popular</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              variant="outline"
              onClick={() => setIsNewItemModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateItem}
              className="bg-red-700 hover:bg-red-800 text-white"
              disabled={!newItem.name.trim() || !newItem.price}
            >
              Criar Item
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={isEditItemModalOpen}
        onClose={() => {
          setIsEditItemModalOpen(false);
          setEditingItem(null);
        }}
        title="Editar Item"
        size="lg"
      >
        {editingItem && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Item *
              </label>
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Pizza Margherita"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descrição do item..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duração (min) *
                </label>
                <select
                  value={editingItem.duration}
                  onChange={(e) => setEditingItem({ ...editingItem, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={15}>15 min</option>
                  <option value={20}>20 min</option>
                  <option value={25}>25 min</option>
                  <option value={30}>30 min</option>
                  <option value={35}>35 min</option>
                  <option value={40}>40 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>1 hora</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Geral">Geral</option>
                  <option value="Pizzas">Pizzas</option>
                  <option value="Lanches">Lanches</option>
                  <option value="Massas">Massas</option>
                  <option value="Pratos Principais">Pratos Principais</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Sobremesas">Sobremesas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sessão
                </label>
                <input
                  type="text"
                  value={editingItem.session || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, session: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Almoço, Jantar"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingItem.isActive}
                  onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                />
                <span className="text-sm text-gray-700">Item ativo</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingItem.isPopular}
                  onChange={(e) => setEditingItem({ ...editingItem, isPopular: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                />
                <span className="text-sm text-gray-700">Item popular</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditItemModalOpen(false);
                  setEditingItem(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpdateItem}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!editingItem.name.trim() || !editingItem.price}
              >
                Salvar Alterações
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => {
          setIsDeleteConfirmModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteItem}
        title="Excluir Item do Cardápio"
        message={itemToDelete ? `Tem certeza que deseja excluir o item "${itemToDelete.name}"? Esta ação não pode ser desfeita.` : ''}
        confirmText="Excluir Item"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Business Hours Modal */}
      <Modal
        isOpen={isBusinessHoursModalOpen}
        onClose={() => setIsBusinessHoursModalOpen(false)}
        title="Horários de Funcionamento"
        size="lg"
      >
        <div className="space-y-6">
          {Object.entries(businessHours).map(([dayKey, dayData]) => {
            const dayNames = {
              monday: 'Segunda-feira',
              tuesday: 'Terça-feira',
              wednesday: 'Quarta-feira',
              thursday: 'Quinta-feira',
              friday: 'Sexta-feira',
              saturday: 'Sábado',
              sunday: 'Domingo'
            };
            
            return (
              <div key={dayKey} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium text-gray-900">
                    {dayNames[dayKey as keyof typeof dayNames]}
                  </h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={dayData.isOpen}
                      onChange={(e) => handleBusinessHoursChange(dayKey as keyof typeof businessHours, 'isOpen', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                    />
                    <span className="text-sm text-blue-600 font-medium">Aberto</span>
                  </label>
                </div>
                
                {dayData.isOpen && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Abertura
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={dayData.openTime}
                          onChange={(e) => handleBusinessHoursChange(dayKey as keyof typeof businessHours, 'openTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fechamento
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={dayData.closeTime}
                          onChange={(e) => handleBusinessHoursChange(dayKey as keyof typeof businessHours, 'closeTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => console.log('Save business hours')}
            >
              Salvar Horários
            </Button>
          </div>
        </div>
      </Modal>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      </div>
    </>
    </LoadingTransition>
  );
};

// Wrap the component with ToastProvider
const AdminDashboardWithToast: React.FC = () => {
  return (
    <ToastProvider>
      <AdminDashboard />
    </ToastProvider>
  );
};

export { AdminDashboardWithToast as AdminDashboard };