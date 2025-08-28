"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '../Components/header';
import Footer from '../Components/footer';

const TermsPage = () => {
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
      
      {/* Terms content */}
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
                  {/* Document Icon */}
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
                <p className="text-gray-300"><strong>Effective Date:</strong> July 28th, 2025</p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div className="text-lg text-gray-300 leading-relaxed">
                Welcome to ArkTech. These Terms of Service ("Terms") govern your use of this website ("Site"). 
                By accessing or browsing the Site, you agree to be bound by these Terms. If you do not agree, 
                please discontinue use of the Site.
              </div>

              {/* Section 1 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-400 text-sm font-bold">1</span>
                  Purpose of the Site
                </h2>
                <p className="text-gray-300 leading-relaxed pl-11">
                  This Site serves as a personal portfolio intended to display various creative and informational 
                  materials for reference and presentation purposes only. It is not intended for commercial 
                  transactions or public redistribution.
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-400 text-sm font-bold">2</span>
                  Third-Party Content
                </h2>
                <div className="pl-11 space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    The Site may include materials such as images, text, graphics, or other media obtained from 
                    public online sources. These items are included for portfolio and illustrative purposes only. 
                    ArkTech does not claim ownership of any third-party content displayed unless otherwise specified.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    If you are a copyright holder and believe that your work has been used improperly, please 
                    contact me
                    {' '}to request removal or attribution.
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-400 text-sm font-bold">3</span>
                  User Conduct
                </h2>
                <div className="pl-11 space-y-4">
                  <p className="text-gray-300 leading-relaxed">Visitors agree not to:</p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Violate any laws or infringe on third-party rights
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Attempt to access restricted areas of the Site
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Interfere with the Site's functionality or security
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-400 text-sm font-bold">4</span>
                  Disclaimer
                </h2>
                <p className="text-gray-300 leading-relaxed pl-11">
                  All content is provided "as is" for informational purposes. ArkTech makes no warranties 
                  regarding accuracy, completeness, or suitability of the materials for any specific purpose.
                </p>
              </div>

              {/* Section 5 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-400 text-sm font-bold">5</span>
                  Limitation of Liability
                </h2>
                <p className="text-gray-300 leading-relaxed pl-11">
                  To the maximum extent permitted by law, ArkTech shall not be liable for any indirect or 
                  consequential damages resulting from your use of or inability to access the Site.
                </p>
              </div>

              {/* Section 6 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-400 text-sm font-bold">6</span>
                  Changes to Terms
                </h2>
                <p className="text-gray-300 leading-relaxed pl-11">
                  These Terms may be revised at any time without prior notice. Updates will be posted on 
                  this page and take effect upon posting.
                </p>
              </div>

              {/* Section 7 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-400 text-sm font-bold">7</span>
                  Governing Law
                </h2>
                <p className="text-gray-300 leading-relaxed pl-11">
                  These Terms are governed by the laws of the Province of Quebec and the applicable laws 
                  of Canada and the United States.
                </p>
              </div>

              {/* Section 8 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-400 text-sm font-bold">8</span>
                  Contact
                </h2>
                <p className="text-gray-300 leading-relaxed pl-11">
                  If you have questions or concerns about these Terms, please reach out.
                </p>
              </div>

              {/* Last updated notice */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-sm text-gray-400 text-center">
                  Last updated: July 28th, 2025
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

export default TermsPage;