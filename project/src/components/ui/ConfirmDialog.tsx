import React from 'react';
import { AlertTriangle, Trash2, Check, X, AlertCircle, XCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  icon?: React.ReactNode;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  icon
}) => {
  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'danger':
        return <XCircle className="h-8 w-8 text-white" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case 'info':
        return <Check className="h-6 w-6 text-blue-600" />;
      default:
        return <XCircle className="h-8 w-8 text-white" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600';
      case 'warning':
        return 'bg-yellow-100';
      case 'info':
        return 'bg-blue-100';
      default:
        return 'bg-red-600';
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      default:
        return 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200';
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isDanger={type === 'danger'}>
      <div className="text-center p-8">
        <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${getIconBg()} mb-6 ${type === 'danger' ? 'animate-pulse' : ''}`}>
          {getIcon()}
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-gray-900">
          {title}
        </h3>
        
        <p className="text-base mb-8 text-gray-600">
          {message}
        </p>
        
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-3 text-base"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={`px-6 py-3 text-base font-semibold ${getConfirmButtonStyle()}`}
          >
            {type === 'danger' && <Trash2 className="h-4 w-4 mr-2" />}
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};