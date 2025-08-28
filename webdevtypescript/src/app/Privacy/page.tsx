"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '../Components/header';
import Footer from '../Components/footer';

const PrivacyPage = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header at the top with high z-index */}
      <div className="relative z-50">
        <Header />
      </div>
      
      {/* Privacy content */}
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
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {/* Shield Icon */}
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Privacy Notice</h1>
                <p className="text-gray-300"><strong>Effective Date:</strong> July 28th, 2025</p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div className="text-lg text-gray-300 leading-relaxed">
                This Privacy Notice explains how ArkTech ("Site") handles personal information when you visit and interact with the Site.
              </div>

              {/* Section 1 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-400 text-sm font-bold">1</span>
                  Information Collection
                </h2>
                <p className="text-gray-300 leading-relaxed pl-11">
                  This Site does not actively collect personal information from visitors. However, basic data such as IP address, 
                  browser type, and device details may be gathered automatically for analytics, security, and functionality purposes.

                  If you choose to sign up, it collects and store your name and email address for account management and communication. 
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-400 text-sm font-bold">2</span>
                  Cookies & Tracking
                </h2>
                <p className="text-gray-300 leading-relaxed pl-11">
                  This Site may use cookies or similar technologies to improve user experience. Cookies do not contain 
                  personally identifiable information and are used solely for functionality and performance. You can disable 
                  cookies through your browser settings. Additionally, user interactions is tracked on the site, including clicks and navigation patterns, 
                  to improve user experience and optimize site performance.
                </p>
              </div>

              {/* Section 3 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-400 text-sm font-bold">3</span>
                  Third-Party Content & Links
                </h2>
                <p className="text-gray-300 leading-relaxed pl-11">
                  This Site may display or link to third-party content. ArkTech is not responsible for the privacy practices 
                  of external sites. It is recommended reviewing their individual privacy policies.
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-400 text-sm font-bold">4</span>
                  Contact Information
                </h2>
                <p className="text-gray-300 leading-relaxed pl-11">
                  If you reach out via email or contact form, your name and email address will be used solely to respond 
                  to your inquiry. This site does not sell, rent, or share contact information with third parties.
                </p>
              </div>

              {/* Section 5 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-400 text-sm font-bold">5</span>
                  Data Security
                </h2>
                <p className="text-gray-300 leading-relaxed pl-11">
                  Reasonable steps are taken to safeguard data collected on or through the Site. However, no method of 
                  online transmission or storage is 100% secure.
                </p>
              </div>


              {/* Section 7 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-400 text-sm font-bold">6</span>
                  Changes to This Notice
                </h2>
                <p className="text-gray-300 leading-relaxed pl-11">
                  This site may update the Privacy Notice from time to time. Changes will be posted on this page and take 
                  effect immediately.
                </p>
              </div>

              {/* Section 8 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-400 text-sm font-bold">7</span>
                  Contact
                </h2>
                <p className="text-gray-300 leading-relaxed pl-11">
                  For questions about this Privacy Notice, please contact me.
                </p>
              </div>

              {/* Last updated notice */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-sm text-gray-400 text-center">
                  Last updated: August 18th, 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPage;