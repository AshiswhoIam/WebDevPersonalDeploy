// components/ApiStatus.tsx
import { useState, useEffect } from 'react';
import { checkApiHealth } from '../api/utils/route';

//Component that monitors API and model status
const ApiStatus = () => {
  //Initialize status state with default values
  const [status, setStatus] = useState<{
    isOnline: boolean;
    modelLoaded: boolean;
    loading: boolean;
    error: string | null;
  }>({
    isOnline: false,          //API is offline initially
    modelLoaded: false,       //Model not loaded yet
    loading: true,            //We start with a loading state
    error: null,              //No errors at the beginning
  });

  useEffect(() => {
    //Function to check API health status asynchronously
    const checkStatus = async () => {
      try {
        //Start loading and clear previous errors
        setStatus(prev => ({ ...prev, loading: true, error: null }));
        const health = await checkApiHealth();
        setStatus({
          isOnline: true,
          modelLoaded: health.model_loaded,
          loading: false,
          error: null,
        });
      } catch (error) {
        setStatus({
          isOnline: false,
          modelLoaded: false,
          loading: false,
          error: error instanceof Error ? error.message : 'Connection failed',
        });
      }
    };

    checkStatus();
    //Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  //Show loading indicator while checking status
  if (status.loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
        <span className="text-sm">Checking API status...</span>
      </div>
    );
  }
  //Show red status if API is offline
  if (!status.isOnline) {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <span className="text-sm font-medium">API Offline</span>
        <span className="text-xs text-gray-500">
          FastAPI server may not be running on correct port (http://localhost:8000) or deployed server
        </span>
      </div>
    );
  }
  //Show yellow status if model is still loading
  if (!status.modelLoaded) {
    return (
      <div className="flex items-center space-x-2 text-yellow-600">
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <span className="text-sm font-medium">Model Loading...</span>
      </div>
    );
  }

  //Show green status when everything is working
  return (
    <div className="flex items-center space-x-2 text-green-600">
      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      <span className="text-sm font-medium">API Ready</span>
      <span className="text-xs text-gray-500">Model loaded</span>
    </div>
  );
};

export default ApiStatus;