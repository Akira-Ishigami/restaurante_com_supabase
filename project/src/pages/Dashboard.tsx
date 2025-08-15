import React from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useRealTimeOrders } from '../hooks/useRealTimeOrders';
import { Button } from '../components/ui/Button';
import { LoadingTransition } from '../components/ui/LoadingTransition';
import { 
  Store, 
  Users, 
  ShoppingCart, 
  MessageCircle, 
  TrendingUp, 
  Calendar,
  LogOut
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, restaurant, signOut, isDemoMode } = useAuth();
  const { stats, isLoading: statsLoading } = useDashboardStats(restaurant?.id || null);
  const { orders, isLoading: ordersLoading } = useRealTimeOrders(restaurant?.id || null);

  const handleSignOut = async () => {
    await signOut();
  };

  const dashboardStatsData = [
    { label: 'Pedidos Hoje', value: statsLoading ? '...' : stats.today.orders.toString(), icon: ShoppingCart, color: 'text-blue-600' },
    { label: 'Receita Hoje', value: statsLoading ? '...' : `R$ ${stats.today.revenue.toFixed(2)}`, icon: TrendingUp, color: 'text-green-600' },
    { label: 'WhatsApp Ativo', value: '✓', icon: MessageCircle, color: 'text-green-600' },
    { label: 'Clientes', value: statsLoading ? '...' : stats.today.customers.toString(), icon: Users, color: 'text-purple-600' },
  ];

  return (
    <LoadingTransition duration={600}>
      <div className="min-h-screen bg-gray-50 page-transition">
        <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {restaurant?.name || 'RestauranteGestão'}
                </h1>
                <p className="text-sm text-gray-600">
                  Bem-vindo, {user?.name}
                  {isDemoMode && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Demo</span>}
                </p>
              </div>
            </div>
            
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStatsData.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Pedidos Recentes
            </h3>
            <div className="space-y-3">
              {ordersLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.order_number} - {order.customers?.name || 'Cliente'}
                    </p>
                    <p className="text-sm text-gray-600">R$ {order.total_amount.toFixed(2)}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status === 'pending' ? 'Pendente' :
                     order.status === 'confirmed' ? 'Confirmado' :
                     order.status === 'preparing' ? 'Preparando' :
                     order.status === 'ready' ? 'Pronto' :
                     order.status === 'delivering' ? 'Entregando' :
                     order.status === 'delivered' ? 'Entregue' : 'Cancelado'}
                  </span>
                </div>
              ))}
              {!ordersLoading && orders.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p>Nenhum pedido encontrado</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações do Restaurante
            </h3>
            {restaurant && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-medium text-gray-900">{restaurant.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-medium text-gray-900 capitalize">{restaurant.businessType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Endereço</p>
                  <p className="font-medium text-gray-900">{restaurant.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contato</p>
                  <p className="font-medium text-gray-900">{restaurant.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {isDemoMode && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">🚀 Modo Demo Ativo</h3>
            <p className="text-blue-800 mb-4">
              Este é um ambiente de demonstração. Os dados exibidos são fictícios para fins de apresentação.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-900 mb-1">Recursos Demonstrados:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Sistema de autenticação</li>
                  <li>Onboarding completo</li>
                  <li>Dashboard responsivo</li>
                  <li>Integração com Supabase</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-blue-900 mb-1">Próximas Funcionalidades:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Gestão completa de pedidos</li>
                  <li>Controle de estoque</li>
                  <li>Relatórios e analytics</li>
                  <li>WhatsApp Business real</li>
                </ul>
              </div>
            </div>
          </div>
          )}
        </main>
      </div>
    </LoadingTransition>
  );
};