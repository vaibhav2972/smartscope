

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useAnalytics, 
  useSegments, 
  useEngagement, 
  useChurnRisk 
} from '../../hooks/useAnalytics';
import StatCard from '../common/StatCard';
import Card from '../common/Card';
import PieChart from '../charts/PieChart';
import BarChart from '../charts/BarChart';

const Dashboard = () => {
  const navigate = useNavigate();
  const { overview, loading: overviewLoading } = useAnalytics();
  const { segments, loading: segmentsLoading } = useSegments();
  const { engagement, loading: engagementLoading } = useEngagement();
  const { churnRisk, loading: churnLoading } = useChurnRisk();

  const segmentChartData = segments?.clusters ? {
    labels: segments.clusters.map(c => c.label),
    datasets: [{
      data: segments.clusters.map(c => c.size),
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  } : null;

  const engagementChartData = engagement?.leaderboard ? {
    labels: engagement.leaderboard.slice(0, 5).map((u, i) => `#${i + 1}`),
    datasets: [{
      label: 'Score',
      data: engagement.leaderboard.slice(0, 5).map(u => u.score),
      backgroundColor: '#3B82F6',
      borderRadius: 8
    }]
  } : null;

  const churnChartData = churnRisk ? {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [{
      data: [
        churnRisk.low_risk_count || 0,
        churnRisk.medium_risk_count || 0,
        churnRisk.high_risk_count || 0
      ],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  } : null;

  return (
    <div className="bg-gray-950 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-gray-400">
            User behavior intelligence and insights
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={overview?.totalUsers || 0}
            icon="👥"
            color="blue"
          />
          <StatCard
            title="Total Sessions"
            value={overview?.totalSessions || 0}
            icon="📊"
            color="green"
          />
          <StatCard
            title="Active Users"
            value={overview?.activeUsers || 0}
            icon="✨"
            color="purple"
          />
          <StatCard
            title="Avg Duration"
            value={`${overview?.avgSessionDuration || 0}s`}
            icon="⏱️"
            color="orange"
          />
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card 
            title="User Segments" 
            loading={segmentsLoading}
            className="bg-gray-900 border-gray-800"
            actions={
              <button 
                onClick={() => navigate('/analytics/segments')}
                className="px-3 py-1.5 text-sm font-medium text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-colors"
              >
                View Details
              </button>
            }
          >
            {segmentChartData && (
              <div className="mb-6">
                <PieChart data={segmentChartData} />
              </div>
            )}
            {segments && (
              <div className="space-y-3">
                {segments.clusters?.map(cluster => (
                  <div 
                    key={cluster.cluster_id} 
                    className="flex justify-between items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    <span className="font-semibold text-white">
                      {cluster.label}
                    </span>
                    <span className="text-sm text-gray-400">
                      {cluster.size} users ({cluster.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card 
            title="Top Engaged Users" 
            loading={engagementLoading}
            className="bg-gray-900 border-gray-800"
            actions={
              <button 
                onClick={() => navigate('/analytics/engagement')}
                className="px-3 py-1.5 text-sm font-medium text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-colors"
              >
                View Leaderboard
              </button>
            }
          >
            {engagementChartData && (
              <div className="mb-6">
                <BarChart data={engagementChartData} horizontal />
              </div>
            )}
            {engagement?.leaderboard && (
              <div className="space-y-3">
                {engagement.leaderboard.slice(0, 3).map((user, index) => (
                  <div 
                    key={user.user_id} 
                    className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-linear-to-r from-cyan-500 to-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">
                        User {user.user_id}
                      </div>
                      <div className="text-xs text-gray-400">
                        {user.score.toFixed(1)} points
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full font-bold text-sm ${
                      user.grade === 'A' ? 'bg-green-500/20 text-green-400' :
                      user.grade === 'B' ? 'bg-blue-500/20 text-blue-400' :
                      user.grade === 'C' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {user.grade}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card 
            title="Churn Risk Distribution" 
            loading={churnLoading}
            className="bg-gray-900 border-gray-800"
            actions={
              <button 
                onClick={() => navigate('/analytics/churn')}
                className="px-3 py-1.5 text-sm font-medium text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-colors"
              >
                View All
              </button>
            }
          >
            {churnChartData && (
              <div className="mb-6">
                <PieChart data={churnChartData} />
              </div>
            )}
            {churnRisk && (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {churnRisk.low_risk_count || 0}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Low Risk
                  </div>
                </div>
                <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">
                    {churnRisk.medium_risk_count || 0}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Medium Risk
                  </div>
                </div>
                <div className="text-center p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="text-2xl font-bold text-red-400">
                    {churnRisk.high_risk_count || 0}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    High Risk
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card title="Quick Actions" className="bg-gray-900 border-gray-800">
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/analytics/segments')}
                className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-750 border-2 border-transparent hover:border-cyan-500/50 rounded-lg transition-all text-left"
              >
                <div className="w-12 h-12 bg-linear-to-r from-cyan-500 to-indigo-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                  🎯
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">View Segments</h4>
                  <p className="text-sm text-gray-400">Explore user behavioral groups</p>
                </div>
              </button>

              <button 
                onClick={() => navigate('/analytics/recommendations')}
                className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-750 border-2 border-transparent hover:border-indigo-500/50 rounded-lg transition-all text-left"
              >
                <div className="w-12 h-12 bg-linear-to-r from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                  ✨
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">Recommendations</h4>
                  <p className="text-sm text-gray-400">AI-powered suggestions</p>
                </div>
              </button>

              <button 
                onClick={() => navigate('/analytics/rfm')}
                className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-750 border-2 border-transparent hover:border-purple-500/50 rounded-lg transition-all text-left"
              >
                <div className="w-12 h-12 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                  💎
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">RFM Analysis</h4>
                  <p className="text-sm text-gray-400">Customer value segmentation</p>
                </div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;