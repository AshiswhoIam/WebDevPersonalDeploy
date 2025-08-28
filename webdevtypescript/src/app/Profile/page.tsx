"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../Components/header';

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string | null;
}

const ProfilePage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profilePicture', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          ...data.user,
          profilePicture: sanitizeBase64Image(data.user.profilePicture)
        });
      } else {
        router.push('/Login');
      }
    } catch (error) {
      console.error('Profile load failed:', error);
      router.push('/Login');
    } finally {
      setIsLoading(false);
    }
  };

  //Updated sanitization for base64 images
  const sanitizeBase64Image = (imageData: any): string | null => {
    if (!imageData || typeof imageData !== 'string' || imageData === 'null' || imageData === 'undefined') {
      return null;
    }
    
    //Check if it's a valid base64 data URL
    const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    if (base64Pattern.test(imageData)) {
      return imageData;
    }
    
    //Legacy support for file paths 
    if (imageData.startsWith('/uploads/') || imageData.startsWith('http')) {
      return imageData;
    }
    
    return null;
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleFileAction = async (action: 'upload' | 'remove', file?: File) => {
    setIsUploading(true);
    setMessage(null);

    try {
      const config: RequestInit = {
        method: action === 'upload' ? 'POST' : 'DELETE',
        credentials: 'include',
      };

      if (action === 'upload' && file) {
        //Validate file
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select a valid image file');
        }
        //Reduced size limit for base64 storage
        if (file.size > 3 * 1024 * 1024) {
          throw new Error('File size must be less than 3MB for database storage');
        }

        const formData = new FormData();
        formData.append('profilePicture', file);
        config.body = formData;
      }

      const response = await fetch('/api/user/profilePicture', config);
      const data = await response.json();

      if (response.ok) {
        const successMsg = action === 'upload' ? 'Profile picture updated successfully!' : 'Profile picture removed successfully!';
        setMessage({type: 'success', text: successMsg});
        
        if (action === 'upload') {
          setUser(prev => prev ? {...prev, profilePicture: sanitizeBase64Image(data.profilePictureUrl)} : null);
        } else {
          setUser(prev => prev ? {...prev, profilePicture: null} : null);
        }
        setImageError(false);
        //Shorter timeout since we don't need to wait for file system operations
        setTimeout(loadUserProfile, 200);
      } else {
        throw new Error(data.message || `Failed to ${action} profile picture`);
      }
    } catch (error) {
      setMessage({type: 'error', text: error instanceof Error ? error.message : 'Network error. Please try again.'});
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileAction('upload', file);
  };

  const hasValidImage = () => {
    return !!(user?.profilePicture && !imageError);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8">
            <div className="flex items-center space-x-6">
              {/* Profile Picture or Initials */}
              {hasValidImage() ? (
                <img 
                  src={user.profilePicture!} 
                  alt="Profile Picture" 
                  className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white/20"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {getUserInitials(user.name)}
                  </span>
                </div>
              )}

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                <p className="text-blue-100 text-lg">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 py-6">
            {/* Messages */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                {message.text}
              </div>
            )}

            {/* Profile Picture Management */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Picture</h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {hasValidImage() ? 'Change Picture' : 'Upload Picture'}
                      </>
                    )}
                  </button>

                  {hasValidImage() && (
                    <button
                      onClick={() => handleFileAction('remove')}
                      disabled={isUploading}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove Picture
                    </button>
                  )}
                </div>
                
                <p className="text-sm text-gray-500">
                  Supported formats: JPG, PNG, GIF, Please compress your image to be optimized for database storage.
                </p>
              </div>
            </div>

            {/* Account Information */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {label: 'Full Name', value: user.name},
                  {label: 'Email Address', value: user.email}
                ].map(({label, value}) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <span className="text-gray-900">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ProfilePage;