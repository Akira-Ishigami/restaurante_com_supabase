import React, { useState } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';

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

interface AddressStepProps {
  data: CustomerData;
  onChange: (data: CustomerData) => void;
}

export const AddressStep: React.FC<AddressStepProps> = ({ data, onChange }) => {
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const handleInputChange = (field: keyof CustomerData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [field]: e.target.value });
  };

  const handleCepSearch = async () => {
    if (data.cep.length < 8) return;
    
    setIsLoadingCep(true);
    
    try {
      // Simular busca de CEP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - em produção, usar API dos Correios
      const mockAddress = {
        address: 'Rua das Flores',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP'
      };
      
      onChange({
        ...data,
        address: mockAddress.address,
        neighborhood: mockAddress.neighborhood,
        city: mockAddress.city,
        state: mockAddress.state
      });
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setIsLoadingCep(false);
    }
  };

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    onChange({ ...data, cep: formatted });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-red-100 to-orange-100 mb-4">
          <MapPin className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Onde você está?
        </h3>
        <p className="text-gray-600">
          Informe seu endereço para calcularmos a entrega
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              label="CEP"
              value={data.cep}
              onChange={handleCepChange}
              placeholder="00000-000"
              maxLength={9}
              autoFocus
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleCepSearch}
              disabled={data.cep.length < 9 || isLoadingCep}
              variant="outline"
              className="px-3 py-2"
            >
              {isLoadingCep ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Input
          label="Endereço"
          value={data.address}
          onChange={handleInputChange('address')}
          placeholder="Rua, Avenida..."
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Número"
            value={data.number}
            onChange={handleInputChange('number')}
            placeholder="123"
          />
          <Input
            label="Complemento"
            value={data.complement}
            onChange={handleInputChange('complement')}
            placeholder="Apto, Bloco..."
          />
        </div>

        <Input
          label="Bairro"
          value={data.neighborhood}
          onChange={handleInputChange('neighborhood')}
          placeholder="Nome do bairro"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Cidade"
            value={data.city}
            onChange={handleInputChange('city')}
            placeholder="Cidade"
          />
          <Input
            label="Estado"
            value={data.state}
            onChange={handleInputChange('state')}
            placeholder="UF"
            maxLength={2}
          />
        </div>
      </div>

      {data.address && data.cep && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 mb-1">
                Endereço confirmado ✓
              </p>
              <p className="text-sm text-green-700">
                {data.address}, {data.number} {data.complement && `- ${data.complement}`}
                <br />
                {data.neighborhood} - {data.city}/{data.state}
                <br />
                CEP: {data.cep}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};