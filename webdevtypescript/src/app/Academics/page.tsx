"use client";
import React, { useState } from 'react';
import Header from '../Components/header';
import Footer from '../Components/footer';
import Link from 'next/link';

//Modal component for displaying course descriptions
const CourseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  description: string;
  loading: boolean;
}> = ({ isOpen, onClose, courseName, description, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">{courseName}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Generating description...</span>
            </div>
          ) : (
            <div className="text-gray-700 leading-relaxed">
              {description ? (
                <p>{description}</p>
              ) : (
                <p className="text-red-500">Failed to generate description. Please try again.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Academics: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [courseDescription, setCourseDescription] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCourseClick = async (courseName: string) => {
    setSelectedCourse(courseName);
    setIsModalOpen(true);
    setLoading(true);
    setCourseDescription('');
    
    try {
      const response = await fetch('/api/generate-course-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseName }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate description');
      }
      
      const data = await response.json();
      setCourseDescription(data.description);
    } catch (error) {
      console.error('Error:', error);
      setCourseDescription('Sorry, could not generate description at this time.');
    } finally {
      setLoading(false);
    }
  };

  const courses = [
    'COMP 232 Mathematics for Computer Science',
    'COMP 248 Object-Oriented Programming I',
    'ENGR 201 Professional Practice and Responsibility',
    'GEOG 220 General Education Elective',
    'COMP 249 Object-Oriented Programming II',
    'ENGR 233 Applied Advanced Calculus',
    'SOEN 228 System Hardware',
    'SOEN 287 Web Programming',
    'PHYS 284 Engineering and Natural Science Group',
    'COMP 348 Principles of Programming Languages',
    'COMP 352 Data Structures and Algorithms',
    'ENCS 282 Technical Writing and Communication',
    'ENGR 202 Sustainable Development and Environmental Stewardship',
    'SOEN 341 Software Process and Practices',
    'COMP 346 Operating Systems',
    'ELEC 275 Principles of Electrical Engineering',
    'ENGR 371 Probability and Statistics in Engineering',
    'SOEN 331 Formal Methods for Software Engineering',
    'COMP 345 Advanced Program Design with C++'
  ];

  const coursesColumn2 = [
    'COMP 335 Introduction to Theoretical Computer Science',
    'ENGR 391 Numerical Methods in Engineering',
    'SOEN 342 Software Requirements and Deployment',
    'SOEN 343 Software Architecture and Design',
    'SOEN 384 Management, Measurement and Quality Control',
    'SOEN 363 Data Systems for Software Engineer',
    'SOEN 345 Software Testing, Verification and Quality Assurance',
    'SOEN 357 User Interface Design',
    'SOEN 390 Software Engineering Team Design Project',
    'SOEN 385 Control Systems and Applications',
    'ENGR 301 Engineering Management Principles and Economics',
    'SOEN 321 Information Systems Security',
    'ENGR 392 Impact of Technology on Society',
    'COMP 472 Artificial Intelligence',
    'SOEN 387 Web‑Based Enterprise Application Design',
    'SOEN 490 Capstone Software Engineering Design Project'
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* First Section - 60/40 Split */}
        <section className="h-[28rem] flex flex-col md:flex-row">
          {/* Left Side - 60% Text Content */}
          <div className="md:w-3/5 w-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                🎓 Academic Background
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-blue-600 text-xl font-bold mr-2">•</span>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    Bachelor of Engineering in Software Engineering<br />
                    <span className="text-sm text-gray-600">Concordia University</span>
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 text-xl font-bold mr-2">•</span>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    DEC in Pure and Applied Sciences<br />
                    <span className="text-sm text-gray-600">Vanier College</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Right Side - 40% Image */}
          <div className="md:w-2/5 w-full relative overflow-hidden">
            <img 
              src="/Acad.png" 
              alt="Academic Background" 
              className="w-full h-full object-cover transform scale-105 transition-transform duration-1000 ease-in-out"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        </section>

        {/* Section 2 Academic Details */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Name */}
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
              Software Engineering Program
            </h2>
            
            {/* Description */}
            <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto leading-relaxed">
              Comprehensive four-year program focusing on software development, system design, 
              and engineering principles. Emphasis on practical application through projects 
              and collaborative learning experiences.
            </p>

             <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto leading-relaxed">
              Select a course below to explore an AI-generated description provided by Gemini.
            </p>
            <p className="text-sm text-gray-500 text-center -mt-4 max-w-3xl mx-auto leading-relaxed italic">
              *Note may take time to load. Functionality depends on Google server availability. AI can make mistakes.
            </p>
            
            {/* Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Left Column */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="space-y-2">
                  {courses.map((course, index) => (
                    <p 
                      key={index}
                      className="text-gray-700 cursor-pointer hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-all duration-200"
                      onClick={() => handleCourseClick(course)}
                    >
                      {course}
                    </p>
                  ))}
                </div>
              </div>
              
              {/* Right Column */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="space-y-2">
                  {coursesColumn2.map((course, index) => (
                    <p 
                      key={index}
                      className="text-gray-700 cursor-pointer hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-all duration-200"
                      onClick={() => handleCourseClick(course)}
                    >
                      {course}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Skills Section */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical Skills Acquired</h3>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                Through rigorous coursework and hands-on projects, I have developed proficiency in 
                multiple programming languages including Java, Python, JavaScript, C++, and more. 
                Additionally, I have gained experience with frameworks like React, Next.js, Pytorch, 
                and various database technologies including SQL, MongoDB and NoSQL systems.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="relative py-16 bg-[url('/AcadS3.png')] bg-cover bg-center bg-no-repeat">
          {/* overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Middle Text */}
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              Academic Projects
            </h2>
            
            {/* 4 Rectangles at Center - 2 per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Rectangle 1 */}
              <Link href="https://github.com/AshiswhoIam/SQLProjects">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg
              hover:shadow-xl hover:scale-105 hover:bg-white transition-all duration-300 ease-in-out cursor-pointer">
                <p className="text-gray-700 font-medium">SQL</p>
              </div>
              </Link>
              
              {/* Rectangle 2 */}
              <Link href="/Capstone">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg
              hover:shadow-xl hover:scale-105 hover:bg-white transition-all duration-300 ease-in-out cursor-pointer">              
                <p className="text-gray-700 font-medium">Capstone</p>
              </div>
              </Link>
              
              {/* Rectangle 3 */}
              <a 
                href="https://github.com/AshiswhoIam/JavaProjects" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg
                hover:shadow-xl hover:scale-105 hover:bg-white transition-all duration-300 ease-in-out cursor-pointer">
                  <p className="text-gray-700 font-medium">JAVA</p>
                </div>
              </a>
              {/* Rectangle 4 */}
              <Link href="/AiModel">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg
              hover:shadow-xl hover:scale-105 hover:bg-white transition-all duration-300 ease-in-out cursor-pointer">               
                <p className="text-gray-700 font-medium">AiDevelopment</p>
              </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />

      {/* Course Description Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseName={selectedCourse}
        description={courseDescription}
        loading={loading}
      />
    </div>
  );
};

export default Academics;