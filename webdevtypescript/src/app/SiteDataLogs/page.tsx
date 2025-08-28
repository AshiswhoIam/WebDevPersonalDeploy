"use client";
import React, { useState, useEffect } from 'react';
import Header from '../Components/header';

//Types matching your actual API responses
interface AnalyticsStats {
  totalViews: number;
  uniqueVisitors: number;
  signUps: number;
  avgSessionDuration: string;
  topPages: string[];
  activeUsers: number;
  registeredUsers: number;
  anonymousUsers: number;
  registeredPercentage: number;
  anonymousPercentage: number;
}

interface PageView {
  id: string;
  page: string;
  views: number;
  uniqueVisitors: number;
  avgTimeSpent: string;
  bounceRate: string;
  totalClicks: number;
  registeredUsers: number;
  anonymousUsers: number;
}

interface UserActivity {
  id: string;
  type: 'anonymous' | 'registered';
  sessionId?: string;
  userId?: string;
  currentPage: string;
  timeOnPage: string;
  lastActivity: Date;
  totalClicks: number;
}

interface AnalyticsData {
  stats: AnalyticsStats;
  pageViews: PageView[];
  userActivities: UserActivity[];
}

//API functions
const fetchAnalyticsData = async (timeRange: string = '7d'): Promise<AnalyticsData> => {
  const response = await fetch(`/api/analytics/stats?range=${timeRange}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch data' }));
    throw new Error(errorData.message || `Failed to fetch analytics data: ${response.status}`);
  }

  return response.json();
};

const AnalyticsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const analyticsData = await fetchAnalyticsData(timeRange);
      setData(analyticsData);
    } catch (error: any) {
      console.error('Failed to load analytics:', error);
      setError(error.message || 'Failed to load analytics data. Please check your permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (!num) return '0';
    return new Intl.NumberFormat().format(num);
  };

  const getTimeRangeLabel = (range: string): string => {
    switch (range) {
      case '1d': return 'Last 24 Hours';
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      default: return 'Last 7 Days';
    }
  };

  const filteredPageViews = data?.pageViews?.filter(page =>
    page.page.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">Analytics Error</div>
            <p className="text-gray-300 mb-6">{error}</p>
            <button 
              onClick={loadAnalyticsData}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  //Default data structure if data is null
  const defaultData: AnalyticsData = {
    stats: {
      totalViews: 0,
      uniqueVisitors: 0,
      signUps: 0,
      avgSessionDuration: '0s',
      topPages: [],
      activeUsers: 0,
      registeredUsers: 0,
      anonymousUsers: 0,
      registeredPercentage: 0,
      anonymousPercentage: 0
    },
    pageViews: [],
    userActivities: []
  };

  const displayData = data || defaultData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="relative z-50">
        <Header />
      </div>
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Site Data Logs</h1>
              <p className="text-gray-300">Track page views, user activity, and website performance</p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none [&>option]:bg-slate-800 [&>option]:text-white"
              >
                <option value="1d" className="bg-slate-800 text-white">Last 24 Hours</option>
                <option value="7d" className="bg-slate-800 text-white">Last 7 Days</option>
                <option value="30d" className="bg-slate-800 text-white">Last 30 Days</option>
                <option value="90d" className="bg-slate-800 text-white">Last 90 Days</option>
              </select>
              
              <button
                onClick={loadAnalyticsData}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-400">
            Showing data for: {getTimeRangeLabel(timeRange)}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={loadAnalyticsData}
              className="ml-4 px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Retry'}
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Views</p>
                <p className="text-white text-2xl font-bold">{formatNumber(displayData.stats.totalViews)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Unique Visitors</p>
                <p className="text-white text-2xl font-bold">{formatNumber(displayData.stats.uniqueVisitors)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">New Sign Ups</p>
                <p className="text-white text-2xl font-bold">{formatNumber(displayData.stats.signUps)}</p>
                <p className="text-xs text-gray-400 mt-1">{getTimeRangeLabel(timeRange)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Active Users</p>
                <p className="text-white text-2xl font-bold">{formatNumber(displayData.stats.activeUsers)}</p>
                <p className="text-xs text-gray-400 mt-1">Last 30 minutes</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Page Views Table */}
          <div className="lg:col-span-2">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Page Performance</h2>
                  {/* Search */}
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search pages..."
                      className="w-48 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-6 text-gray-300 text-sm font-medium">Page</th>
                      <th className="text-left py-3 px-6 text-gray-300 text-sm font-medium">Views</th>
                      <th className="text-left py-3 px-6 text-gray-300 text-sm font-medium">Unique</th>
                      <th className="text-left py-3 px-6 text-gray-300 text-sm font-medium">Clicks</th>
                      <th className="text-left py-3 px-6 text-gray-300 text-sm font-medium">Registered</th>
                      <th className="text-left py-3 px-6 text-gray-300 text-sm font-medium">Anonymous</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPageViews.length > 0 ? filteredPageViews.map((page) => (
                      <tr key={page.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <span className="text-white font-medium truncate max-w-xs block" title={page.page}>
                            {page.page}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-300">{formatNumber(page.views)}</td>
                        <td className="py-4 px-6 text-gray-300">{formatNumber(page.uniqueVisitors)}</td>
                        <td className="py-4 px-6 text-gray-300">{formatNumber(page.totalClicks || 0)}</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                            {formatNumber(page.registeredUsers || 0)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300">
                            {formatNumber(page.anonymousUsers || 0)}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="py-8 px-6 text-center text-gray-400">
                          {searchTerm ? 'No pages found matching your search' : 'No page data available'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* User Activities and Distribution */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Distribution Chart */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">User Distribution</h2>
              
              {/* Circle Chart */}
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="8"
                    />
                    {/* Anonymous Users Arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="rgb(156, 163, 175)"
                      strokeWidth="8"
                      strokeDasharray={`${Math.PI * 2 * 40 * (displayData.stats.anonymousPercentage / 100)} ${Math.PI * 2 * 40}`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                    {/* Registered Users Arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="8"
                      strokeDasharray={`${Math.PI * 2 * 40 * (displayData.stats.registeredPercentage / 100)} ${Math.PI * 2 * 40}`}
                      strokeDashoffset={`-${Math.PI * 2 * 40 * (displayData.stats.anonymousPercentage / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-white">{formatNumber(displayData.stats.uniqueVisitors)}</span>
                    <span className="text-xs text-gray-300">Unique Users</span>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-white text-sm font-medium">Registered</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{formatNumber(displayData.stats.registeredUsers)}</div>
                      <div className="text-gray-400 text-xs">{displayData.stats.registeredPercentage}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="text-white text-sm font-medium">Anonymous</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{formatNumber(displayData.stats.anonymousUsers)}</div>
                      <div className="text-gray-400 text-xs">{displayData.stats.anonymousPercentage}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Pages */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Top Pages</h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {displayData.stats.topPages && displayData.stats.topPages.length > 0 ? (
                  displayData.stats.topPages.map((page, index) => {
                    const pageData = displayData.pageViews.find(p => p.page === page);
                    return (
                      <div key={page} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">#{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium truncate" title={page}>
                            {page}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {formatNumber(pageData?.views || 0)} views • {formatNumber(pageData?.totalClicks || 0)} clicks
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 01-2 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <div>No page data available</div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Total Pages Tracked</span>
                  <span className="text-white font-medium">{displayData.pageViews.length}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300">Avg. Views per Page</span>
                  <span className="text-white font-medium">
                    {displayData.pageViews.length > 0 
                      ? formatNumber(Math.round(displayData.stats.totalViews / displayData.pageViews.length))
                      : '0'
                    }
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300">Total Clicks Tracked</span>
                  <span className="text-white font-medium">
                    {formatNumber(displayData.pageViews.reduce((sum, page) => sum + (page.totalClicks || 0), 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;