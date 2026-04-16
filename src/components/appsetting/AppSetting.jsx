import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import useToast from '../../hooks/useToast';

const AppSetting = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: false,
    emailNotifications: true,
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    maintenanceMode: false,
    currency: 'USD',
    timezone: 'UTC'
  });
  
  const { showSuccess, showError } = useToast();

  // Fetch admin settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/zeggo/admin-setting');
      console.log('GET Admin Setting Response:', response.data);
      
      // Handle different API response structures
      let settingsData = {};
      if (response.data?.data) {
        settingsData = response.data.data;
      } else if (response.data) {
        settingsData = response.data;
      }
      
      console.log('Parsed Settings:', settingsData);
      setSettings(prevSettings => ({
        ...prevSettings,
        ...settingsData
      }));
      showSuccess('Settings loaded successfully');
    } catch (err) {
      console.error('Error fetching settings:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load settings';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      console.log('Saving settings:', settings);
      
      const response = await api.post('/api/zeggo/admin-setting', settings);
      console.log('POST Admin Setting Response:', response.data);
      
      showSuccess('Settings saved successfully');
    } catch (err) {
      console.error('Error saving settings:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save settings';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = async () => {
    if (!window.confirm('Are you sure you want to reset settings to default?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.delete('/api/zeggo/admin-setting');
      console.log('DELETE Admin Setting Response:', response.data);
      
      // Reset to default values
      setSettings({
        darkMode: false,
        emailNotifications: true,
        siteName: '',
        siteDescription: '',
        contactEmail: '',
        contactPhone: '',
        maintenanceMode: false,
        currency: 'USD',
        timezone: 'UTC'
      });
      
      showSuccess('Settings reset to default');
    } catch (err) {
      console.error('Error resetting settings:', err);
      const errorMessage = err.response?.data?.message || 'Failed to reset settings';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="p-6">
      <div className="bg-[#464859] rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">App Settings</h1>
            <p className="text-gray-300">Configure app settings here. Manage general application preferences.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleResetSettings}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset to Default
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
        
        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-300">Loading...</span>
          </div>
        )}
        
        <div className="space-y-6">
          {/* General Settings Section */}
          <div className="border border-gray-600 rounded-lg p-4 bg-[#3a3a4b]">
            <h3 className="font-semibold text-lg mb-4 text-white">General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Site Name</label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#3a3a4b] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter site name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#3a3a4b] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter contact email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#3a3a4b] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter contact phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Currency</label>
                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#3a3a4b] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Site Description</label>
                <textarea
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#3a3a4b] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter site description"
                />
              </div>
            </div>
          </div>

          {/* Toggle Settings Section */}
          <div className="border border-gray-600 rounded-lg p-4 bg-[#3a3a4b]">
            <h3 className="font-semibold text-lg mb-4 text-white">Application Toggles</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium text-white">Dark Mode</h3>
                  <p className="text-gray-400 text-sm">Enable dark theme for the application</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="darkMode"
                    checked={settings.darkMode}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium text-white">Email Notifications</h3>
                  <p className="text-gray-400 text-sm">Receive email notifications for important events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-white">Maintenance Mode</h3>
                  <p className="text-gray-400 text-sm">Enable maintenance mode (site will be inaccessible)</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSetting;