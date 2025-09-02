import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Users, AlertTriangle, CheckCircle, UserPlus, BrainCircuit, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useAdmin } from '../../contexts/AdminContext'; // Correct import path
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard: React.FC = () => {
  // --- THIS IS THE FIX ---
  // We only need `stats` and `activity` from the context for this page.
  const { stats, activity } = useAdmin();
  // --- END OF FIX ---

  const riskData = [
    { name: 'Low Risk', value: stats.riskDistribution.low, color: '#10B981' },
    { name: 'Moderate Risk', value: stats.riskDistribution.moderate, color: '#F59E0B' },
    { name: 'High Risk', value: stats.riskDistribution.high, color: '#EF4444' }
  ];

  const statsCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-[#9B177E] to-[#2A1458]' },
    { title: 'Total Analyses', value: stats.totalAnalyses, icon: BrainCircuit, color: 'from-[#E8988A] to-[#9B177E]' },
    { title: 'Moderate Risk Analyses', value: stats.riskDistribution.moderate, icon: AlertTriangle, color: 'from-yellow-500 to-yellow-600' }, // <-- ADDED THIS CARD
    { title: 'Analyses Today', value: stats.dailyUsage[stats.dailyUsage.length - 1]?.analyses || 0, icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
    { title: 'High Risk Alerts', value: stats.riskDistribution.high, icon: AlertTriangle, color: 'from-red-500 to-red-600' }
  ];

  // --- THIS IS THE FIX ---
  // The old `recentUsers` calculation has been removed.
  // We will map directly over the `activity` array below.
  // --- END OF FIX ---
  
  const getActivityIcon = (type: string) => {
    return type === 'registration' 
      ? <UserPlus className="w-4 h-4 text-white" /> 
      : <BrainCircuit className="w-4 h-4 text-white" />;
  };

  const getRiskBadge = (risk?: string | null) => {
    if (!risk) return null;
    const colors = {
      low: 'bg-green-100 text-green-700',
      moderate: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700'
    };
    return (<span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[risk as keyof typeof colors]}`}>{risk} risk</span>);
  };

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Overview of system analytics and user data">
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {statsCards.map((card, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-[#FFEAD8] hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-r ${card.color} rounded-full p-3`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#2A1458] mb-1">{card.value}</h3>
              <p className="text-gray-600 text-sm">{card.title}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Risk Distribution Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FFEAD8]">
            <h3 className="text-xl font-semibold text-[#2A1458] mb-6">Risk Level Distribution</h3>
            <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  >
                    {riskData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Daily Usage Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FFEAD8]">
            <h3 className="text-xl font-semibold text-[#2A1458] mb-6">Daily Usage Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.dailyUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#666" fontSize={12} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} contentStyle={{ backgroundColor: 'white', border: '1px solid #FFEAD8', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="analyses" stroke="#9B177E" strokeWidth={3} name="Analyses" />
                  <Line type="monotone" dataKey="users" stroke="#E8988A" strokeWidth={3} name="Active Users" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FFEAD8]">
          <h3 className="text-xl font-semibold text-[#2A1458] mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {activity && activity.length > 0 ? (
              activity.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FFEAD8]/30 to-[#E8988A]/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-[#9B177E] to-[#2A1458] rounded-full p-2">
                      {getActivityIcon(item.type)}
                    </div>
                    <div>
                      <p className="font-medium text-[#2A1458]">{item.user_name}</p>
                      <p className="text-sm text-gray-600">{item.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getRiskBadge(item.risk_level)}
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 py-4">No recent activity found.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;