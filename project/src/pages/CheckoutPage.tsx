import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PublicOrderService } from '../services/publicOrderService';
import { ArrowLeft, ArrowRight, ShoppingCart, User, MapPin, CreditCard, Phone, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CustomerInfoStep } from '../components/checkout/steps/CustomerInfoStep';
import { AddressStep } from '../components/checkout/steps/AddressStep';
import { PaymentStep } from '../components/checkout/steps/PaymentStep';
import { PhoneStep } from '../components/checkout/steps/PhoneStep';
import { OrderSummaryStep } from '../components/checkout/steps/OrderSummaryStep';
import { LoadingTransition } from '../components/ui/LoadingTransition';
import { demoRestaurant } from '../utils/demo-data';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

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

const initialCustomerData: CustomerData = {
  name: '',
  cep: '',
  address: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  paymentMethod: '',
  needsChange: false,
  changeAmount: '',
  phone: '',
  pixTiming: ''
};

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cart: CartItem[] = location.state?.cart || [];
  
  const [currentStep, setCurrentStep] = useState(1);
  const [customerData, setCustomerData] = useState<CustomerData>(initialCustomerData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/login');
    }
  }, [cart, navigate]);

  const steps = [
    { id: 1, title: 'Nome', icon: User, label: 'Dados' },
    { id: 2, title: 'Endereço', icon: MapPin, label: 'Endereço' },
    { id: 3, title: 'Pagamento', icon: CreditCard, label: 'Pagamento' },
    { id: 4, title: 'Telefone', icon: Phone, label: 'Contato' },
    { id: 5, title: 'Resumo', icon: Check, label: 'Confirmar' }
  ];

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 1:
        return customerData.name.trim().length > 0;
      case 2:
        return customerData.cep.length > 0 && customerData.address.trim().length > 0;
      case 3:
        if (customerData.paymentMethod === 'pix') {
          return customerData.pixTiming !== '';
        } else if (customerData.paymentMethod === 'money' && customerData.needsChange) {
          return customerData.changeAmount.length > 0;
        } else {
          return customerData.paymentMethod !== '';
        }
      case 4:
        return customerData.phone.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canGoNext()) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinishOrder = async () => {
    setIsLoading(true);
    
    try {
      // Create order with proper restaurant ID
      console.log('🛒 Criando pedido...');
      
      // For now, we need a real restaurant ID from the database
      if (PublicOrderService.isDemoMode) {
        // Since we don't have a real restaurant created yet, let's create one first or use a hardcoded UUID
        
        // TODO: This should be dynamic based on which restaurant's menu the user is viewing
        // For now, using a placeholder UUID that should exist in your database
        const restaurantId = '00000000-0000-0000-0000-000000000001'; // Replace with actual restaurant UUID from your database
        
        // If you want to test with demo data, uncomment the line below:
        // const restaurantId = 'demo-restaurant-1';
        
        console.log('🏪 Using restaurant ID:', restaurantId);
        
        const orderData = {
          restaurantId: restaurantId,
          customer: {
            name: customerData.name,
            phone: customerData.phone,
            address: `${customerData.address}, ${customerData.number}${customerData.complement ? `, ${customerData.complement}` : ''}, ${customerData.neighborhood}, ${customerData.city}/${customerData.state}, CEP: ${customerData.cep}`
          },
          items: cart.map(item => ({
            menuItemId: item.id,
            quantity: item.quantity,
            unitPrice: item.price
          })),
          paymentMethod: customerData.paymentMethod,
          deliveryAddress: `${customerData.address}, ${customerData.number}${customerData.complement ? `, ${customerData.complement}` : ''}, ${customerData.neighborhood}, ${customerData.city}/${customerData.state}, CEP: ${customerData.cep}`,
          customerNotes: customerData.paymentMethod === 'money' && customerData.needsChange ? `Troco para: R$ ${customerData.changeAmount}` : undefined,
          subtotal: getTotalPrice(),
          totalAmount: getTotalPrice()
        };
        
        const order = await PublicOrderService.createPublicOrder(orderData);
        
        console.log('🛒 Pedido criado com sucesso:', order.order_number);
        
        // Navigate to order tracking with the order data
        navigate('/order-tracking', {
          state: {
            orderId: order.order_number,
            customerData,
            cart,
            total: getTotalPrice()
          }
        });
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert('Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressBar = () => (
    <div className="bg-gradient-to-r from-red-700 to-orange-600 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/login')}
            className="text-white hover:text-red-100 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          
          <h1 className="text-xl font-bold">Finalizar Pedido</h1>
          
          <div className="w-6" />
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
                step.id <= currentStep 
                  ? 'bg-white text-red-600' 
                  : 'bg-red-500 text-white opacity-60'
              }`}>
                {step.id < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 rounded-full transition-all ${
                  step.id < currentStep ? 'bg-white' : 'bg-red-500 opacity-30'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="text-center mt-4">
          <h2 className="text-white font-semibold text-lg">
            {steps[currentStep - 1]?.title}
          </h2>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CustomerInfoStep
            data={customerData}
            onChange={setCustomerData}
          />
        );
      case 2:
        return (
          <AddressStep
            data={customerData}
            onChange={setCustomerData}
          />
        );
      case 3:
        return (
          <PaymentStep
            data={customerData}
            onChange={setCustomerData}
            total={getTotalPrice()}
          />
        );
      case 4:
        return (
          <PhoneStep
            data={customerData}
            onChange={setCustomerData}
          />
        );
      case 5:
        return (
          <OrderSummaryStep
            customerData={customerData}
            cart={cart}
            total={getTotalPrice()}
          />
        );
      default:
        return null;
    }
  };

  if (cart.length === 0) {
    return (
      <LoadingTransition>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Carrinho Vazio</h2>
            <p className="text-gray-600 mb-4">Adicione itens ao carrinho para continuar</p>
            <Button onClick={() => navigate('/login')}>
              Voltar ao Cardápio
            </Button>
          </div>
        </div>
      </LoadingTransition>
    );
  }

  return (
    <LoadingTransition>
      <div className="min-h-screen bg-gray-50">
        {renderProgressBar()}
        
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              {renderCurrentStep()}
            </div>

            {/* Navigation Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t">
              <div className="flex justify-between items-center">
                {currentStep > 1 ? (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                ) : (
                  <div />
                )}
                
                {currentStep < 5 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canGoNext()}
                    className="bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white flex items-center"
                  >
                    Próximo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleFinishOrder}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex items-center px-8 py-3"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Finalizar Pedido
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoadingTransition>
  );
};