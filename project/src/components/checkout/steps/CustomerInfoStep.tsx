import React from 'react';
import { User } from 'lucide-react';
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
}

interface CustomerInfoStepProps {
  data: CustomerData;
  onChange: (data: CustomerData) => void;
}

export const CustomerInfoStep: React.FC<CustomerInfoStepProps> = ({ data, onChange }) => {
  const handleInputChange = (field: keyof CustomerData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [field]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-red-100 to-orange-100 mb-4">
          <User className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Qual é o seu nome?
        </h3>
        <p className="text-gray-600">
          Precisamos do seu nome para identificar o pedido
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Nome completo"
          value={data.name}
          onChange={handleInputChange('name')}
          placeholder="Digite seu nome completo"
          className="text-lg py-4"
          autoFocus
        />
        
        {data.name.trim().length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Olá, {data.name}! 👋
                </p>
                <p className="text-sm text-green-700">
                  Vamos continuar com seu pedido
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Por que precisamos do seu nome?</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Para identificar seu pedido</li>
          <li>• Para personalizar o atendimento</li>
          <li>• Para confirmar a entrega</li>
        </ul>
      </div>
    </div>
  );
};