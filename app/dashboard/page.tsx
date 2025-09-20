'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportTable from '@/components/ReportTable';
import { BarChart3, FileText, TrendingUp } from 'lucide-react';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';

// Add export const dynamic for Next.js
export const dynamic = 'force-dynamic';

interface DashboardStats {
  totalReports: number;
  cancerPositive: number;
  averageConfidence: number;
  positiveAverageConfidence?: number;
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    cancerPositive: 0,
    averageConfidence: 0,
    positiveAverageConfidence: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch latest statistics
        const statsResponse = await axios.get('/api/dashboard/stats');
        if (statsResponse.data) {
          setStats(statsResponse.data);
        }

        // If there's a sessionId, fetch that specific report
        if (sessionId) {
          const reportResponse = await axios.get(`/api/report/${sessionId}`);
          console.log('Latest report:', reportResponse.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Use default values on error
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch on client-side
    if (typeof window !== 'undefined') {
      fetchDashboardData();
    }
  }, [sessionId]);
  
  const statCards = [
    {
      name: 'Total Reports',
      value: stats.totalReports?.toString() ?? '0',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Cancer Positive',
      value: stats.cancerPositive?.toString() ?? '0',
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      name: 'Average Confidence',
      value: stats.averageConfidence ? `${stats.averageConfidence.toFixed(1)}%` : '0%',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Positive Avg Confidence',
      value: stats.positiveAverageConfidence ? `${(stats.positiveAverageConfidence || 0).toFixed(1)}%` : '0%',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reports Dashboard</h1>
            <p className="text-gray-600">Monitor and manage your medical report analyses</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.name}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center">
                    <div className={`${stat.bgColor} p-3 rounded-xl`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoading ? "Loading..." : stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reports Table */}
          <ReportTable />
        </div>
      </div>
    </ProtectedRoute>
  );
}