import React from 'react';
import { Input } from '../../ui/Input';
import { Restaurant } from '../../../types';
import { businessTypes } from '../../../utils/demo-data';

interface Step1Props {
  data: Restaurant;
  onChange: (data: Restaurant) => void;
  errors: Record<string, string>;
}

export const Step1RestaurantInfo: React.FC<Step1Props> = ({ data, onChange, errors }) => {
  const handleInputChange = (field: keyof Restaurant) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...data, [field]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Informações do Restaurante</h2>
        <p className="text-gray-600">Vamos começar com as informações básicas do seu estabelecimento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Nome do Restaurante *"
            value={data.name}
            onChange={handleInputChange('name')}
            error={errors.name}
            placeholder="Ex: Restaurante do João"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Negócio *
          </label>
          <select
            value={data.businessType}
            onChange={handleInputChange('businessType')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione o tipo</option>
            {businessTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.businessType && (
            <p className="mt-1 text-sm text-red-600">{errors.businessType}</p>
          )}
        </div>

        <div>
          <Input
            label="Telefone *"
            type="tel"
            value={data.phone}
            onChange={handleInputChange('phone')}
            error={errors.phone}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Endereço Completo *"
            value={data.address}
            onChange={handleInputChange('address')}
            error={errors.address}
            placeholder="Rua, Número, Bairro, Cidade - Estado, CEP"
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Email de Contato *"
            type="email"
            value={data.email}
            onChange={handleInputChange('email')}
            error={errors.email}
            placeholder="contato@seurestaurante.com"
          />
        </div>
      </div>
    </div>
  );
};