"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../Components/header';

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string | null;
  status: string;
  lastLogin?: Date;
  createdAt?: Date;
}

const UserManagementPage = () => {
  const router = useRouter();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else if (response.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError('Failed to load users');
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const sanitizeBase64Image = (imageData: any): string | null => {
    if (!imageData || typeof imageData !== 'string' || imageData === 'null' || imageData === 'undefined') {
      return null;
    }
    
    const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    if (base64Pattern.test(imageData)) {
      return imageData;
    }
    
    if (imageData.startsWith('/uploads/') || imageData.startsWith('http')) {
      return imageData;
    }
    
    return null;
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  //Filter users based on search term only
  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const onlineUsersCount = users.filter(user => user.status === 'online').length;
  const offlineUsersCount = users.filter(user => user.status === 'offline').length;

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-2">
                Monitor user activity and online status
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="flex space-x-4">
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <div className="text-green-800 font-semibold">{onlineUsersCount}</div>
                <div className="text-green-600 text-sm">Online Users</div>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="text-gray-800 font-semibold">{offlineUsersCount}</div>
                <div className="text-gray-600 text-sm">Offline Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative max-w-md">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Users ({filteredUsers.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No users found matching your criteria.
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0 relative">
                      {sanitizeBase64Image(user.profilePicture) ? (
                        <img
                          src={sanitizeBase64Image(user.profilePicture)!}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {getUserInitials(user.name)}
                          </span>
                        </div>
                      )}
                      {/* Online Status Indicator */}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </h3>
                        {/* Status Badge */}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'online'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      <p className="text-xs text-gray-400">
                        Last login: {formatDate(user.lastLogin)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;