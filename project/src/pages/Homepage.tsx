import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingTransition } from '../components/ui/LoadingTransition';
import { 
  Store, 
  Menu, 
  X, 
  ArrowRight, 
  ShoppingCart, 
  MessageCircle, 
  BarChart3, 
  Users,
  Star,
  TrendingUp,
  Clock,
  Shield,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Zap,
  Check,
  Crown,
  Rocket,
  Building,
  Calendar,
  Smartphone
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// Add custom CSS for animations
const animationStyles = `
  @keyframes whatsapp-bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-8px);
    }
    60% {
      transform: translateY(-4px);
    }
  }
  .whatsapp-bounce {
    animation: whatsapp-bounce 2s infinite;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .animate-delay-100 { animation-delay: 0.1s; }
  .animate-delay-200 { animation-delay: 0.2s; }
  .animate-delay-300 { animation-delay: 0.3s; }
  .animate-delay-400 { animation-delay: 0.4s; }
  
  .opacity-0 { opacity: 0; }
  
  .hover-scale {
    transition: transform 0.2s ease-out;
  }
  
  .hover-scale:hover {
    transform: scale(1.05);
  }
  
  .phone-hover {
    transition: all 0.2s ease-out;
  }
  
  .phone-hover:hover {
    transform: scale(1.1);
    background-color: rgb(239 246 255);
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin-slow {
    animation: spin 2s linear infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
  
  .animate-pulse-custom {
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  @keyframes rocketLaunch {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }
  
  .animate-rocket-launch {
    animation: rocketLaunch 2s ease-in-out infinite;
  }
  
  .card-hover-inflate {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-hover-inflate:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
  }
  
  @keyframes phoneWiggle {
    0%, 100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-3deg);
    }
    75% {
      transform: rotate(3deg);
    }
  }
  
  .animate-phone-wiggle {
    animation: phoneWiggle 2.5s ease-in-out infinite;
  }
  
  @keyframes messagePulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
  
  .message-pulse {
    animation: messagePulse 2s ease-in-out infinite;
  }
  
  @keyframes bubbleFloat {
    0% {
      transform: translateY(100vh) scale(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100px) scale(1);
      opacity: 0;
    }
  }
  
  .bubble {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    animation: bubbleFloat linear infinite;
  }
  
  .bubble:nth-child(1) {
    left: 10%;
    width: 28px;
    height: 28px;
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
    animation-duration: 8s;
    animation-delay: 0s;
  }
  
  .bubble:nth-child(2) {
    left: 20%;
    width: 22px;
    height: 22px;
    background: linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3));
    animation-duration: 10s;
    animation-delay: 2s;
  }
  
  .bubble:nth-child(3) {
    left: 35%;
    width: 32px;
    height: 32px;
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
    animation-duration: 12s;
    animation-delay: 4s;
  }
  
  .bubble:nth-child(4) {
    left: 50%;
    width: 26px;
    height: 26px;
    background: linear-gradient(45deg, rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.3));
    animation-duration: 9s;
    animation-delay: 1s;
  }
  
  .bubble:nth-child(5) {
    left: 65%;
    width: 30px;
    height: 30px;
    background: linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2));
    animation-duration: 11s;
    animation-delay: 3s;
  }
  
  .bubble:nth-child(6) {
    left: 80%;
    width: 24px;
    height: 24px;
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
    animation-duration: 13s;
    animation-delay: 5s;
  }
  
  .bubble:nth-child(7) {
    left: 90%;
    width: 28px;
    height: 28px;
    background: linear-gradient(45deg, rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.2));
    animation-duration: 7s;
    animation-delay: 6s;
  }
  
  .bubble:nth-child(8) {
    left: 15%;
    width: 28px;
    height: 28px;
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4));
    animation-duration: 14s;
    animation-delay: 1.5s;
  }
  
  .bubble:nth-child(9) {
    left: 25%;
    width: 32px;
    height: 32px;
    background: linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3));
    animation-duration: 16s;
    animation-delay: 3.5s;
  }
  
  .bubble:nth-child(10) {
    left: 45%;
    width: 26px;
    height: 26px;
    background: linear-gradient(45deg, rgba(236, 72, 153, 0.4), rgba(59, 130, 246, 0.4));
    animation-duration: 11s;
    animation-delay: 2.5s;
  }
  
  .bubble:nth-child(11) {
    left: 55%;
    width: 30px;
    height: 30px;
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
    animation-duration: 15s;
    animation-delay: 4.5s;
  }
  
  .bubble:nth-child(12) {
    left: 75%;
    width: 24px;
    height: 24px;
    background: linear-gradient(45deg, rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.4));
    animation-duration: 13s;
    animation-delay: 0.5s;
  }
  
  .bubble:nth-child(13) {
    left: 85%;
    width: 28px;
    height: 28px;
    background: linear-gradient(45deg, rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.3));
    animation-duration: 17s;
    animation-delay: 5.5s;
  }
  
  .bubble:nth-child(14) {
    left: 5%;
    width: 22px;
    height: 22px;
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4));
    animation-duration: 12s;
    animation-delay: 7s;
  }
  
  .bubble:nth-child(15) {
    left: 95%;
    width: 26px;
    height: 26px;
    background: linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3));
    animation-duration: 18s;
    animation-delay: 8s;
  }
  
  .bubble:nth-child(16) {
    left: 12%;
    width: 30px;
    height: 30px;
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4));
    animation-duration: 14s;
    animation-delay: 2.5s;
  }
  
  .bubble:nth-child(17) {
    left: 28%;
    width: 26px;
    height: 26px;
    background: linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3));
    animation-duration: 16s;
    animation-delay: 4.5s;
  }
  
  .bubble:nth-child(18) {
    left: 42%;
    width: 34px;
    height: 34px;
    background: linear-gradient(45deg, rgba(236, 72, 153, 0.4), rgba(59, 130, 246, 0.4));
    animation-duration: 13s;
    animation-delay: 1.8s;
  }
  
  .bubble:nth-child(19) {
    left: 58%;
    width: 28px;
    height: 28px;
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
    animation-duration: 15s;
    animation-delay: 6.2s;
  }
  
  .bubble:nth-child(20) {
    left: 72%;
    width: 32px;
    height: 32px;
    background: linear-gradient(45deg, rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.4));
    animation-duration: 17s;
    animation-delay: 3.7s;
  }
  
  .bubble:nth-child(21) {
    left: 88%;
    width: 30px;
    height: 30px;
    background: linear-gradient(45deg, rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.3));
    animation-duration: 19s;
    animation-delay: 7.5s;
  }
  
  .bubble:nth-child(22) {
    left: 18%;
    width: 26px;
    height: 26px;
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4));
    animation-duration: 12s;
    animation-delay: 5.8s;
  }
  
  .bubble:nth-child(23) {
    left: 38%;
    width: 28px;
    height: 28px;
    background: linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3));
    animation-duration: 20s;
    animation-delay: 9.2s;
  }
  
  .bubble:nth-child(24) {
    left: 62%;
    width: 32px;
    height: 32px;
    background: linear-gradient(45deg, rgba(236, 72, 153, 0.4), rgba(59, 130, 246, 0.4));
    animation-duration: 14s;
    animation-delay: 2.8s;
  }
  
  .bubble:nth-child(25) {
    left: 78%;
    width: 30px;
    height: 30px;
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
    animation-duration: 16s;
    animation-delay: 6.8s;
  }
  
  .bubble:nth-child(26) {
    left: 8%;
    width: 28px;
    height: 28px;
    background: linear-gradient(45deg, rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.4));
    animation-duration: 20s;
    animation-delay: 1.2s;
  }
  
  .bubble:nth-child(27) {
    left: 33%;
    width: 32px;
    height: 32px;
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
    animation-duration: 18s;
    animation-delay: 3.8s;
  }
  
  .bubble:nth-child(28) {
    left: 67%;
    width: 26px;
    height: 26px;
    background: linear-gradient(45deg, rgba(236, 72, 153, 0.4), rgba(59, 130, 246, 0.4));
    animation-duration: 22s;
    animation-delay: 5.2s;
  }
  
  .bubble:nth-child(29) {
    left: 92%;
    width: 30px;
    height: 30px;
    background: linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3));
    animation-duration: 19s;
    animation-delay: 7.8s;
  }
  
  .bubble:nth-child(30) {
    left: 23%;
    width: 28px;
    height: 28px;
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4));
    animation-duration: 21s;
    animation-delay: 2.3s;
  }
  
  .bubble:nth-child(31) {
    left: 48%;
    width: 34px;
    height: 34px;
    background: linear-gradient(45deg, rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.3));
    animation-duration: 17s;
    animation-delay: 4.7s;
  }
  
  .bubble:nth-child(32) {
    left: 73%;
    width: 26px;
    height: 26px;
    background: linear-gradient(45deg, rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.4));
    animation-duration: 23s;
    animation-delay: 6.1s;
  }
  
  .bubble:nth-child(33) {
    left: 13%;
    width: 30px;
    height: 30px;
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
    animation-duration: 24s;
    animation-delay: 8.4s;
  }
  
  .bubble:nth-child(34) {
    left: 37%;
    width: 28px;
    height: 28px;
    background: linear-gradient(45deg, rgba(236, 72, 153, 0.4), rgba(59, 130, 246, 0.4));
    animation-duration: 16s;
    animation-delay: 1.9s;
  }
  
  .bubble:nth-child(35) {
    left: 63%;
    width: 32px;
    height: 32px;
    background: linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3));
    animation-duration: 25s;
    animation-delay: 9.1s;
  }
  
  @keyframes gradientShift {
    0% {
      background: linear-gradient(270deg, #8b5cf6, #3b82f6, #ec4899, #ef4444, #f97316, #8b5cf6, #3b82f6);
      background-size: 400% 400%;
      background-position: 100% 50%;
    }
    100% {
      background: linear-gradient(270deg, #8b5cf6, #3b82f6, #ec4899, #ef4444, #f97316, #8b5cf6, #3b82f6);
      background-size: 400% 400%;
      background-position: 0% 50%;
    }
  }
  
  .gradient-shift {
    animation: gradientShift 12s ease-in-out infinite;
  }
`;

const systemFeatures = [

  {
    icon: MessageCircle,
    title: "Agente de IA no WhatsApp",
    description: "Inteligência artificial que atende, agenda e responde dúvidas automaticamente",
    bgColor: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    icon: Menu,
    title: "Cardápio Digital",
    description: "Cardápio online completo com fotos, preços e descrições detalhadas dos pratos",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600"
  },
  {
    icon: BarChart3,
    title: "Dashboard Completo",
    description: "Gerencie agendamentos, clientes, serviços e relatórios em tempo real",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600"
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "Cadastro automático, histórico completo e comunicação integrada",
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600"
  },
  {
    icon: Smartphone,
    title: "100% Responsivo",
    description: "Funciona perfeitamente em celular, tablet e computador",
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600"
  },
  {
    icon: Clock,
    title: "Disponível 24/7",
    description: "Seus clientes podem agendar a qualquer hora, mesmo quando você dorme",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-600"
  }
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Aumento de 45% na Receita",
    description: "Nossos clientes veem um crescimento médio de 45% na receita nos primeiros 6 meses."
  },
  {
    icon: Clock,
    title: "Economia de 3h Diárias",
    description: "Automatize tarefas repetitivas e economize até 3 horas por dia na gestão do restaurante."
  },
  {
    icon: Users,
    title: "Satisfação de 98% dos Clientes",
    description: "Melhore a experiência do cliente com atendimento mais rápido e eficiente."
  },
  {
    icon: Shield,
    title: "Redução de 60% nos Erros",
    description: "Sistema inteligente que minimiza erros de pedidos e melhora a precisão operacional."
  }
];

