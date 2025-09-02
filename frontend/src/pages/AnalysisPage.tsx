import React, { useState, useRef, useEffect } from 'react'; // <-- IMPORT useRef and useEffect
import DashboardLayout from '../components/Layout/DashboardLayout';
import ImagePrompt from '../components/ImagePrompt';
import AudioRecorder from '../components/AudioRecorder';
import LoadingScreen from '../components/LoadingScreen';
import ResultsScreen from '../components/ResultsScreen';
import { AudioData, LegacyAnalysisResult } from '../types';
import { analyzeAudio } from '../api/analysis';

type AppState = 'recording' | 'loading' | 'results' | 'error';

const AnalysisPage: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>('recording');
  const [analysisResult, setAnalysisResult] = useState<LegacyAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // --- THIS IS THE FIX ---
  // Create a ref to hold the onStepComplete function.
  const onStepCompleteRef = useRef<(step: number) => void>();
  
  // Use useEffect to ensure the ref always has the latest setLoadingStep function.
  useEffect(() => {
    onStepCompleteRef.current = setLoadingStep;
  }, [setLoadingStep]); // This dependency array is technically stable, but it's good practice.
  // --- END OF FIX ---

  const testImage = {
    url: '/Cookie-Theft-Picture-4_W640.jpg',
    alt: 'Cookie Theft Picture - Kitchen scene',
    description: 'Look at this kitchen scene carefully. Please describe everything you see happening in this picture...'
  };

  const handleAudioReady = async (audioData: AudioData) => {
    if (!audioData.blob && !audioData.file) return;
    setIsProcessing(true);
    setCurrentState('loading');
    setLoadingStep(0);
    setError(null);

    try {
      const audioToAnalyze = audioData.file || audioData.blob!;
      // Pass the ref to the analyzeAudio function
      const result = await analyzeAudio(audioToAnalyze, onStepCompleteRef);
      setAnalysisResult(result);
      setCurrentState('results');
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setCurrentState('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartOver = () => {
    setCurrentState('recording');
    setAnalysisResult(null);
    setIsProcessing(false);
    setLoadingStep(0);
    setError(null);
  };

  
  // --- Conditional Rendering ---
  
  if (currentState === 'error') {
    return (
        <DashboardLayout title="Analysis Failed" subtitle="An error occurred during the process">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Analysis Failed</h2>
                <p className="text-gray-700 mb-6">{error}</p>
                <button onClick={handleStartOver} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                    Try Again
                </button>
            </div>
        </DashboardLayout>
    );
  }

  if (currentState === 'loading') {
    return <LoadingScreen message="Analyzing your speech for cognitive patterns..." currentStep={loadingStep} />;
  }

  if (currentState === 'results' && analysisResult) {
    return <ResultsScreen result={analysisResult} onStartOver={handleStartOver} />;
  }

  // Default state is 'recording'
  return (
    <DashboardLayout title="Cognitive Speech Analysis" subtitle="AI-powered early detection through speech pattern analysis">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-[#FFEAD8]">
              <h2 className="text-xl font-semibold text-[#2A1458] mb-4">Step 1: View the Image</h2>
              <p className="text-gray-600 mb-6">Take a moment to carefully observe the image below. You'll be asked to describe what you see in detail.</p>
            </div>
            <ImagePrompt imageUrl={testImage.url} alt={testImage.alt} description={testImage.description} />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-[#FFEAD8]">
              <h2 className="text-xl font-semibold text-[#2A1458] mb-4">Step 2: Record Your Description</h2>
              <p className="text-gray-600 mb-6">Describe the image in as much detail as possible. Include what you see, the activities taking place, and any stories the image tells you.</p>
              <div className="bg-gradient-to-r from-[#FFEAD8] to-[#E8988A]/20 border border-[#E8988A]/30 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-[#2A1458] mb-2">Tips for a good recording:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Speak clearly and at a natural pace</li>
                  <li>• Describe both obvious and subtle details</li>
                  <li>• Take your time - there's no rush</li>
                </ul>
              </div>
            </div>
            <AudioRecorder onAudioReady={handleAudioReady} disabled={isProcessing} />
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6 border border-[#FFEAD8]">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[#2A1458] mb-2">How It Works</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">Our AI analyzes various aspects of your speech to identify potential early indicators of cognitive changes. This tool is designed to complement, not replace, professional medical evaluation.</p>
          </div>
        </div>
    </DashboardLayout>
  );
};

export default AnalysisPage;