export interface AudioData {
  file?: File;
  blob?: Blob;
  url?: string;
  duration?: number;
}

export interface AnalysisResult {
  fileName: string;
  finalPrediction: string;
  confidence: number | string;
  voteCounts: {
    Control: number;
    Dementia: number;
  };
  visualizationUrl: string;
  speechfeatures: {
    pauseFrequency: number;
    speechRate: number;
    vocabularyComplexity: number;
    semanticFluency: number;
  };
}

// Keep the old interface if needed elsewhere in your app
export interface LegacyAnalysisResult {
  id: string;
  riskLevel: 'low' | 'moderate' | 'high';
  recommendations: string[];
  timestamp: string;
  backendData?: AnalysisResult;
}

export interface ApiResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
  message?: string;
}