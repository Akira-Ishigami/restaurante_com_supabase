import React from 'react';
import { Check, MapPin, CreditCard, Phone, User, Clock } from 'lucide-react';

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

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface OrderSummaryStepProps {
  customerData: CustomerData;
  cart: CartItem[];
  total: number;
}

export const OrderSummaryStep: React.FC<OrderSummaryStepProps> = ({
  customerData,
  cart,
  total
}) => {
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-green-100 to-green-200 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Confirme seu pedido
        </h3>
        <p className="text-gray-600">
          Revise todas as informações antes de finalizar
        </p>
      </div>

      {/* Resumo do Cliente */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <User className="h-5 w-5 mr-2 text-red-600" />
          Dados do Cliente
        </h4>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Nome:</span> {customerData.name}</p>
          <p><span className="font-medium">Telefone:</span> {customerData.phone}</p>
        </div>
      </div>

      {/* Endereço de Entrega */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-red-600" />
          Endereço de Entrega
        </h4>
        <div className="text-sm text-gray-700">
          <p>{customerData.address}, {customerData.number}</p>
          {customerData.complement && <p>{customerData.complement}</p>}
          <p>{customerData.neighborhood} - {customerData.city}/{customerData.state}</p>
          <p>CEP: {customerData.cep}</p>
        </div>
      </div>

      {/* Forma de Pagamento */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-red-600" />
          Forma de Pagamento
        </h4>
        <div className="text-sm text-gray-700">
          <p>{getPaymentMethodLabel()}</p>
          {customerData.paymentMethod === 'pix' && customerData.pixTiming === 'now' && (
            <p className="text-green-600 mt-1">
              Você receberá o QR Code via WhatsApp para pagamento imediato
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
              <br />
              <span className="font-medium">
                Troco: {formatCurrency(parseFloat(customerData.changeAmount) - total)}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Itens do Pedido */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Seus Itens</h4>
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
                <p className="text-xs text-gray-500">
                  {formatCurrency(item.price)} cada
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total do Pedido */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total:</span>
          <span className="text-xl font-bold text-red-600">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Tempo Estimado */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-blue-600 mr-2" />
          <div>
            <p className="font-medium text-blue-900">Tempo estimado de entrega</p>
            <p className="text-sm text-blue-700">45-60 minutos</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Importante:</strong> Ao finalizar o pedido, você receberá uma confirmação via WhatsApp 
          com todas as informações e atualizações sobre o preparo e entrega.
        </p>
      </div>
    </div>
  );
};