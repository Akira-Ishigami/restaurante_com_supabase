import React from 'react';
import { CreditCard, Smartphone, Banknote, DollarSign } from 'lucide-react';
import { Input } from '../../ui/Input';

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

interface PaymentStepProps {
  data: CustomerData;
  onChange: (data: CustomerData) => void;
  total: number;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({ data, onChange, total }) => {
  const paymentMethods = [
    {
      id: 'pix' as const,
      name: 'PIX',
      description: 'Pagamento instantâneo',
      icon: Smartphone,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700'
    },
    {
      id: 'card' as const,
      name: 'Cartão',
      description: 'Débito ou crédito na entrega',
      icon: CreditCard,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    },
    {
      id: 'money' as const,
      name: 'Dinheiro',
      description: 'Pagamento na entrega',
      icon: Banknote,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700'
    }
  ];

  const handlePaymentMethodChange = (method: 'pix' | 'money' | 'card') => {
    onChange({
      ...data,
      paymentMethod: method,
      needsChange: false,
      changeAmount: '',
      pixTiming: method === 'pix' ? '' : 'now'
    });
  };

  const handlePixTimingChange = (timing: 'now' | 'pickup') => {
    onChange({
      ...data,
      pixTiming: timing
    });
  };

  const handleNeedsChangeToggle = (needsChange: boolean) => {
    onChange({
      ...data,
      needsChange,
      changeAmount: needsChange ? '' : '0'
    });
  };

  const handleChangeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = (parseFloat(value) / 100).toFixed(2);
    onChange({ ...data, changeAmount: formatted });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-red-100 to-orange-100 mb-4">
          <CreditCard className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Como você vai pagar?
        </h3>
        <p className="text-gray-600">
          Total do pedido: <span className="font-bold text-green-600">{formatCurrency(total)}</span>
        </p>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = data.paymentMethod === method.id;
          
          return (
            <button
              key={method.id}
              onClick={() => handlePaymentMethodChange(method.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? `${method.borderColor} ${method.bgColor} shadow-md`
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  isSelected ? `bg-gradient-to-r ${method.color}` : 'bg-gray-100'
                }`}>
                  <Icon className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div className="ml-4 text-left">
                  <h4 className={`font-semibold ${isSelected ? method.textColor : 'text-gray-900'}`}>
                    {method.name}
                  </h4>
                  <p className={`text-sm ${isSelected ? method.textColor : 'text-gray-600'}`}>
                    {method.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="ml-auto">
                    <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Opções específicas para dinheiro */}
      {data.paymentMethod === 'money' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-yellow-900 flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Pagamento em dinheiro
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="change"
                  checked={!data.needsChange}
                  onChange={() => handleNeedsChangeToggle(false)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-yellow-800">
                  Tenho o valor exato ({formatCurrency(total)})
                </span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="change"
                  checked={data.needsChange}
                  onChange={() => handleNeedsChangeToggle(true)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-yellow-800">
                  Preciso de troco
                </span>
              </label>
            </div>
          </div>

          {data.needsChange && (
            <div className="mt-4">
              <Input
                label="Valor que você tem (R$)"
                value={data.changeAmount}
                onChange={handleChangeAmountChange}
                placeholder="0,00"
                className="bg-white"
              />
              {data.changeAmount && parseFloat(data.changeAmount) > total && (
                <div className="mt-2 p-2 bg-green-100 border border-green-200 rounded">
                  <p className="text-sm text-green-800">
                    <strong>Troco:</strong> {formatCurrency(parseFloat(data.changeAmount) - total)}
                  </p>
                </div>
              )}
              {data.changeAmount && parseFloat(data.changeAmount) <= total && parseFloat(data.changeAmount) > 0 && (
                <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded">
                  <p className="text-sm text-red-800">
                    O valor deve ser maior que o total do pedido
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Informações específicas do PIX */}
      {data.paymentMethod === 'pix' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-purple-900 flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            Quando você quer fazer o pagamento PIX?
          </h4>
          
          <div className="space-y-3">
            <label className="flex items-start p-3 bg-white rounded-lg border-2 cursor-pointer transition-all hover:bg-purple-25 hover:border-purple-300">
              <input
                type="radio"
                name="pixTiming"
                value="now"
                checked={data.pixTiming === 'now'}
                onChange={() => handlePixTimingChange('now')}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 mt-1"
              />
              <div className="ml-3">
                <div className="font-medium text-purple-900">Pagar agora</div>
                <div className="text-sm text-purple-700">
                  Você receberá o QR Code via WhatsApp para pagamento imediato. 
                  O pedido será preparado após a confirmação do pagamento.
                </div>
              </div>
            </label>
            
            <label className="flex items-start p-3 bg-white rounded-lg border-2 cursor-pointer transition-all hover:bg-purple-25 hover:border-purple-300">
              <input
                type="radio"
                name="pixTiming"
                value="pickup"
                checked={data.pixTiming === 'pickup'}
                onChange={() => handlePixTimingChange('pickup')}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 mt-1"
              />
              <div className="ml-3">
                <div className="font-medium text-purple-900">Pagar na retirada</div>
                <div className="text-sm text-purple-700">
                  O pedido será preparado e você fará o pagamento PIX no momento da retirada/entrega.
                </div>
              </div>
            </label>
          </div>
          
          {data.pixTiming === 'now' && (
            <div className="bg-green-100 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                ✅ <strong>Pagamento imediato:</strong> Seu pedido terá prioridade no preparo após a confirmação do pagamento.
              </p>
            </div>
          )}
          
          {data.pixTiming === 'pickup' && (
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                ℹ️ <strong>Pagamento na retirada:</strong> Tenha seu celular em mãos para fazer o PIX no momento da entrega.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Informações específicas do cartão */}
      {data.paymentMethod === 'card' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Pagamento no cartão</h4>
          <p className="text-sm text-blue-800">
            O pagamento será processado na entrega. Aceitamos cartões de débito e crédito.
            Tenha seu cartão em mãos no momento da entrega.
          </p>
        </div>
      )}
    </div>
  );
};