//webdevtypescript\src\app\api\analytics\component\Analyticsprovider\Analyticsprovider.tsx
'use client';
import React from 'react';
import useAnalytics from '../../hook/useAnalytics/useAnalytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  useAnalytics(); // This will automatically track page views and user activity

  return <>{children}</>;
};

export default AnalyticsProvider;