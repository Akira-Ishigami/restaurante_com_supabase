import React from 'react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { MessageCircle, Check } from 'lucide-react';

interface WhatsAppData {
  number: string;
  welcomeMessage: string;
  autoReply: boolean;
}

interface Step3Props {
  data: WhatsAppData;
  onChange: (data: WhatsAppData) => void;
  errors: Record<string, string>;
}

export const Step3WhatsAppSetup: React.FC<Step3Props> = ({ data, onChange, errors }) => {
  const handleInputChange = (field: keyof WhatsAppData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = field === 'autoReply' ? (e.target as HTMLInputElement).checked : e.target.value;
    onChange({ ...data, [field]: value });
  };

  const handleTestConnection = () => {
    if (!data.number) {
      alert('Por favor, insira um número do WhatsApp primeiro!');
      return;
    }
    
    // Mock test - in real app, this would test the WhatsApp Business API connection
    setTimeout(() => {
      alert('✅ Conexão testada com sucesso!\n\nO WhatsApp Business foi configurado corretamente.');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
          <MessageCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Integração WhatsApp</h2>
        <p className="text-gray-600">Configure o WhatsApp Business para receber pedidos automaticamente</p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-start">
          <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Benefícios da Integração WhatsApp:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Receba pedidos diretamente no WhatsApp</li>
              <li>Respostas automáticas para clientes</li>
              <li>Catálogo de produtos integrado</li>
              <li>Histórico de conversas organizado</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Input
            label="Número do WhatsApp Business *"
            value={data.number}
            onChange={handleInputChange('number')}
            error={errors.number}
            placeholder="(11) 99999-9999"
            helpText="Use o número do WhatsApp Business da sua empresa"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensagem de Boas-vindas
          </label>
          <textarea
            value={data.welcomeMessage}
            onChange={handleInputChange('welcomeMessage')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Olá! Bem-vindo ao nosso restaurante. Como posso ajudá-lo hoje?"
          />
          <p className="mt-1 text-sm text-gray-500">Esta mensagem será enviada automaticamente para novos clientes</p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoReply"
            checked={data.autoReply}
            onChange={handleInputChange('autoReply')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="autoReply" className="ml-2 text-sm text-gray-700">
            Ativar respostas automáticas fora do horário de funcionamento
          </label>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Testar Conexão</h4>
          <p className="text-sm text-gray-600 mb-3">
            Clique no botão abaixo para verificar se a integração está funcionando corretamente.
          </p>
          <Button
            onClick={handleTestConnection}
            variant="outline"
            className="w-full md:w-auto"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Testar Conexão WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};