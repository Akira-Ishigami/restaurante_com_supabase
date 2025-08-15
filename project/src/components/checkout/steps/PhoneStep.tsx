import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
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

interface PhoneStepProps {
  data: CustomerData;
  onChange: (data: CustomerData) => void;
}

export const PhoneStep: React.FC<PhoneStepProps> = ({ data, onChange }) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Limitar a 11 dígitos
    value = value.substring(0, 11);
    
    // Aplicar máscara
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    onChange({ ...data, phone: value });
  };

  const isValidPhone = () => {
    const numbers = data.phone.replace(/\D/g, '');
    return numbers.length >= 10;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-red-100 to-orange-100 mb-4">
          <Phone className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Qual é o seu telefone?
        </h3>
        <p className="text-gray-600">
          Precisamos do seu contato para atualizações do pedido
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Número do WhatsApp"
          value={data.phone}
          onChange={handlePhoneChange}
          placeholder="(11) 99999-9999"
          className="text-lg py-4"
          autoFocus
        />
        
        {isValidPhone() && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Perfeito! ✓
                </p>
                <p className="text-sm text-green-700">
                  Enviaremos atualizações do seu pedido via WhatsApp
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Como usamos seu telefone
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Confirmação do pedido via WhatsApp</li>
          <li>• Atualizações sobre o preparo</li>
          <li>• Contato do entregador</li>
          <li>• Suporte em caso de dúvidas</li>
        </ul>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Dica importante</h4>
        <p className="text-sm text-gray-600">
          Certifique-se de que o número está correto. Todas as comunicações sobre seu pedido 
          serão enviadas para este WhatsApp.
        </p>
      </div>
    </div>
  );
};