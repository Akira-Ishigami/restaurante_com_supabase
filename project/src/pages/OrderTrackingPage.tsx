import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PublicOrderService } from '../services/publicOrderService';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Truck, 
  MapPin, 
  Phone, 
  User,
  CreditCard,
  RefreshCw,
  MessageCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { LoadingTransition } from '../components/ui/LoadingTransition';

interface OrderStatus {
  id: string;
  status: 'received' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered';
  timestamp: string;
  message: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface CustomerData {
  name: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  paymentMethod: 'pix' | 'money' | 'card' | '';
  needsChange: boolean;
  changeAmount: string;
  phone: string;
  pixTiming: 'now' | 'pickup' | '';
}

const statusSteps = [
  { 
    id: 'received', 
    label: 'Pedido Recebido', 
    icon: CheckCircle, 
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  { 
    id: 'confirmed', 
    label: 'Confirmado', 
    icon: CheckCircle, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  { 
    id: 'preparing', 
    label: 'Preparando', 
    icon: Clock, 
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  { 
    id: 'ready', 
    label: 'Pronto', 
    icon: CheckCircle, 
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  { 
    id: 'delivering', 
    label: 'Saiu para Entrega', 
    icon: Truck, 
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  { 
    id: 'delivered', 
    label: 'Entregue', 
    icon: CheckCircle, 
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  }
];

export const OrderTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const orderId = location.state?.orderId || 'PED-123456';
  const customerData: CustomerData = location.state?.customerData || {};
  const cart: CartItem[] = location.state?.cart || [];
  const total: number = location.state?.total || 0;

  const [currentStatus, setCurrentStatus] = useState<string>('received');
  const [orderHistory, setOrderHistory] = useState<OrderStatus[]>([
    {
      id: '1',
      status: 'received',
      status: 'received',
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      message: 'Seu pedido foi recebido e está sendo processado'
    }
  ]);
  const [estimatedTime, setEstimatedTime] = useState(45);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load order data if orderId is provided
  useEffect(() => {
    const loadOrderData = async () => {
      if (orderId && orderId.startsWith('PED-')) {
        try {
          const orderData = await PublicOrderService.getOrderByNumber(orderId);
          if (orderData) {
            console.log('📦 Dados do pedido carregados:', orderData);
            // Update order status based on real data
            setCurrentStatus(orderData.status);
          }
        } catch (error) {
          console.error('Erro ao carregar dados do pedido:', error);
        }
      }
    };

    loadOrderData();
  }, [orderId]);

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular progressão do status
      const statusOrder = ['received', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered'];
      const currentIndex = statusOrder.indexOf(currentStatus);
      
      if (currentIndex < statusOrder.length - 1) {
        const nextStatus = statusOrder[currentIndex + 1];
        const statusMessages = {
          confirmed: 'Pedido confirmado! Iniciando o preparo',
          preparing: 'Seu pedido está sendo preparado com carinho',
          ready: 'Pedido pronto! Saindo para entrega',
          delivering: 'Pedido a caminho! Entregador: João (11) 99999-9999',
          delivered: 'Pedido entregue com sucesso! Obrigado pela preferência'
        };

        setCurrentStatus(nextStatus);
        setOrderHistory(prev => [...prev, {
          id: Date.now().toString(),
          status: nextStatus as any,
          timestamp: new Date().toLocaleTimeString('pt-BR'),
          message: statusMessages[nextStatus as keyof typeof statusMessages] || 'Status atualizado'
        }]);

        // Reduzir tempo estimado
        setEstimatedTime(prev => Math.max(0, prev - 8));
      }
    }, 15000); // Atualizar a cada 15 segundos para demo

    return () => clearInterval(interval);
  }, [currentStatus]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPaymentMethodLabel = () => {
    const methods = {
      pix: `PIX ${customerData.pixTiming === 'now' ? '(pagamento imediato)' : '(pagamento na retirada)'}`,
      card: 'Cartão (na entrega)',
      money: 'Dinheiro (na entrega)'
    };
    return methods[customerData.paymentMethod] || '';
  };

  const getCurrentStatusIndex = () => {
    return statusSteps.findIndex(step => step.id === currentStatus);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleWhatsAppContact = () => {
    const message = `Olá! Gostaria de saber sobre meu pedido ${orderId}`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!location.state) {
    return (
      <LoadingTransition>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Pedido não encontrado</h2>
            <p className="text-gray-600 mb-4">Não foi possível encontrar as informações do pedido</p>
            <Button onClick={() => navigate('/login')}>
              Voltar ao Cardápio
            </Button>
          </div>
        </div>
      </LoadingTransition>
    );
  }

  return (
    <LoadingTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-orange-600 text-white p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate('/login')}
                className="text-white hover:text-red-100 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              
              <h1 className="text-xl font-bold">Acompanhar Pedido</h1>
              
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-white hover:text-red-100 transition-colors"
              >
                <RefreshCw className={`h-6 w-6 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-red-100 text-sm">Pedido #{orderId}</p>
              <p className="text-white font-semibold">
                {estimatedTime > 0 ? `Tempo estimado: ${estimatedTime} min` : 'Pedido entregue!'}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Status Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Status do Pedido</h2>
            
            <div className="relative">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= getCurrentStatusIndex();
                const isCurrent = step.id === currentStatus;
                
                return (
                  <div key={step.id} className="flex items-center mb-6 last:mb-0">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      isCompleted ? step.bgColor : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        isCompleted ? step.color : 'text-gray-400'
                      }`} />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className={`font-semibold ${
                        isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </h3>
                      {isCurrent && (
                        <p className="text-sm text-blue-600 font-medium">
                          Status atual
                        </p>
                      )}
                    </div>
                    
                    {isCompleted && (
                      <div className="text-sm text-gray-500">
                        {orderHistory.find(h => h.status === step.id)?.timestamp}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-red-600" />
                Dados do Cliente
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Nome:</span> {customerData.name}</p>
                <p><span className="font-medium">Telefone:</span> {customerData.phone}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-red-600" />
                Endereço de Entrega
              </h3>
              <div className="text-sm text-gray-700">
                <p>{customerData.address}, {customerData.number}</p>
                {customerData.complement && <p>{customerData.complement}</p>}
                <p>{customerData.neighborhood} - {customerData.city}/{customerData.state}</p>
                <p>CEP: {customerData.cep}</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-red-600" />
              Forma de Pagamento
            </h3>
            <div className="text-sm text-gray-700">
              <p>{getPaymentMethodLabel()}</p>
              {customerData.paymentMethod === 'pix' && customerData.pixTiming === 'now' && (
                <p className="text-green-600 mt-1">
                  QR Code enviado via WhatsApp para pagamento
                </p>
              )}
              {customerData.paymentMethod === 'pix' && customerData.pixTiming === 'pickup' && (
                <p className="text-blue-600 mt-1">
                  Pagamento será feito no momento da retirada/entrega
                </p>
              )}
              {customerData.paymentMethod === 'money' && customerData.needsChange && (
                <p className="text-green-600 mt-1">
                  Troco para: {formatCurrency(parseFloat(customerData.changeAmount))}
                </p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Itens do Pedido</h3>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-red-600">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Histórico do Pedido</h3>
            <div className="space-y-3">
              {orderHistory.slice().reverse().map((history) => (
                <div key={history.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{history.message}</p>
                    <p className="text-xs text-gray-500">{history.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-green-900 mb-2">Precisa de Ajuda?</h3>
                <p className="text-green-700 text-sm">
                  Entre em contato conosco pelo WhatsApp para tirar dúvidas sobre seu pedido
                </p>
              </div>
              <Button
                onClick={handleWhatsAppContact}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </LoadingTransition>
  );
};