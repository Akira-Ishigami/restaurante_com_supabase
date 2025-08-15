import React, { useState } from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';

interface FilterData {
  search: string;
  status: string;
  startDate: string;
  endDate: string;
  minValue: string;
  maxValue: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterData) => void;
  initialFilters?: FilterData;
}

const defaultFilters: FilterData = {
  search: '',
  status: '',
  startDate: '',
  endDate: '',
  minValue: '',
  maxValue: ''
};

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters = defaultFilters
}) => {
  const [filters, setFilters] = useState<FilterData>(initialFilters);

  const handleInputChange = (field: keyof FilterData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filtrar Pedidos" size="md">
      <div className="space-y-6">
        <div>
          <Input
            label="Buscar por cliente ou telefone"
            value={filters.search}
            onChange={handleInputChange('search')}
            placeholder="Digite o nome do cliente ou telefone..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status do Pedido
          </label>
          <select
            value={filters.status}
            onChange={handleInputChange('status')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="confirmado">Confirmado</option>
            <option value="preparando">Preparando</option>
            <option value="pronto">Pronto</option>
            <option value="entregue">Entregue</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Data Inicial"
              type="date"
              value={filters.startDate}
              onChange={handleInputChange('startDate')}
            />
          </div>
          <div>
            <Input
              label="Data Final"
              type="date"
              value={filters.endDate}
              onChange={handleInputChange('endDate')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Valor Mínimo (R$)"
              type="number"
              step="0.01"
              value={filters.minValue}
              onChange={handleInputChange('minValue')}
              placeholder="0.00"
            />
          </div>
          <div>
            <Input
              label="Valor Máximo (R$)"
              type="number"
              step="0.01"
              value={filters.maxValue}
              onChange={handleInputChange('maxValue')}
              placeholder="999.99"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            className="flex items-center"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};