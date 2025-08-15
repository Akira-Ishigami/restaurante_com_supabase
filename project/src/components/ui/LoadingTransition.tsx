import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingTransitionProps {
  children: React.ReactNode;
  isLoading?: boolean;
  duration?: number;
  showSpinner?: boolean;
}

export const LoadingTransition: React.FC<LoadingTransitionProps> = ({
  children,
  isLoading = false,
  duration = 600,
  showSpinner = true
}) => {
  const [internalLoading, setInternalLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Simula loading inicial
    const timer = setTimeout(() => {
      setInternalLoading(false);
      // Pequeno delay para iniciar fade in
      setTimeout(() => setFadeIn(true), 50);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (internalLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          {showSpinner && (
            <div className="mb-4">
              <Loader2 className="h-12 w-12 text-red-600 animate-spin mx-auto" />
            </div>
          )}
          <div className="space-y-2">
            <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-red-600 to-orange-600 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-600 text-sm animate-pulse">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-700 ease-out ${
      fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      {children}
    </div>
  );
};

// Hook para controlar loading entre páginas
export const usePageTransition = (duration: number = 600) => {
  const [isLoading, setIsLoading] = useState(false);

  const startTransition = () => {
    setIsLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        resolve();
      }, duration);
    });
  };

  return { isLoading, startTransition };
};