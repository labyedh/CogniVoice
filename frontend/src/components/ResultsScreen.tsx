import React from 'react';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Download,
  Share2,
  ArrowLeft,
  Activity,
  Mic,
  Clock,
  BookOpen
} from 'lucide-react';
import { AnalysisResult, LegacyAnalysisResult } from '../types';
import DashboardLayout from './Layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';

interface ResultsScreenProps {
  result: LegacyAnalysisResult;
  onStartOver: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onStartOver }) => {
  const { user } = useAuth();
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-8 h-8" />;
      case 'moderate': return <Info className="w-8 h-8" />;
      case 'high': return <AlertTriangle className="w-8 h-8" />;
      default: return <Info className="w-8 h-8" />;
    }
  };

  const parseConfidence = (confidence: number | string): number => {
    return parseFloat(String(confidence)) * 100;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFeatureIcon = (key: string) => {
    switch (key) {
      case 'pauseFrequency': return <Clock className="w-5 h-5" />;
      case 'speechRate': return <Activity className="w-5 h-5" />;
      case 'vocabularyComplexity': return <BookOpen className="w-5 h-5" />;
      case 'semanticFluency': return <Mic className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const confidenceScore = parseConfidence(result.backendData?.confidence || 0);
  let finalPrediction = result.backendData?.finalPrediction || 'Unknown';
  if (finalPrediction === "Control") { finalPrediction = "Healthy"; }
  const riskLevel = result.riskLevel;

  const handleDownloadReport = () => {
    // 1. Create the HTML content for the report
    const reportHtml = `
      <html>
        <head>
          <title>CogniVoice Analysis Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 40px auto; padding: 20px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
            h1, h2 { color: #2A1458; border-bottom: 2px solid #9B177E; padding-bottom: 10px; }
            .header { text-align: center; margin-bottom: 40px; }
            .header p { color: #777; font-size: 0.9em; }
            .section { margin-bottom: 30px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .card { padding: 15px; border-radius: 8px; background-color: #f9f9f9; border: 1px solid #eee; }
            .card h3 { margin-top: 0; color: #9B177E; }
            .disclaimer { font-size: 0.8em; color: #888; text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>CogniVoice Analysis Report</h1>
              <p><strong>Patient:</strong> ${user?.firstName} ${user?.lastName}</p>
              <p><strong>Date of Analysis:</strong> ${new Date(result.timestamp).toUTCString()}</p>
            </div>

            <div class="section">
              <h2>Summary</h2>
              <div class="grid">
                <div class="card">
                  <h3>Overall Risk Level</h3>
                  <p style="font-size: 1.5em; font-weight: bold; text-transform: capitalize;">${result.riskLevel}</p>
                </div>
                <div class="card">
                  <h3>AI Prediction</h3>
                  <p style="font-size: 1.5em; font-weight: bold;">${result.backendData?.finalPrediction === 'Control' ? 'Healthy Pattern' : 'Dementia Pattern'}</p>
                  <p>Confidence: ${Math.round(parseFloat(String(result.backendData?.confidence || '0')) * 100)}%</p>
                </div>
              </div>
            </div>

            <div class="section">
              <h2>Speech Feature Analysis</h2>
              <div class="grid">
                <div class="card"><h3>Pause Frequency</h3><p>${Math.round((result.backendData?.speechfeatures?.pauseFrequency || 0) * 100)}%</p></div>
                <div class="card"><h3>Speech Rate</h3><p>${Math.round((result.backendData?.speechfeatures?.speechRate || 0) * 100)}%</p></div>
                <div class="card"><h3>Vocabulary Complexity</h3><p>${Math.round((result.backendData?.speechfeatures?.vocabularyComplexity || 0) * 100)}%</p></div>
                <div class="card"><h3>Semantic Fluency</h3><p>${Math.round((result.backendData?.speechfeatures?.semanticFluency || 0) * 100)}%</p></div>
              </div>
            </div>

            <div class="section">
              <h2>Recommendations</h2>
              <ul>
                ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
              </ul>
            </div>
            
            <div class="disclaimer">
              <strong>Important Notice:</strong> This analysis is for informational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.
            </div>
          </div>
        </body>
      </html>
    `;

    // 2. Open the HTML in a new window and trigger the print dialog
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(reportHtml);
      reportWindow.document.close();
      reportWindow.focus(); // Required for some browsers
      setTimeout(() => {
        reportWindow.print();
        reportWindow.close();
      }, 500); // A small delay ensures the content is rendered before printing
    } else {
      alert("Please allow pop-ups for this site to download the report.");
    }
  };
  return (
    <DashboardLayout
    title="Analysis Complete"
    subtitle={`Generated on ${new Date(result.timestamp).toLocaleDateString()}`}
  >
    <div className="max-w-5xl mx-auto">
      {/* Header - We can remove the old header as DashboardLayout provides one */}
      <div className="text-center mb-8">
        <button
          onClick={onStartOver}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-[#9B177E] transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Start New Analysis</span>
        </button>
      </div>

        {/* Main Results Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Final Prediction */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center h-full border border-[#FFEAD8]">
              <h2 className="text-xl font-semibold text-[#2A1458] mb-4">Final Prediction</h2>
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                finalPrediction === 'Dementia' ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {finalPrediction === 'Dementia' ? 
                  <AlertTriangle className="w-8 h-8 text-red-600" /> : 
                  <CheckCircle className="w-8 h-8 text-green-600" />
                }
              </div>
              <div className={`text-2xl font-bold mb-2 ${
                finalPrediction === 'Dementia' ? 'text-red-600' : 'text-green-600'
              }`}>
                {finalPrediction}
              </div>
              <p className="text-gray-600 text-sm">
                Based on speech pattern analysis
              </p>
            </div>
          </div>

          {/* Risk Level */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center h-full border border-[#FFEAD8]">
              <h2 className="text-xl font-semibold text-[#2A1458] mb-4">Risk Level</h2>
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${getRiskLevelColor(riskLevel).split(' ')[1]}`}>
                {getRiskIcon(riskLevel)}
              </div>
              <div className={`text-2xl font-bold mb-2 capitalize ${getRiskLevelColor(riskLevel).split(' ')[0]}`}>
                {riskLevel}
              </div>
              <p className="text-gray-600 text-sm">
                Risk assessment level
              </p>
            </div>
          </div>

          {/* Overall Score */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center h-full border border-[#FFEAD8]">
              <h2 className="text-xl font-semibold text-[#2A1458] mb-4">Confidence Score</h2>
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#9B177E"
                    strokeWidth="3"
                    strokeDasharray={`${confidenceScore}, 100`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-[#2A1458]">
                    {Math.round(confidenceScore)}%
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Analysis confidence
              </p>
            </div>
          </div>
        </div>

        {/* Speech Features */}
        {result.backendData?.speechfeatures && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-[#FFEAD8]">
            <h2 className="text-2xl font-semibold text-[#2A1458] mb-6 text-center">Speech Analysis Features</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(result.backendData.speechfeatures).map(([key, value]) => {
                const featureNames: Record<string, string> = {
                  pauseFrequency: 'Pause Frequency',
                  speechRate: 'Speech Rate',
                  vocabularyComplexity: 'Vocabulary Complexity',
                  semanticFluency: 'Semantic Fluency'
                };

                const featureValue = typeof value === 'number' ? value * 100 : parseFloat(String(value));

                return (
                  <div key={key} className="bg-gradient-to-r from-[#FFEAD8]/50 to-[#E8988A]/10 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-gradient-to-r from-[#9B177E] to-[#2A1458] rounded-full p-2">
                        <div className="text-white">
                          {getFeatureIcon(key)}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#2A1458]">
                          {featureNames[key] || key}
                        </h3>
                        <p className="text-2xl font-bold text-[#9B177E]">
                          {Math.round(featureValue)}%
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-[#9B177E] to-[#2A1458] h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${featureValue}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-[#FFEAD8]">
          <h2 className="text-2xl font-semibold text-[#2A1458] mb-6 text-center">Recommendations</h2>
          
          <div className="space-y-4">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-[#FFEAD8] to-[#E8988A]/20 rounded-xl border-l-4 border-[#9B177E]">
                <div className="bg-gradient-to-r from-[#9B177E] to-[#2A1458] rounded-full p-2 mt-1">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <p className="text-[#2A1458] leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#FFEAD8]">
          <h2 className="text-2xl font-semibold text-[#2A1458] mb-6 text-center">Next Steps</h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
          onClick={handleDownloadReport}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#9B177E] to-[#2A1458] hover:from-[#2A1458] hover:to-[#9B177E] text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >              
        <Download className="w-5 h-5" />
              <span>Download Report</span>
            </button>
            
            {/*<button className="flex items-center space-x-2 bg-gradient-to-r from-[#E8988A] to-[#9B177E] hover:from-[#9B177E] hover:to-[#E8988A] text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
              <Share2 className="w-5 h-5" />
              <span>Share with Doctor</span>
            </button>
            */}
            <button 
              onClick={onStartOver}
              className="flex items-center space-x-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Brain className="w-5 h-5" />
              <span>New Analysis</span>
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-[#FFEAD8] to-[#E8988A]/20 border border-[#E8988A]/30 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="w-6 h-6 text-[#9B177E] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[#2A1458] mb-2">Important Notice</h3>
                <p className="text-sm text-[#2A1458]/80 leading-relaxed">
                  This analysis is for informational purposes only and should not replace professional medical advice. 
                  Please consult with a healthcare provider for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResultsScreen;