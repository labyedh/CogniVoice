import React, { useState, useEffect } from 'react';
import { Calendar, Download, Eye, Search, TrendingUp, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { LegacyAnalysisResult } from '../types';
import { getHistory, exportHistory } from '../api/user'; // <-- IMPORT exportHistory

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<LegacyAnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false); // <-- Add state for export button

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'moderate' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'risk'>('date');

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'moderate': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <CheckCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      case 'moderate': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
        await exportHistory();
    } catch (error) {
        console.error("Export failed:", error);
        alert("Could not export your history. Please try again.");
    } finally {
        setIsExporting(false);
    }
};
  const filteredHistory = history
    .filter(item => filterRisk === 'all' || item.riskLevel === filterRisk)
    .filter(item =>
      item.backendData?.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recommendations.some(rec => rec.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else {
        const riskOrder = { high: 3, moderate: 2, low: 1 };
        return (riskOrder[b.riskLevel as keyof typeof riskOrder] || 0) - (riskOrder[a.riskLevel as keyof typeof riskOrder] || 0);
      }
    });


  if (isLoading) {
    return (
      <DashboardLayout title="Analysis History" subtitle="Loading your assessment history...">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#9B177E]" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (error) {
      return (
          <DashboardLayout title="Analysis History" subtitle="An error occurred">
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
              </div>
          </DashboardLayout>
      );
  }

  // --- Main Component Return ---
  // This is the final return when there is no loading and no error.
  return (
    <DashboardLayout title="Analysis History" subtitle="Track your cognitive health assessments over time">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
            {/* Total Analyses */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#FFEAD8]">
                <div className="flex items-center space-x-3">
                    <div className="bg-[#9B177E]/10 rounded-full p-2"><TrendingUp className="w-6 h-6 text-[#9B177E]" /></div>
                    <div>
                        <p className="text-2xl font-bold text-[#2A1458]">{history.length}</p>
                        <p className="text-sm text-gray-600">Total Analyses</p>
                    </div>
                </div>
            </div>
            {/* Low Risk */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#FFEAD8]">
                <div className="flex items-center space-x-3">
                    <div className="bg-green-100 rounded-full p-2"><CheckCircle className="w-6 h-6 text-green-600" /></div>
                    <div>
                        <p className="text-2xl font-bold text-[#2A1458]">{history.filter(h => h.riskLevel === 'low').length}</p>
                        <p className="text-sm text-gray-600">Low Risk</p>
                    </div>
                </div>
            </div>
            {/* Moderate Risk */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#FFEAD8]">
                <div className="flex items-center space-x-3">
                    <div className="bg-yellow-100 rounded-full p-2"><AlertTriangle className="w-6 h-6 text-yellow-600" /></div>
                    <div>
                        <p className="text-2xl font-bold text-[#2A1458]">{history.filter(h => h.riskLevel === 'moderate').length}</p>
                        <p className="text-sm text-gray-600">Moderate Risk</p>
                    </div>
                </div>
            </div>
            {/* High Risk */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#FFEAD8]">
                <div className="flex items-center space-x-3">
                    <div className="bg-red-100 rounded-full p-2"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
                    <div>
                        <p className="text-2xl font-bold text-[#2A1458]">{history.filter(h => h.riskLevel === 'high').length}</p>
                        <p className="text-sm text-gray-600">High Risk</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-[#FFEAD8]">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input type="text" placeholder="Search analyses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B177E] focus:border-transparent" />
                    </div>
                    <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B177E] focus:border-transparent">
                        <option value="all">All Risk Levels</option>
                        <option value="low">Low Risk</option>
                        <option value="moderate">Moderate Risk</option>
                        <option value="high">High Risk</option>
                    </select>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B177E] focus:border-transparent">
                        <option value="date">Sort by Date</option>
                        <option value="risk">Sort by Risk Level</option>
                    </select>
                </div>
                <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center justify-center w-36 space-x-2 bg-gradient-to-r from-[#9B177E] to-[#2A1458] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export All</span>
                </>
              )}
            </button>
            </div>
        </div>

        {/* History List */}
        <div className="space-y-6">
            {filteredHistory.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-[#FFEAD8]">
                    <div className="bg-[#FFEAD8] rounded-full p-4 w-16 h-16 mx-auto mb-4"><Calendar className="w-8 h-8 text-[#9B177E]" /></div>
                    <h3 className="text-xl font-semibold text-[#2A1458] mb-2">No analyses found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria, or complete a new analysis.</p>
                </div>
            ) : (
                filteredHistory.map((analysis) => (
                    <div key={analysis.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#FFEAD8] overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    {getRiskIcon(analysis.riskLevel)}
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#2A1458]">{analysis.backendData?.fileName || 'Analysis'}</h3>
                                        <p className="text-sm text-gray-600">{formatDate(analysis.timestamp)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(analysis.riskLevel)}`}>
                                        {analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)} Risk
                                    </span>
                                    {/* These buttons can be implemented later */}
                                    <button className="p-2 text-gray-400 hover:text-[#9B177E] transition-colors duration-200"><Eye className="w-4 h-4" /></button>
                                    <button className="p-2 text-gray-400 hover:text-[#9B177E] transition-colors duration-200"><Download className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Analysis Results */}
                                <div>
                                    <h4 className="font-semibold text-[#2A1458] mb-3">Analysis Results</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Prediction:</span>
                                            <span className="text-sm font-medium text-[#2A1458]">{analysis.backendData?.finalPrediction === 'Control' ? 'Healthy' : analysis.backendData?.finalPrediction}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Confidence:</span>
                                            <span className="text-sm font-medium text-[#2A1458]">{Math.round(parseFloat(String(analysis.backendData?.confidence || '0')) * 100)}%</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Speech Features */}
                                <div>
                                    <h4 className="font-semibold text-[#2A1458] mb-3">Speech Features</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="text-center p-2 bg-[#FFEAD8]/30 rounded-lg">
                                            <div className="text-xs text-gray-600">Pause Freq.</div>
                                            <div className="font-medium text-[#2A1458]">{Math.round((analysis.backendData?.speechfeatures?.pauseFrequency || 0) * 100)}%</div>
                                        </div>
                                        <div className="text-center p-2 bg-[#E8988A]/20 rounded-lg">
                                            <div className="text-xs text-gray-600">Speech Rate</div>
                                            <div className="font-medium text-[#2A1458]">{Math.round((analysis.backendData?.speechfeatures?.speechRate || 0) * 100)}%</div>
                                        </div>
                                        <div className="text-center p-2 bg-[#9B177E]/20 rounded-lg">
                                            <div className="text-xs text-gray-600">Vocabulary</div>
                                            <div className="font-medium text-[#2A1458]">{Math.round((analysis.backendData?.speechfeatures?.vocabularyComplexity || 0) * 100)}%</div>
                                        </div>
                                        <div className="text-center p-2 bg-[#2A1458]/20 rounded-lg">
                                            <div className="text-xs text-gray-600">Fluency</div>
                                            <div className="font-medium text-white">{Math.round((analysis.backendData?.speechfeatures?.semanticFluency || 0) * 100)}%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Recommendations */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <h4 className="font-semibold text-[#2A1458] mb-2">Recommendations</h4>
                                <ul className="space-y-1">
                                    {analysis.recommendations.map((rec, index) => (
                                        <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                                            <span className="text-[#9B177E] mt-1">•</span>
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </DashboardLayout>
  );
};

export default HistoryPage;