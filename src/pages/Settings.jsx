import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Mail,
  Lock,
  Key,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import TopBar from '../components/TopBar';

const Settings: React.FC = () => {
  const { isDarkMode, setIsDarkMode } = useBoardStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john@company.com',
      title: 'Senior Developer',
      bio: 'Full-stack developer with 5+ years of experience in React and Node.js',
      avatar: ''
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      taskAssignments: true,
      deadlineReminders: true,
      teamUpdates: false,
      weeklyDigest: true
    },
    preferences: {
      theme: isDarkMode ? 'dark' : 'light',
      language: 'en',
      timezone: 'UTC-5',
      dateFormat: 'MM/DD/YYYY',
      startOfWeek: 'monday'
    },
    privacy: {
      profileVisibility: 'team',
      activityStatus: true,
      taskVisibility: 'assigned'
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'data', label: 'Data & Export', icon: Download }
  ];

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));

    // Handle theme change
    if (category === 'preferences' && key === 'theme') {
      const isDark = value === 'dark';
      setIsDarkMode(isDark);
    }
  };

  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {settings.profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <button className="absolute -bottom-1 -right-1 p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profile Picture</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload a new avatar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Full Name
          </label>
          <input
            type="text"
            value={settings.profile.name}
            onChange={(e) => updateSetting('profile', 'name', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Email Address
          </label>
          <input
            type="email"
            value={settings.profile.email}
            onChange={(e) => updateSetting('profile', 'email', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Job Title
          </label>
          <input
            type="text"
            value={settings.profile.title}
            onChange={(e) => updateSetting('profile', 'title', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              className={`w-full px-3 py-2 pr-10 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Bio
        </label>
        <textarea
          value={settings.profile.bio}
          onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          } focus:ring-2 focus:ring-blue-500`}
          placeholder="Tell us about yourself..."
        />
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Email Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Enable email notifications', desc: 'Receive notifications via email' },
            { key: 'taskAssignments', label: 'Task assignments', desc: 'When you are assigned to a task' },
            { key: 'deadlineReminders', label: 'Deadline reminders', desc: 'Get reminded about approaching deadlines' },
            { key: 'teamUpdates', label: 'Team updates', desc: 'Updates from your team members' },
            { key: 'weeklyDigest', label: 'Weekly digest', desc: 'Summary of your week every Monday' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
              </div>
              <button
                onClick={() => updateSetting('notifications', item.key, !settings.notifications[item.key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications[item.key] ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Push Notifications</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Browser notifications</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Show notifications in your browser</p>
          </div>
          <button
            onClick={() => updateSetting('notifications', 'pushNotifications', !settings.notifications.pushNotifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.notifications.pushNotifications ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const PrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Privacy Settings</h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Profile Visibility
            </label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500`}
            >
              <option value="public">Public</option>
              <option value="team">Team Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Task Visibility
            </label>
            <select
              value={settings.privacy.taskVisibility}
              onChange={(e) => updateSetting('privacy', 'taskVisibility', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Tasks</option>
              <option value="assigned">Assigned Tasks Only</option>
              <option value="none">None</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Show Activity Status</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Let others see when you're online</p>
            </div>
            <button
              onClick={() => updateSetting('privacy', 'activityStatus', !settings.privacy.activityStatus)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.privacy.activityStatus ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.privacy.activityStatus ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Security</h3>
        <div className="space-y-4">
          <button className="w-full p-4 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center space-x-2">
            <Key className="w-5 h-5" />
            <span>Enable Two-Factor Authentication</span>
          </button>
          
          <button className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
            <RefreshCw className="w-5 h-5" />
            <span>Change Password</span>
          </button>
        </div>
      </div>
    </div>
  );

  const DataTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Data Management</h3>
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
            <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Export Your Data</h4>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Download a copy of all your data including tasks, boards, and activity.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>

          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
            <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Import Data</h4>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Import your data from other project management tools.
            </p>
            <button className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Import Data</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold mb-4 text-red-600`}>Danger Zone</h3>
        <div className={`p-4 rounded-lg border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20`}>
          <h4 className={`font-medium mb-2 text-red-600`}>Delete Account</h4>
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'notifications': return <NotificationsTab />;
      case 'preferences': return <PreferencesTab />;
      case 'privacy': return <PrivacyTab />;
      case 'data': return <DataTab />;
      default: return <ProfileTab />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <TopBar 
        title="Settings" 
        subtitle="Manage your account and application preferences"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-2`}>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                        activeTab === tab.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 border border-blue-200 dark:border-blue-800'
                          : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-8`}>
              <div className="mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {activeTab === 'profile' && 'Manage your personal information and account details'}
                  {activeTab === 'notifications' && 'Configure how you receive notifications'}
                  {activeTab === 'preferences' && 'Customize your application experience'}
                  {activeTab === 'privacy' && 'Control your privacy and security settings'}
                  {activeTab === 'data' && 'Export your data and manage your account'}
                </p>
              </div>

              {renderTabContent()}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-end space-x-3">
                  <button className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}>
                    Reset
                  </button>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;