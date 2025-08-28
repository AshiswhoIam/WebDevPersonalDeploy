"use client";
import React, { useState } from 'react';
import Header from '../Components/header';
import Footer from '../Components/footer';
import FileUpload from '../Components/fileupload';
import ApiStatus from '../Components/statusaiapi';
import { usePokemonPrediction } from '../api/customHook/route';

const AiModel: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadedData, setLoadedData] = useState<string | null>(null);
  const [showDataPopup, setShowDataPopup] = useState<boolean>(false);
  const { prediction, loading, error, predict, reset } = usePokemonPrediction();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    reset(); //Clear previous results when a new file is selected
  };

  const handlePredict = async () => {
    if (!selectedFile) return;
    try {
      await predict(selectedFile);
    } catch (err) {
      //Error is already handled in the hook
      console.error('Prediction failed:', err);
    }
  };

  const handleLoadData = async () => {
    try {
      //Txt data
      const response = await fetch('/classification_report27.txt');
      if (!response.ok) {
        throw new Error('Failed to load data file');
      }
      const text = await response.text();
      setLoadedData(text);
      setShowDataPopup(true);
      console.log('Data loaded:', text);
    } catch (err) {
      console.error('Error loading data:', err);
      //If ever error
      alert('Failed to load txt classification data file. Please check if the file exists.');
    }
  };

  const closePopup = () => {
    setShowDataPopup(false);
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('/AiBg.jpg')`
      }}
    >
      {/* Header */}
      <Header />

      {/* AI Precision Info Box - Responsive with better spacing */}
      <div className="absolute top-20 right-2 sm:right-4 lg:right-8 z-20 bg-black bg-opacity-80 backdrop-blur-md text-white px-2 sm:px-3 lg:px-4 py-2 rounded-xl shadow-lg text-xs sm:text-sm font-medium max-w-[180px] sm:max-w-[250px] lg:max-w-none">
        <div className="break-words">
          <span className="hidden lg:inline">This AI Model has a </span>
          <span className="hidden sm:inline lg:hidden">AI Model: </span>
          <span className="text-green-400 font-bold">68.06%</span>
          <span className="hidden sm:inline"> accuracy</span>
        </div>
      </div>

      {/* Classification Info Button - Same style as accuracy box */}
      <div className="absolute top-32 sm:top-36 right-2 sm:right-4 lg:right-8 z-20">
        <button
          onClick={handleLoadData}
          className="bg-black bg-opacity-80 backdrop-blur-md text-white px-2 sm:px-3 lg:px-4 py-2 rounded-xl shadow-lg text-xs sm:text-sm font-medium max-w-[180px] sm:max-w-[250px] lg:max-w-none hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
        >
          <div className="break-words">
            <span className="hidden lg:inline">View </span>
            <span className="hidden sm:inline lg:hidden">View </span>
            <span className="text-purple-400 font-bold">Classification</span>
            <span className="hidden sm:inline"> Report</span>
          </div>
        </button>
      </div>
      
      {/* Main Content - Fixed height sections to prevent layout shifts */}
      <main className="flex-1 flex flex-col items-center p-8 min-h-[1200px]">
        {/* Title Section - Moved down to avoid overlap */}
        <div className="mb-8 text-center mt-16 sm:mt-12 lg:mt-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-2xl mb-2">
            Welcome to My Personal Made AI Image Identifier for Gen 1 Pokemons 
          </h1>
          <div className="w-32 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        <p className="text-sm font-semibold text-white text-center -mt-4 max-w-3xl mx-auto leading-relaxed">
          *Note: may take some time to load due to free tier services. Functionality may depend on server availability.
        </p>


        {/* API Status Section */}
        <div className="mb-6 p-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg">
          <div className="text-white font-semibold mb-2">API Status:</div>
          <ApiStatus />
        </div>
        
        {/* Upload Section - Fixed container */}
        <div className="relative max-w-lg w-full mb-8">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm rounded-2xl h-[400px]"></div>
          <div className="relative z-10 p-6 h-[400px]">
            <FileUpload 
              onFileSelect={handleFileSelect}
              accept="image/*"
              maxSizeMB={10}
              disabled={loading}
            />
          </div>
        </div>

        {/* Prediction Button Section - Cool outlined box */}
        <div className="w-full max-w-lg h-20 flex items-center justify-center mb-8 relative z-10">
          {selectedFile && (
            <div className="relative">
              {/* Animated border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              
              {/* Button container with cool border */}
              <div className="relative bg-black bg-opacity-80 backdrop-blur-sm border-2 border-blue-500 rounded-xl p-4 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl"></div>
                
                <button
                  onClick={handlePredict}
                  disabled={loading}
                  className="relative px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl border border-blue-400"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Predicting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Predict Pokemon</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Section - Fixed space */}
        {error && (
          <div className="w-full max-w-lg mb-4 flex items-center justify-center">
            <div className="w-full p-4 bg-red-500 bg-opacity-90 backdrop-blur-sm border border-red-400 text-white rounded-lg">
              <h3 className="font-semibold">Error:</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="w-full max-w-2xl min-h-[600px] -mt-4">
          {prediction && (
            <div className="p-6 bg-black bg-opacity-70 backdrop-blur-sm rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Prediction Results</h2>
              
              <div className="space-y-6 text-white">
                {/* Main Prediction */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {prediction.predicted_pokemon}
                  </div>
                  <div className="text-xl">
                    Confidence: <span className="text-green-400 font-semibold">
                      {(prediction.confidence * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                {/* Pokemon Details */}
                {prediction.pokemon_info && (
                  <div className="bg-white bg-opacity-10 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-center text-blue-300">
                      Pokemon Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <span className="text-blue-300 font-semibold">Name:</span>
                          <span className="ml-2 font-medium text-yellow-300">
                            {prediction.pokemon_info.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-300 font-semibold">Types:</span>
                          <span className="ml-2 font-medium text-green-300">
                            {prediction.pokemon_info.types}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-300 font-semibold">Height:</span>
                          <span className="ml-2 font-medium text-purple-300">
                            {prediction.pokemon_info.height}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-300 font-semibold">Weight:</span>
                          <span className="ml-2 font-medium text-orange-300">
                            {prediction.pokemon_info.weight}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-300 font-semibold">Habitat:</span>
                          <span className="ml-2 font-medium text-pink-300">
                            {prediction.pokemon_info.habitat}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-center items-start">
                        {prediction.pokemon_info.sprite_url && (
                          <div className="text-center">
                            <img
                              src={prediction.pokemon_info.sprite_url}
                              alt={`${prediction.pokemon_info.name} sprite`}
                              className="w-32 h-32 mx-auto mb-2 bg-white bg-opacity-20 rounded-lg p-2"
                            />
                            <p className="text-sm text-gray-300">Official Sprite</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Flavor Text */}
                    <div className="mt-6">
                      <div className="text-blue-300 font-semibold mb-2">Flavor Text:</div>
                      <p className="text-sm text-white leading-relaxed bg-black bg-opacity-50 p-4 rounded-lg border border-gray-600">
                        {prediction.pokemon_info.flavor_text}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <Footer />

      {/* Data Popup Overlay */}
      {showDataPopup && loadedData && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-2xl border-2 border-purple-500 shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col overflow-hidden">
            {/* Popup Header */}
            <div className="flex items-center justify-center p-6 border-b border-gray-700 flex-shrink-0">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Loaded Data
              </h3>
            </div>

            {/* Popup Content - Fixed scrolling issue */}
            <div className="flex-1 p-6 overflow-hidden">
              <div 
                className="w-full h-full bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg border border-gray-600 overflow-auto max-h-[60vh]"
                style={{ 
                  scrollbarWidth: 'auto',
                  scrollbarColor: '#8b5cf6 #374151'
                }}
              >
                <pre className="whitespace-pre-wrap text-gray-200 text-sm font-mono leading-relaxed p-4">
                  {loadedData}
                </pre>
              </div>
            </div>

            {/* Popup Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-700 flex-shrink-0">
              <div className="text-sm text-gray-400">
                {loadedData.split('\n').length} lines • {loadedData.length} characters
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={closePopup}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiModel;