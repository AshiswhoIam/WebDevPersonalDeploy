export const dynamic = 'force-dynamic';
import Header from '../Components/header';
import Footer from '../Components/footer';
import React from 'react';
import styles from './LandingPage.module.css';
import Link from 'next/link';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      {/* Main Content, flex-1 to fill the space */}
      <main className="flex-1">
        {/* Entry Section, relative position to be moved t,r,l,b  , py padding, overflow not to go over container */}
        <section className="relative text-white py-20 overflow-hidden">
          {/* Video Background, abs to pos nearest relative, at top left corner, width and height full, obj cover ensures entire contianer is covered */}
          <video
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            src="S1Main.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Overlay, for readabilty  */}
          <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
          {/*z places stuff above vid and overlay*/}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome To My Domain
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              This website is mainly built using typescript and the next js framework. 
              The specified will serve as a portfolio to display my achievements.
            </p>
          </div>
        </section>

        {/* Section 2 just a general container*/}
        <section className="relative py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute top-0 left-0 w-full h-full">
            <img 
              src="S2Main.png" 
              alt="Background" 
              className="w-full h-full object-cover"
            />
            {/* Optional overlay for better text readability */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/30" />
          </div>
          
          {/* MainS2 Container */}
          <div className="relative z-10 h-full">
            <div className="flex items-center justify-start h-full min-h-[500px]">
              {/* Left Side Text Container, width 100% of parent container, beccomes 50,40,33 on sizes thne just margings on diff screens */}
              <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 mx-4 md:ml-8 md:mr-4 lg:ml-12 lg:mr-8 xl:ml-20 xl:mr-12">
                 {/*backdrop blur is to add small effect on bg, depth for box...  */}
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 shadow-xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                    Professional Summary
                  </h2>
                  {/* mb6 is bottom marning 1.5rem. leading relaxed sets line height for paragraphs to read.*/}
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    I am a motivated and ambitious software engineering graduate with strong programming knowledge across 
                    multiple technologies(Java, Python, React, Next.js, C++ and more). Adept at designing, developing, and 
                    optimizing innovative software solutions. 
                  </p>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    I am passionate about continuous learning and adaptable to 
                    new technologies. Strong communicator with excellent collaboration skills, ensuring seamless 
                    teamwork and efficient task execution.
                  </p>
                  <Link href="/Academics">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    View My Academics
                  </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3  */}
        <section className="relative py-20 overflow-hidden">
          {/* Fullscreen Video Background */}
          <video
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            src="/S3Vid2.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Content Container z-index */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              <span>Take a look at some</span><br />
              <span>of</span><br />
              <span>the work I've done</span>
            </h2>
            {/* Section 3 making 3 col 1 row*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/*group enables gp hover, round on large border, medium shadowing, hiden content that overflows, smooth trans, hover scale slighty make bigger on hover */}
              <div className="group rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 bg-white">
                <a href="/Capstone" className="block relative">
                  <img src="/CapstoneImg.png" alt="Capstone Development" className="w-full h-64 object-cover" />
                    {/* inset sets t,r,b,k to 0,parent fills, opac for transparent, when group hover then opac, */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <h3 className="text-white text-xl font-semibold">Capstone Development</h3>
                    </div>
                </a>
              <p className="mt-4 text-gray-700 text-center p-4">The capstone project involved developing a web application in collaboration with a stakeholder.</p>
              </div>

              <div className="group rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 bg-white">
                <a href="/AiModel" className="block relative">
                  <img src="/AiImg.png" alt="Ai Development" className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <h3 className="text-white text-xl font-semibold">Ai Model Development</h3>
                    </div>
                </a>
              <p className="mt-4 text-gray-700 text-center p-4">Different AI models that I've developed overtime: An image classifier & an facial expression classifer (privated) .</p>
              </div>       
              <div className="group rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 bg-white">
                <a href="/Chess" className="block relative">
                  <img src="/ChessImg.png" alt="Capstone Development" className="w-full h-64 object-contain bg-gray-900" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <h3 className="text-white text-xl font-semibold">Chess</h3>
                    </div>
                </a>
              <p className="mt-4 text-gray-700 text-center p-4">A chess game development project using C++ and SFML.</p>
              </div>
            </div>
          </div>
        </section>
        {/* Section 4 bg with centered text */}
        <section className="py-54 bg-[url('/S4Main2.png')] bg-cover bg-center bg-no-repeat relative">
          {/* Subtle overlay for contrast */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Content wrapper */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fadeIn">
            <h3 className={`text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg ${styles.heroText}`}>
              An inspirational quote that keeps me going
            </h3>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6 opacity-75" />
            <blockquote className={`text-xl md:text-2xl font-semibold italic text-white max-w-2xl mx-auto ${styles.quoteText}`}>
              “Discipline is doing what you hate to do, but doing it like you love it.” <br /> — Mike Tyson
            </blockquote>
          </div>
        </section>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;

