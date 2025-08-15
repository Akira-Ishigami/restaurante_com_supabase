import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { User } from '../../../types';
import { userRoles } from '../../../utils/demo-data';
import { Plus, Trash2, Mail, Users } from 'lucide-react';

interface Step4Props {
  users: Omit<User, 'id' | 'restaurantId'>[];
  onUsersChange: (users: Omit<User, 'id' | 'restaurantId'>[]) => void;
}

export const Step4UserSetup: React.FC<Step4Props> = ({ users, onUsersChange }) => {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '' as 'admin' | 'manager' | 'attendant' | ''
  });

  const addUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.role) return;
    
    const user: Omit<User, 'id' | 'restaurantId'> = {
      name: newUser.name.trim(),
      email: newUser.email.trim().toLowerCase(),
      role: newUser.role as 'admin' | 'manager' | 'attendant'
    };
    
    onUsersChange([...users, user]);
    setNewUser({ name: '', email: '', role: '' });
  };

  const removeUser = (index: number) => {
    onUsersChange(users.filter((_, i) => i !== index));
  };

  const sendInvite = (email: string) => {
    // Mock sending invite
    alert(`📧 Convite enviado para ${email}!\n\nO funcionário receberá um email com instruções para acessar o sistema.`);
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      attendant: 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: string) => {
    return userRoles.find(r => r.value === role)?.label || role;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
          <Users className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuração de Usuários</h2>
        <p className="text-gray-600">Adicione funcionários e defina suas permissões no sistema</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Níveis de Permissão:</h4>
        <div className="space-y-1 text-sm text-blue-800">
          <p><strong>Administrador:</strong> Acesso total ao sistema, configurações e relatórios</p>
          <p><strong>Gerente:</strong> Gerencia pedidos, estoque e funcionários</p>
          <p><strong>Atendente:</strong> Recebe pedidos e consulta produtos</p>
        </div>
      </div>

      {/* Add User Form */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Funcionário</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            label="Nome Completo"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="João da Silva"
          />
          
          <Input
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="joao@restaurante.com"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cargo
            </label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione o cargo</option>
              {userRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <Button 
          onClick={addUser} 
          disabled={!newUser.name.trim() || !newUser.email.trim() || !newUser.role}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Funcionário
        </Button>
      </div>

      {/* Users List */}
      {users.length > 0 && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Funcionários Cadastrados ({users.length})
            </h3>
          </div>
          
          <div className="divide-y">
            {users.map((user, index) => (
              <div key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendInvite(user.email)}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Enviar Convite
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUser(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {users.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum funcionário cadastrado ainda</p>
          <p className="text-sm text-gray-500">Adicione funcionários para começar a usar o sistema</p>
        </div>
      )}
    </div>
  );
};