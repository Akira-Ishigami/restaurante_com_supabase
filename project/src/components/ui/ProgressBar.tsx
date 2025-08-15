import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  stepLabels = []
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Passo {currentStep} de {totalSteps}
        </span>
        <span className="text-sm text-gray-500">{Math.round(progress)}% completo</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {stepLabels.length > 0 && (
        <div className="flex justify-between mt-4">
          {stepLabels.map((label, index) => (
            <div
              key={index}
              className={`text-xs text-center flex-1 ${
                index + 1 <= currentStep 
                  ? 'text-blue-600 font-medium' 
                  : 'text-gray-400'
              }`}
            >
              <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-bold ${
                index + 1 <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {index + 1}
              </div>
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};