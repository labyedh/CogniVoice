import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Lock, Save, Camera, Shield, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, changePassword, uploadAvatar } from '../api/user';

const ProfilePage: React.FC = () => {
  const { user, updateUserContext } = useAuth();
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('/default-avatar.png');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    analysisReminders: true,
    securityAlerts: true,
    marketingEmails: false
  });
  
  useEffect(() => {
    if (user?.avatarUrl) {
      setAvatarPreview(`${import.meta.env.VITE_REACT_APP_API_URL}${user.avatarUrl}`);
    } else {
      setAvatarPreview('/default-avatar.png');
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setIsUploading(true);
    setFeedback({ message: '', type: '' });
    try {
      const response = await uploadAvatar(avatarFile);
      updateUserContext({ avatarUrl: response.avatarUrl });
      setFeedback({ message: "Avatar updated successfully!", type: 'success' });
      setAvatarFile(null);
    } catch (error) {
      setFeedback({ message: error instanceof Error ? error.message : "Upload failed.", type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };
  
  const cancelAvatarChange = () => {
      setAvatarFile(null);
      setAvatarPreview(user?.avatarUrl ? `${import.meta.env.VITE_REACT_APP_API_URL}${user.avatarUrl}` : '/default-avatar.png');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ message: '', type: '' });
    try {
      await updateProfile(profileData);
      updateUserContext(profileData);
      setFeedback({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      setFeedback({ message: error instanceof Error ? error.message : 'Error updating profile.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFeedback({ message: 'New passwords do not match.', type: 'error' });
      return;
    }
    setIsSubmitting(true);
    setFeedback({ message: '', type: '' });
    try {
      await changePassword(passwordData);
      setFeedback({ message: 'Password updated successfully!', type: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setFeedback({ message: error instanceof Error ? error.message : 'An unknown error occurred.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ message: 'Notification settings saved ', type: 'success' });
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Mail }
  ];

  const handleTabClick = (tabId: string) => {
      setActiveTab(tabId);
      setFeedback({ message: '', type: ''});
  };

  return (
    <DashboardLayout title="Profile Settings" subtitle="Manage your account settings and preferences">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#FFEAD8]">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id ? 'border-[#9B177E] text-[#9B177E]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* --- SINGLE, CORRECTED AVATAR SECTION --- */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"/>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border hover:bg-gray-50 cursor-pointer">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2A1458]">Profile Picture</h3>
                    <p className="text-gray-600 text-sm mb-2">Click the camera icon to choose a new photo</p>
                    {avatarFile && (
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={handleAvatarUpload} disabled={isUploading} className="flex items-center justify-center w-28 text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 disabled:opacity-50">
                                {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Save Avatar"}
                            </button>
                            <button type="button" onClick={cancelAvatarChange} className="text-sm text-gray-600 hover:text-black">Cancel</button>
                        </div>
                    )}
                  </div>
                </div>

                {/* --- SINGLE, CORRECT PROFILE FORM SECTION --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#2A1458] mb-2">First Name</label>
                    <input type="text" value={profileData.firstName} onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B177E] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2A1458] mb-2">Last Name</label>
                    <input type="text" value={profileData.lastName} onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B177E] focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2A1458] mb-2">Email Address</label>
                  <input type="email" value={profileData.email} onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B177E] focus:border-transparent" />
                </div>
                
                {/* Submit button for the main profile form */}
                <div className="flex justify-end items-center gap-4">
                    {feedback.message && (<p className={`text-sm ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</p>)}
                    <button type="submit" disabled={isSubmitting} className="flex items-center space-x-2 bg-gradient-to-r from-[#9B177E] to-[#2A1458] hover:from-[#2A1458] hover:to-[#9B177E] text-white px-6 py-2 rounded-lg transition-all duration-200 disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {/* --- THIS IS THE CORRECTED JSX --- */}
                <div>
                  <label className="block text-sm font-medium text-[#2A1458] mb-2">Current Password</label>
                  <input type="password" required value={passwordData.currentPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B177E] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2A1458] mb-2">New Password</label>
                  <input type="password" required value={passwordData.newPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B177E] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2A1458] mb-2">Confirm New Password</label>
                  <input type="password" required value={passwordData.confirmPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B177E] focus:border-transparent" />
                </div>
                <div className="flex justify-end items-center gap-4">
                    {feedback.message && (<p className={`text-sm ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</p>)}
                    <button type="submit" disabled={isSubmitting} className="flex items-center space-x-2 bg-gradient-to-r from-[#9B177E] to-[#2A1458] hover:from-[#2A1458] hover:to-[#9B177E] text-white px-6 py-2 rounded-lg transition-all duration-200 disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                        <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
                    </button>
                </div>
                {/* --- END OF CORRECTION --- */}
              </form>
            )}

            {activeTab === 'notifications' && (
              <form onSubmit={handleNotificationSubmit} className="space-y-6">
                {/* --- THIS IS THE CORRECTED JSX --- */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-[#2A1458]">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={notificationSettings.emailNotifications} onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9B177E]"></div>
                    </label>
                  </div>
                   <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-[#2A1458]">Analysis Reminders</h4>
                      <p className="text-sm text-gray-600">Get reminded to perform regular analyses</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={notificationSettings.analysisReminders} onChange={(e) => setNotificationSettings(prev => ({ ...prev, analysisReminders: e.target.checked }))} className="sr-only peer" />
                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9B177E]"></div>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end items-center gap-4">
                    {feedback.message && (<p className={`text-sm ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</p>)}
                    <button type="submit" className="flex items-center space-x-2 bg-gradient-to-r from-[#9B177E] to-[#2A1458] hover:from-[#2A1458] hover:to-[#9B177E] text-white px-6 py-2 rounded-lg transition-all duration-200">
                        <Save className="w-4 h-4" />
                        <span>Save Preferences</span>
                    </button>
                </div>
                {/* --- END OF CORRECTION --- */}
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;