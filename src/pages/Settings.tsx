import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Globe,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Save,
  X,
  Check,
  AlertCircle,
  Moon,
  Sun,
  Monitor,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  LogOut,
  HelpCircle,
  ChevronRight,
  
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import TopBar from '../components/TopBar';

const Settings: React.FC = () => {

  const { isDarkMode, setIsDarkMode, users } = useBoardStore();
  // State for different settings sections
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    bio: 'Product Manager passionate about building great experiences',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    avatar: 'J'
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    boardUpdates: true,
    mentions: true,
    dueDate: true,
    weeklyDigest: false,
    marketing: false
  });

  const [themeSettings, setThemeSettings] = useState({
    theme: isDarkMode ? 'dark' : 'light',
    accentColor: 'blue',
    compactMode: false,
    animations: true,
    fontSize: 'medium'
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'team',
    showEmail: false,
    showActivity: true,
    allowMentions: true,
    dataSharing: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleThemeChange = (theme: string) => {
    setThemeSettings({ ...themeSettings, theme });
    if (theme === 'dark') {
      setIsDarkMode(true);
    } else if (theme === 'light') {
      setIsDarkMode(false);
    }
    setUnsavedChanges(true);
  };

  const handleNotificationToggle = (key: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key]
    });
    setUnsavedChanges(true);
  };

  const handlePrivacyToggle = (key: string) => {
    setPrivacySettings({
      ...privacySettings,
      [key]: !privacySettings[key]
    });
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving settings...');
    setUnsavedChanges(false);
    // Show success message
  };

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 mb-6`}>
      <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      {children}
    </div>
  );

  const ToggleSwitch = ({ enabled, onChange, label, description }: {
    enabled: boolean;
    onChange: () => void;
    label: string;
    description?: string;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <label className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{label}</label>
        {description && (
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
        )}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'account', label: 'Account', icon: SettingsIcon },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <TopBar 
        title="Settings" 
        subtitle="Manage your account and preferences"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-4`}>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                        : isDarkMode
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                ))}
              </nav>

              {/* Unsaved Changes Indicator */}
              {unsavedChanges && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Unsaved changes</span>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setUnsavedChanges(false)}
                      className="px-3 py-1 text-yellow-800 dark:text-yellow-400 text-sm hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded transition-colors"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div>
                <SettingsSection title="Profile Information">
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {profileData.avatar}
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profile Picture</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload a new profile picture</p>
                        <div className="mt-2 flex space-x-2">
                          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                            Upload
                          </button>
                          <button className={`px-3 py-1 text-sm rounded border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors`}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => {
                            setProfileData({ ...profileData, name: e.target.value });
                            setUnsavedChanges(true);
                          }}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => {
                            setProfileData({ ...profileData, email: e.target.value });
                            setUnsavedChanges(true);
                          }}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Location
                        </label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => {
                            setProfileData({ ...profileData, location: e.target.value });
                            setUnsavedChanges(true);
                          }}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Timezone
                        </label>
                        <select
                          value={profileData.timezone}
                          onChange={(e) => {
                            setProfileData({ ...profileData, timezone: e.target.value });
                            setUnsavedChanges(true);
                          }}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        >
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Bio
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => {
                          setProfileData({ ...profileData, bio: e.target.value });
                          setUnsavedChanges(true);
                        }}
                        rows={3}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                </SettingsSection>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <SettingsSection title="Email Notifications">
                  <div className="space-y-4">
                    <ToggleSwitch
                      enabled={notificationSettings.emailNotifications}
                      onChange={() => handleNotificationToggle('emailNotifications')}
                      label="Email Notifications"
                      description="Receive notifications via email"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.taskReminders}
                      onChange={() => handleNotificationToggle('taskReminders')}
                      label="Task Reminders"
                      description="Get reminded about upcoming due dates"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.boardUpdates}
                      onChange={() => handleNotificationToggle('boardUpdates')}
                      label="Board Updates"
                      description="Notifications when boards are updated"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.mentions}
                      onChange={() => handleNotificationToggle('mentions')}
                      label="Mentions"
                      description="When someone mentions you in comments"
                    />
                  </div>
                </SettingsSection>

                <SettingsSection title="Push Notifications">
                  <div className="space-y-4">
                    <ToggleSwitch
                      enabled={notificationSettings.pushNotifications}
                      onChange={() => handleNotificationToggle('pushNotifications')}
                      label="Push Notifications"
                      description="Receive push notifications on your devices"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.dueDate}
                      onChange={() => handleNotificationToggle('dueDate')}
                      label="Due Date Alerts"
                      description="Push notifications for approaching deadlines"
                    />
                  </div>
                </SettingsSection>

                <SettingsSection title="Digest & Marketing">
                  <div className="space-y-4">
                    <ToggleSwitch
                      enabled={notificationSettings.weeklyDigest}
                      onChange={() => handleNotificationToggle('weeklyDigest')}
                      label="Weekly Digest"
                      description="Weekly summary of your activity"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.marketing}
                      onChange={() => handleNotificationToggle('marketing')}
                      label="Marketing Emails"
                      description="Product updates and promotional content"
                    />
                  </div>
                </SettingsSection>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <SettingsSection title="Theme">
                  <div className="space-y-6">
                    <div>
                      <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Choose Theme
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 'light', label: 'Light', icon: Sun },
                          { value: 'dark', label: 'Dark', icon: Moon },
                          { value: 'system', label: 'System', icon: Monitor }
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => handleThemeChange(theme.value)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              themeSettings.theme === theme.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : isDarkMode
                                  ? 'border-gray-600 hover:border-gray-500'
                                  : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <theme.icon className={`w-8 h-8 mx-auto mb-2 ${
                              themeSettings.theme === theme.value ? 'text-blue-600 dark:text-blue-400' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`} />
                            <p className={`font-medium ${
                              themeSettings.theme === theme.value ? 'text-blue-600 dark:text-blue-400' : isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {theme.label}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Accent Color
                      </label>
                      <div className="flex space-x-3">
                        {[
                          { color: 'blue', bg: 'bg-blue-500' },
                          { color: 'purple', bg: 'bg-purple-500' },
                          { color: 'green', bg: 'bg-green-500' },
                          { color: 'orange', bg: 'bg-orange-500' },
                          { color: 'red', bg: 'bg-red-500' },
                          { color: 'pink', bg: 'bg-pink-500' }
                        ].map((color) => (
                          <button
                            key={color.color}
                            onClick={() => {
                              setThemeSettings({ ...themeSettings, accentColor: color.color });
                              setUnsavedChanges(true);
                            }}
                            className={`w-8 h-8 rounded-full ${color.bg} ${
                              themeSettings.accentColor === color.color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <ToggleSwitch
                      enabled={themeSettings.compactMode}
                      onChange={() => {
                        setThemeSettings({ ...themeSettings, compactMode: !themeSettings.compactMode });
                        setUnsavedChanges(true);
                      }}
                      label="Compact Mode"
                      description="Reduce spacing and padding for a denser layout"
                    />

                    <ToggleSwitch
                      enabled={themeSettings.animations}
                      onChange={() => {
                        setThemeSettings({ ...themeSettings, animations: !themeSettings.animations });
                        setUnsavedChanges(true);
                      }}
                      label="Animations"
                      description="Enable smooth transitions and animations"
                    />

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Font Size
                      </label>
                      <select
                        value={themeSettings.fontSize}
                        onChange={(e) => {
                          setThemeSettings({ ...themeSettings, fontSize: e.target.value });
                          setUnsavedChanges(true);
                        }}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>
                </SettingsSection>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <SettingsSection title="Profile Privacy">
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Profile Visibility
                      </label>
                      <select
                        value={privacySettings.profileVisibility}
                        onChange={(e) => {
                          setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value });
                          setUnsavedChanges(true);
                        }}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      >
                        <option value="public">Public</option>
                        <option value="team">Team Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <ToggleSwitch
                      enabled={privacySettings.showEmail}
                      onChange={() => handlePrivacyToggle('showEmail')}
                      label="Show Email Address"
                      description="Display your email address on your profile"
                    />

                    <ToggleSwitch
                      enabled={privacySettings.showActivity}
                      onChange={() => handlePrivacyToggle('showActivity')}
                      label="Show Activity Status"
                      description="Let others see when you're online"
                    />

                    <ToggleSwitch
                      enabled={privacySettings.allowMentions}
                      onChange={() => handlePrivacyToggle('allowMentions')}
                      label="Allow Mentions"
                      description="Let team members mention you in comments"
                    />
                  </div>
                </SettingsSection>

                <SettingsSection title="Data & Privacy">
                  <div className="space-y-4">
                    <ToggleSwitch
                      enabled={privacySettings.dataSharing}
                      onChange={() => handlePrivacyToggle('dataSharing')}
                      label="Analytics Data Sharing"
                      description="Help improve the product by sharing usage data"
                    />

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Data Management</h4>
                      <div className="space-y-3">
                        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Download my data</span>
                        </button>
                        <button className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors">
                          <Trash2 className="w-4 h-4" />
                          <span>Delete my account</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </SettingsSection>

                <SettingsSection title="Security">
                  <div className="space-y-6">
                    <div>
                      <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Change Password</h4>
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              className={`w-full px-3 py-2 pr-10 rounded-lg border ${
                                isDarkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className={`w-full px-3 py-2 rounded-lg border ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          />
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className={`w-full px-3 py-2 rounded-lg border ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          />
                        </div>

                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Two-Factor Authentication</h4>
                      <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Add an extra layer of security to your account
                      </p>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </SettingsSection>
              </div>
            )}

            {activeTab === 'account' && (
              <div>
                <SettingsSection title="Account Information">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Account Type
                        </label>
                        <div className={`px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}>
                          Pro Account
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Member Since
                        </label>
                        <div className={`px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}>
                          January 2024
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Usage Statistics</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>12</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Boards Created</p>
                        </div>
                        <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>89</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tasks Completed</p>
                        </div>
                        <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>5</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Team Members</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SettingsSection>

                <SettingsSection title="Data Management">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Export Data</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Download all your boards, tasks, and comments</p>
                      </div>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Import Data</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Import boards and tasks from other tools</p>
                      </div>
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Import</span>
                      </button>
                    </div>
                  </div>
                </SettingsSection>

                <SettingsSection title="Danger Zone">
                  <div className="space-y-4">
                    <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <h4 className="font-medium text-red-800 dark:text-red-400 mb-2">Delete Account</h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </SettingsSection>
              </div>
            )}

            {/* Save Button */}
            {unsavedChanges && (
              <div className="sticky bottom-4 mt-8">
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4 shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">You have unsaved changes</span>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setUnsavedChanges(false)}
                        className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors`}
                      >
                        Discard
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;