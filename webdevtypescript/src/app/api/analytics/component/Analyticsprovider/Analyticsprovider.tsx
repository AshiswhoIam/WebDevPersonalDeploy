//webdevtypescript\src\app\api\analytics\component\Analyticsprovider\Analyticsprovider.tsx
'use client';
import React from 'react';
import useAnalytics from '../../hook/useAnalytics/useAnalytics';

//Wraps app components to automatically track analytics
interface AnalyticsProviderProps {
  children: React.ReactNode; //Components wrapped Children = any jsx element inside component
}

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  useAnalytics(); //Hook that tracks page views and user activity automatically

  return <>{children}</>;//React Fragment invis container Render wrapped components
};

export default AnalyticsProvider;