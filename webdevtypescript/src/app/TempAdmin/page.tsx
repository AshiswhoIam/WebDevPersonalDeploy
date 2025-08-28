//webdevtypescript\src\app\TempAdmin\page.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../Components/header';
import Footer from '../Components/footer';

const AdminSetupPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleBackToHome = () => {
    router.push('/');
  };

  const setupIndexes = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('/api/analytics/setup-indexes', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'Setup failed');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Setup failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkIndexStatus = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('/api/analytics/setup-indexes', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'Status check failed');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Status check failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header at the top with high z-index */}
      <div className="relative z-50">
        <Header />
      </div>
      
      {/* Setup content */}
      <div className="p-4" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="absolute inset-0 opacity-50 z-0"></div>
        
        <div className="relative z-20 max-w-4xl mx-auto py-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
            {/* Header Section */}
            <div className="mb-8">
              <button
                onClick={handleBackToHome}
                className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-6 group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {/* Settings Icon */}
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Analytics Setup</h1>
                <p className="text-gray-300">Configure TTL indexes for analytics tracking</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={setupIndexes}
                  disabled={isLoading}
                  className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                  Setup TTL Indexes
                </button>

                <button
                  onClick={checkIndexStatus}
                  disabled={isLoading}
                  className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  )}
                  Check Status
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Error:</span>
                </div>
                <p className="mt-1">{error}</p>
              </div>
            )}

            {/* Result Display */}
            {result && (
              <div className="space-y-4">
                <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">Success:</span>
                  </div>
                  <p>{result.message}</p>
                </div>

                {/* Setup Results */}
                {result.results && (
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Setup Results:</h3>
                    <ul className="space-y-2">
                      {result.results.map((item: string, index: number) => (
                        <li key={index} className="flex items-start text-gray-300">
                          <span className="mr-2 mt-1">{item.startsWith('✓') ? '✅' : '❌'}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Index Information */}
                {result.indexes && (
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Current Indexes:</h3>
                    <div className="space-y-2">
                      {result.indexes.map((index: any, idx: number) => (
                        <div key={idx} className="p-3 bg-white/5 rounded-lg">
                          <div className="text-white font-medium">{index.name}</div>
                          <div className="text-sm text-gray-400">
                            TTL: {index.expireAfterSeconds === 'none' ? 'Not set' : `${index.expireAfterSeconds}s`}
                          </div>
                          <div className="text-sm text-gray-400">
                            Unique: {index.unique ? 'Yes' : 'No'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collection Stats */}
                {result.collectionStats && (
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Collection Stats:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">{result.collectionStats.count}</div>
                        <div className="text-sm text-gray-400">Documents</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">{result.collectionStats.size}</div>
                        <div className="text-sm text-gray-400">Size</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">{result.collectionStats.avgObjSize}</div>
                        <div className="text-sm text-gray-400">Avg Size</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sample Documents */}
                {result.sampleDocuments && result.sampleDocuments.length > 0 && (
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Sample Documents:</h3>
                    <div className="space-y-2">
                      {result.sampleDocuments.map((doc: any, idx: number) => (
                        <div key={idx} className="p-3 bg-white/5 rounded-lg text-sm">
                          <div className="text-white">{doc.page}</div>
                          <div className="text-gray-400">
                            {doc.visitorType} • Expires in: {doc.timeUntilExpiry}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Instructions:</h3>
              <ol className="space-y-2 text-gray-300 text-sm">
                <li>1. Click "Setup TTL Indexes" to create the database indexes (run once)</li>
                <li>2. Click "Check Status" to verify the indexes are working</li>
                <li>3. After successful setup, you can delete this page</li>
                <li>4. The TTL will automatically clean up visitor records after 24 hours</li>
              </ol>
            </div>

            {/* Warning */}
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <div className="flex items-center text-yellow-300">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="font-semibold">Admin Only:</span>
              </div>
              <p className="text-yellow-300 text-sm mt-1">
                This page should only be accessible to administrators. Remove it after setup is complete.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminSetupPage;