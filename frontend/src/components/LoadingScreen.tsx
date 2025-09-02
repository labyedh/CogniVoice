import React from 'react';
import { Brain, Loader2, AudioWaveform as Waveform } from 'lucide-react';
import Header from './Layout/Header';
import Footer from './Layout/Footer';

interface LoadingScreenProps {
  message?: string;
  currentStep?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Analyzing your speech patterns...",
  currentStep = 0
}) => {
  const steps = [
    "Preprocessing audio...",
    "Feature extraction...",
    "Speech pattern analysis...",
    "Generating insights..."
  ];

  return (
    <div className="min-h-screen flex flex-col">
    {/* --- 3. ADD THE HEADER --- */}
    <div className="pointer-events-none opacity-50">
      <Header />
    </div>
    <div className="min-h-screen bg-gradient-to-br from-[#FFEAD8]/30 to-[#E8988A]/10 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-[#FFEAD8]">
        {/* Brain Icon with Animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#E8988A]/20 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-gradient-to-r from-[#9B177E] to-[#2A1458] rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center">
            <Brain className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Main Loading Message */}
        <h2 className="text-2xl font-bold text-[#2A1458] mb-2">
          AI Analysis in Progress
        </h2>
        <p className="text-gray-600 mb-8">
          {message}
        </p>

        {/* Progress Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
                index === currentStep 
                  ? 'bg-gradient-to-r from-[#FFEAD8] to-[#E8988A]/20 border-l-4 border-[#9B177E]' 
                  : index < currentStep 
                    ? 'bg-green-50 border-l-4 border-green-500' 
                    : 'bg-gray-50'
              }`}
            >
              {index < currentStep ? (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              ) : index === currentStep ? (
                <Loader2 className="w-5 h-5 text-[#9B177E] animate-spin" />
              ) : (
                <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
              )}
              <span className={`text-sm ${
                index <= currentStep ? 'text-[#2A1458] font-medium' : 'text-gray-500'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Waveform Animation */}
        <div className="flex items-center justify-center space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-[#9B177E] to-[#2A1458] rounded-full animate-pulse"
              style={{
                height: `${Math.random() * 20 + 10}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>

        <p className="text-xs text-gray-500">
          This process typically takes 30-60 seconds
        </p>
      </div>
    </div>
    <div className="pointer-events-none opacity-50">
        <Footer />
      </div>
    </div>
  );
};

export default LoadingScreen;