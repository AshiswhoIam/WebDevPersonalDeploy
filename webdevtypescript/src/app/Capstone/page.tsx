import React from 'react';
import Header from '../Components/header';
import Footer from '../Components/footer';

const Capstone: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* Section 1 */}
        <section className="relative h-96 bg-[url('/CapstoneBg.jpg')] bg-cover bg-center bg-no-repeat">
          {/*overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Center Text */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Capstone Project
              </h1>
              <p className="text-xl md:text-2xl mb-8 leading-relaxed">
                A comprehensive web application developed in collaboration with real-world stakeholders, 
                demonstrating practical software engineering skills and industry best practices.
              </p>
              <div className="text-lg md:text-xl font-semibold">
                Full-Stack Development | Team Collaboration | Stakeholder Management
              </div>
            </div>
          </div>
        </section>
        {/* Section 2 */}
        <section className="py-16 bg-gradient-to-br from-black via-red-900 to-black text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Name */}
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-6">
              Capstone Development
            </h2>
            
            {/* Description */}
            <p className="text-lg text-white text-center mb-12 max-w-3xl mx-auto leading-relaxed">
              Here's some of my contributions to the development of the web application.
            </p>

            
            {/* Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Left Column */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                
                <div className="space-y-2">
                  <p className="text-gray-700">Designed several pages of the website and user interface using Figma to ensure a modern and intuitive user experience.</p>
                  <p className="text-gray-700">Collaborated on developing the landing page using Next.js and tailwind, focusing on responsive design.</p>
                  <p className="text-gray-700">Help developed the 'View Events' page, which dynamically lists upcoming events and allows users to click for detailed information about each one.</p>
                  <p className="text-gray-700">Implemented part of the front-end of the Athlete Profile page, ensuring a clean layout that highlights key details such as stats, user details, and bio information.</p>
                  <p className="text-gray-700">Assisted in resolving a variety of bugs, including UI inconsistencies and integration issues, to enhance the overall functionality and user experience of the application.</p>


                </div>
              </div>
              
              {/* Right Column */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                
                <div className="space-y-2">
                  <p className="text-gray-700">Built the front-end interface for an interactive Results and Scoring page, enabling users to view live scores, filter results, and engage with dynamic visual data displays.</p>
                  <p className="text-gray-700">Full-stack development of a Speactator and Live Streaming feature that integrates real-time video playback of archived content alongside a live chat interface for user engagement.</p>
                  <p className="text-gray-700">Developed the interface for the athlete weigh-in check-in system, designing a user-friendly experience.</p>
                  <p className="text-gray-700">Handled the front-end development of the FAQ page, creating an intuitive layout with expandable sections for streamlined access to information.</p>
                  <p className="text-gray-700">Conducted end-to-end testing on key pages using Cypress, ensuring functionality, performance, and reliability across critical user flows.</p>

                </div>
              </div>
            </div>
            
           
          </div>
        </section>
        {/* Section 3  */}
        <section className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 py-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Text */}
            <div className="mb-16">
              <h2 className="text-6xl font-bold text-white mb-6 tracking-tight">
                Demo
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                This demo showcases the features and design of the capstone application, highlighting seamless navigation, intuitive interfaces, and user-focused functionality.
              </p>
            </div>
            {/* Video Container */}
            <div className="flex justify-center">
              <div className="relative group">
                {/* Glow Effect - moved behind video */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
          
                {/* Video Container */}
                <div className="relative w-[800px] h-[450px] bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-700 group-hover:shadow-purple-500/20 transition-all duration-300">
                  {/* Video Element */}
                  <video className="w-full h-full object-cover relative z-10"controls>
                    <source src="/Final Demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>
        
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Capstone;