const plans = [
  {
    name: "Starter",
    price: "R$ 97",
    period: "/mês",
    description: "Perfeito para restaurantes pequenos que estão começando",
    features: [
      "Cardápio Digital",
      "Relatórios simples",
      "Suporte por email"
    ],
    popular: false,
    color: "border-gray-200"
  },
  {
    name: "Professional",
    price: "R$ 197",
    period: "/mês",
    description: "Ideal para restaurantes em crescimento",
    features: [
      "Até 5 usuários",
      "WhatsApp com IA",
      "Relatórios avançados",
      "Suporte prioritário"
    ],
    popular: true,
    color: "border-blue-500"
  }
];

const mockStats = [
  { label: "Pedidos Ativos", value: "23", color: "text-blue-600" },
  { label: "Receita de Hoje", value: "R$ 1.250", color: "text-green-600" },
  { label: "Produto Top", value: "Pizza Margherita", color: "text-purple-600" },
  { label: "Avaliação", value: "4.8★", color: "text-yellow-600" }
];

// Hook for scroll animations
const useScrollAnimation = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Observe all elements with data-animate attribute
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return visibleElements;
};

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
    <header className="bg-white shadow-sm fixed w-full z-50 border-b border-gray-100 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-700 to-orange-600 shadow-lg">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">NEXLA</h1>
              <p className="text-sm text-gray-600 font-medium">Inteligência Artificial para Negócios</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200">
              Recursos
            </a>
            <a href="#benefits" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200">
              Benefícios
            </a>
            <a href="#plans" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200">
              Planos
            </a>
            <a href="#contact" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200">
              Contato
            </a>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => window.open('tel:+5569999300101', '_self')}
                className="p-2 text-gray-600 hover:text-red-600 rounded-lg phone-hover transition-colors duration-200"
              >
                <Phone className="h-5 w-5" />
              </button>
              <Button 
                onClick={() => navigate('/login')} 
                className="bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover-scale shadow-lg"
              >
                Ver Demonstração
              </Button>
            </div>
          </nav>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center space-x-3">
            <button 
              onClick={() => window.open('tel:+5569999300101', '_self')}
              className="p-2 text-gray-600 hover:text-red-600 rounded-lg phone-hover transition-colors duration-200"
            >
              <Phone className="h-5 w-5" />
            </button>
            <Button 
              onClick={() => navigate('/login')} 
              className="bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white px-4 py-2 rounded-full font-semibold text-sm hover-scale shadow-lg"
            >
              Ver Demonstração
            </Button>
          </div>
        </div>
      </div>
    </header>
    
    {/* Mobile Header - Not Fixed */}
    <header className="bg-white shadow-sm w-full z-50 border-b border-gray-100 md:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-700 to-orange-600 shadow-lg">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">NEXLA</h1>
              <p className="text-sm text-gray-600 font-medium">Inteligência Artificial para Negócios</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => window.open('tel:+5569999300101', '_self')}
              className="p-2 text-gray-600 hover:text-red-600 rounded-lg phone-hover transition-colors duration-200"
            >
              <Phone className="h-5 w-5" />
            </button>
            <Button 
              onClick={() => navigate('/login')} 
              className="bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white px-4 py-2 rounded-full font-semibold text-sm hover-scale shadow-lg"
            >
              Ver Demonstração
            </Button>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

