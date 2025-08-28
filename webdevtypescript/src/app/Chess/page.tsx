"use client";
import React from 'react';
import Header from '../Components/header';
import Footer from '../Components/footer';

const Chess: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-gray-800 to-black overflow-hidden" style={{ minHeight: 'calc(100vh - 80px)' }}>
          {/* Chess pattern background */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 h-full w-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={`${
                    Math.floor(i / 8) % 2 === i % 2 ? 'bg-white' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Animated chess pieces */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 text-6xl text-white/20 animate-pulse">♔</div>
            <div className="absolute top-32 right-20 text-5xl text-white/15 animate-bounce">♕</div>
            <div className="absolute bottom-40 left-20 text-4xl text-white/20 animate-pulse">♗</div>
            <div className="absolute bottom-60 right-32 text-5xl text-white/15 animate-bounce">♘</div>
            <div className="absolute top-60 left-1/4 text-3xl text-white/10 animate-pulse">♖</div>
            <div className="absolute bottom-20 right-10 text-4xl text-white/20 animate-bounce">♙</div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 py-20">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                ♔ Chess Game ♕
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                A sophisticated chess application built with modern web technologies. 
                Experience strategic gameplay with intelligent AI opponents (TBD) and unique design.
              </p>
            </div>

            {/* Video Container */}
            <div className="w-full max-w-4xl mx-auto">
              <div className="relative bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-inner">
                  {/* Replace this with your actual video */}
                  <video 
                    className="w-full h-full object-cover"
                    controls
                  >
                    <source src="/ChessDemo.mp4" type="video/mp4" />
                    {/* Fallback for browsers that don't support video */}
                    <div className="flex items-center justify-center h-full bg-gray-800 text-white">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎥</div>
                        <p className="text-xl">Video not supported in your browser</p>
                        <p className="text-sm text-gray-400 mt-2">Please use a modern browser to view the demo</p>
                      </div>
                    </div>
                  </video>
                </div>
                
                {/* Video description */}
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-semibold text-white mb-3">Game Demonstration</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Watch this demonstration showcasing the chess game's features, AI strategy (TBD), 
                    and user interface design. See how pieces move, special rules implementation, 
                    and the overall gaming experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="text-xl font-semibold text-white mb-2">Strategic AI(TBD)</h4>
                <p className="text-gray-300 text-sm">
                  Intelligent computer opponent with multiple difficulty levels
                </p>
              </div>
              
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-4xl mb-4">✨</div>
                <h4 className="text-xl font-semibold text-white mb-2">Modern UI</h4>
                <p className="text-gray-300 text-sm">
                  Clean, responsive interface with smooth animations
                </p>
              </div>
              
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-semibold text-white mb-2">Real-time</h4>
                <p className="text-gray-300 text-sm">
                  Instant move validation and game state updates
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <a
                href="https://github.com/AshiswhoIam/Chess-Game"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="flex items-center">
                  View Source Code
                  <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.334-5.466-5.933 0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.874.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.804 5.625-5.475 5.922.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </span>
              </a>
              
              <button
                onClick={() => alert('Integration will happen once the game is fully polished, demo will be available at a future date.')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
              >
                Play Live Demo
              </button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Chess;