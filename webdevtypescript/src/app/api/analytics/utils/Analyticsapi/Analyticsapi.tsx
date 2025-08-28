//webdevtypescript\src\app\api\analytics\utils\Analyticsapi\Analyticsapi.tsx
export interface AnalyticsStats {
  totalViews: number;
  uniqueVisitors: number;
  signUps: number;
  avgSessionDuration: string;
  topPages: string[];
  activeUsers: number;
}

export interface PageView {
  id: string;
  page: string;
  views: number;
  uniqueVisitors: number;
  avgTimeSpent: string;
  bounceRate: string;
}

export interface UserActivity {
  id: string;
  type: 'anonymous' | 'registered';
  sessionId?: string;
  userId?: string;
  currentPage: string;
  timeOnPage: string;
  lastActivity: Date;
  totalClicks: number;
}

export interface AnalyticsData {
  stats: AnalyticsStats;
  pageViews: PageView[];
  userActivities: UserActivity[];
}

//Function to fetch analytics data
export const fetchAnalyticsData = async (timeRange: string = '7d'): Promise<AnalyticsData> => {
  const response = await fetch(`/api/analytics/stats?range=${timeRange}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch analytics data: ${response.status}`);
  }

  return response.json();
};

//Function to fetch detailed page analytics
export const fetchPageAnalytics = async (timeRange: string = '7d', searchQuery?: string) => {
  const params = new URLSearchParams();
  params.append('range', timeRange);
  if (searchQuery) {
    params.append('page', searchQuery);
  }

  const response = await fetch(`/api/analytics/pages?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch page analytics: ${response.status}`);
  }

  return response.json();
};