interface HeroProps {
}

const Hero: React.FC<HeroProps> = () => {
  const navigate = useNavigate();
  const visibleElements = useScrollAnimation();

  useEffect(() => {
    // Mock API call for fetching restaurant data
    console.log('🔄 [Mock API] Buscando estatísticas do restaurante...');
    console.log('📊 [Mock API] Carregando restaurantes em destaque...');
    console.log('✅ [Mock API] Dados da homepage carregados com sucesso');
  }, []);

  return (
    <section id="home" className="md:pt-20 pt-4 pb-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div 
            className={`text-center lg:text-left opacity-0 ${visibleElements.has('hero-content') ? 'animate-fade-in-up' : ''}`}
            data-animate
            id="hero-content"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transforme seu
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-orange-600"> Restaurante </span>
              em uma Máquina de Vendas!
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Sistema completo de gestão que automatiza pedidos, integra WhatsApp e multiplica seus resultados. Mais de 348 restaurantes já transformaram seus negócios conosco.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/login')}
                className="group relative px-8 py-4 bg-gradient-to-r from-red-700 via-orange-600 to-red-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out overflow-hidden flex items-center justify-center"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Começar Gratuitamente
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-800 via-orange-700 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out overflow-hidden flex items-center justify-center"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 mr-2 message-pulse" />
                  Falar no WhatsApp
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-8 mt-12 text-sm text-gray-500">
              <div className="flex items-center text-gray-600">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Sem taxa de setup
              </div>
              <div className="flex items-center text-gray-600">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Suporte incluído
              </div>
              <div className="flex items-center text-gray-600">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Personalização completa
              </div>
            </div>
          </div>

          <div 
            className={`relative opacity-0 ${visibleElements.has('hero-image') ? 'animate-fade-in-up animate-delay-200' : ''}`}
            data-animate
            id="hero-image"
          >
            <div className="relative z-10">
              <img 
                src="https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Interior Moderno de Restaurante" 
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Crescimento da Receita</p>
                    <p className="text-2xl font-bold text-gray-900">+45%</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-4 right-4 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-10 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features: React.FC = () => {
  const visibleElements = useScrollAnimation();

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-16 opacity-0 ${visibleElements.has('features-header') ? 'animate-fade-in-up' : ''}`}
          data-animate
          id="features-header"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Como Funciona Nosso Sistema
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tecnologia de ponta para automatizar seu negócio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {systemFeatures.map((feature, index) => (
            <div
              key={index}
              className={`opacity-0 ${visibleElements.has(`feature-${index}`) ? `animate-fade-in-up animate-delay-${(index + 1) * 100}` : ''}`}
              data-animate
              id={`feature-${index}`}
            >
              <div className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 card-hover-inflate">
                <div className={`h-16 w-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Benefits: React.FC = () => {
  const visibleElements = useScrollAnimation();

  return (
    <section id="benefits" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-16 opacity-0 ${visibleElements.has('benefits-header') ? 'animate-fade-in-up' : ''}`}
          data-animate
          id="benefits-header"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Benefícios
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Resultados comprovados que transformam negócios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: TrendingUp,
              title: "Aumento de 300% nas Vendas",
              description: "Clientes agendam mais facilmente, aumentando seu faturamento",
              bgColor: "bg-green-100",
              iconColor: "text-green-600"
            },
            {
              icon: Clock,
              title: "Economia de 8h/dia",
              description: "Pare de atender telefone para agendamentos o dia todo",
              bgColor: "bg-blue-100",
              iconColor: "text-blue-600"
            },
            {
              icon: Shield,
              title: "Zero Pedidos Perdidos",
              description: "Sistema nunca falha, nunca esquece, nunca está ocupado",
              bgColor: "bg-purple-100",
              iconColor: "text-purple-600"
            },
            {
              icon: Users,
              title: "Atendimento Profissional",
              description: "IA responde igual um funcionário treinado, 24/7",
              bgColor: "bg-pink-100",
              iconColor: "text-pink-600"
            },
            {
              icon: TrendingUp,
              title: "ROI de 500% em 30 dias",
              description: "Investimento se paga rapidamente com mais agendamentos",
              bgColor: "bg-yellow-100",
              iconColor: "text-yellow-600"
            },
            {
              icon: Star,
              title: "Satisfação Garantida",
              description: "Clientes ficam impressionados com a tecnologia",
              bgColor: "bg-indigo-100",
              iconColor: "text-indigo-600"
            }
          ].map((benefit, index) => (
            <div
              key={index}
              className={`opacity-0 ${visibleElements.has(`benefit-${index}`) ? `animate-fade-in-up animate-delay-${(index + 1) * 100}` : ''}`}
              data-animate
              id={`benefit-${index}`}
            >
              <div className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 card-hover-inflate">
                <div className={`h-16 w-16 ${benefit.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className={`h-8 w-8 ${benefit.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface CTASectionProps {
}

const CTASection: React.FC<CTASectionProps> = () => {
  const visibleElements = useScrollAnimation();
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`bg-white rounded-3xl shadow-lg p-8 sm:p-12 text-center opacity-0 ${visibleElements.has('cta-section') ? 'animate-fade-in-up' : ''}`}
          data-animate
          id="cta-section"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Pronto para{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              10x seu negócio?
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Mais de 348 empresas já automatizaram com a NEXLA
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="group relative px-8 py-4 bg-gradient-to-r from-red-700 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out overflow-hidden flex items-center justify-center"
            >
              <span className="relative z-10 flex items-center justify-center">
                <Zap className="h-5 w-5 mr-2 animate-spin-slow" />
                Testar Grátis Agora
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button
              onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
             className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out overflow-hidden flex items-center justify-center"
            >
              <span className="relative z-10 flex items-center justify-center">
               <MessageCircle className="h-5 w-5 mr-2 message-pulse" />
                Falar com Especialista
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Plans: React.FC = () => {
  const visibleElements = useScrollAnimation();

  return (
    <section id="plans" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-16 opacity-0 ${visibleElements.has('plans-header') ? 'animate-fade-in-up' : ''}`}
          data-animate
          id="plans-header"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Escolha o Plano Ideal
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Planos flexíveis que crescem junto com seu negócio. Comece grátis e escale conforme necessário.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`opacity-0 ${visibleElements.has(`plan-${index}`) ? `animate-fade-in-up animate-delay-${(index + 1) * 100}` : ''}`}
              data-animate
              id={`plan-${index}`}
            >
              <div className={`relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${plan.color} ${plan.popular ? 'transform scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                      <Crown className="h-4 w-4 mr-1" />
                      Mais Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' : ''}`}
                  variant={plan.popular ? 'primary' : 'outline'}
                >
                  {plan.popular ? (
                    <>
                      <Rocket className="h-4 w-4 mr-2 animate-rocket-launch" />
                      Começar Agora
                    </>
                  ) : (
                    <>
                      <Building className="h-4 w-4 mr-2 animate-phone-wiggle" />
                      Escolher Plano
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


interface DemoSectionProps {
}

const DemoSection: React.FC<DemoSectionProps> = () => {
  const navigate = useNavigate();

  return (
    <section id="demo" className="relative w-full gradient-shift py-20 overflow-hidden">
      {/* Animated bubbles */}
      <div className="absolute inset-0">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-8 left-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-8 right-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Pronto para Revolucionar seu Negócio?
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Teste nossa demonstração gratuita e veja como podemos automatizar seu atendimento
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-white text-red-700 font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
          >
            <Zap className="h-5 w-5 mr-2" />
            Ver Demonstração Grátis
          </button>
          <button 
            onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
           className="px-8 py-4 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-all duration-300 flex items-center justify-center"
          >
           <MessageCircle className="h-5 w-5 mr-2 message-pulse" />
            Falar com Especialista
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left side - Company Info */}
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-r from-red-700 to-orange-600 flex-shrink-0">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">NEXLA</h3>
              <p className="text-gray-400 text-sm">Inteligência Artificial para Negócios</p>
              <p className="text-gray-400 text-sm mt-2">
                Automatizamos seu negócio com tecnologia
                de ponta e inteligência artificial
              </p>
            </div>
          </div>

          {/* Center - Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-red-400" />
                <span className="text-gray-400 text-sm">+55 69 99930-0101</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-red-400" />
                <span className="text-gray-400 text-sm">nexla@nexla.com.br</span>
              </div>
              <div className="flex items-center space-x-3">
                <Instagram className="h-4 w-4 text-red-400" />
                <span className="text-gray-400 text-sm">@nexla_ia </span>
              </div>
            </div>
          </div>

          {/* Right side - Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Links Rápidos</h4>
            <div className="space-y-2">
              <div>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block">
                  Ver Demonstração
                </a>
              </div>
              <div>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block">
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center">
          <p className="text-gray-400">
            © 2024 NEXLA - Inteligência Artificial para Negócios. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export const Homepage: React.FC = () => {
  return (
    <LoadingTransition duration={600}>
      <div className="min-h-screen bg-white page-transition">
        <Header />
        <Hero />
        <Features />
        <Benefits />
        <CTASection />
        <Plans />
        <DemoSection />
        <Footer />
      </div>
    </LoadingTransition>
  );
};