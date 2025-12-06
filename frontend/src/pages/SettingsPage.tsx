import { useState } from 'react';
import { DashboardLayout, PageTransition } from '../components/layouts';
import { Button } from '../components/atoms/Button';
import { Switch } from '../components/atoms/Switch';
import { Select } from '../components/atoms/Select';
import { Bell, Lock, Palette, Globe, Shield, Save } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    ticketUpdates: true,
    aiSuggestions: true,
    language: 'en',
    timezone: 'UTC',
    twoFactor: false,
  });

  const handleSave = () => {
    // Save settings logic here
    console.log('Settings saved:', settings);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
  ];

  const [activeTab, setActiveTab] = useState('general');

  return (
    <DashboardLayout>
      <PageTransition>
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your application preferences and account settings
          </p>
        </header>

        {/* Settings Content */}
        <div className="max-w-4xl">
          {/* Custom Tabs */}
          <div className="flex gap-2 border-b border-border mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative',
                  activeTab === tab.id
                    ? 'text-accent'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">General Settings</h3>
                  
                  {/* Language */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Language
                    </label>
                    <Select
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      fullWidth
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </Select>
                  </div>

                  {/* Timezone */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Timezone
                    </label>
                    <Select
                      value={settings.timezone}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                      fullWidth
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
                  
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive email updates about your tickets</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    />
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">Get push notifications for urgent updates</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                    />
                  </div>

                  {/* Ticket Updates */}
                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground">Ticket Updates</h4>
                      <p className="text-sm text-muted-foreground">Notify me when tickets are updated</p>
                    </div>
                    <Switch
                      checked={settings.ticketUpdates}
                      onChange={(e) => setSettings({ ...settings, ticketUpdates: e.target.checked })}
                    />
                  </div>

                  {/* AI Suggestions */}
                  <div className="flex items-center justify-between py-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground">AI Suggestions</h4>
                      <p className="text-sm text-muted-foreground">Get notified when AI generates new suggestions</p>
                    </div>
                    <Switch
                      checked={settings.aiSuggestions}
                      onChange={(e) => setSettings({ ...settings, aiSuggestions: e.target.checked })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Appearance Settings</h3>
                  
                  {/* Theme */}
                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground">Dark Mode</h4>
                      <p className="text-sm text-muted-foreground">
                        Currently using {theme === 'dark' ? 'dark' : 'light'} theme
                      </p>
                    </div>
                    <Switch
                      checked={theme === 'dark'}
                      onChange={toggleTheme}
                    />
                  </div>

                  {/* Theme Preview */}
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Theme Preview</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-background border border-border rounded-lg">
                        <div className="w-full h-20 bg-accent rounded mb-2"></div>
                        <div className="space-y-2">
                          <div className="h-2 bg-muted rounded"></div>
                          <div className="h-2 bg-muted rounded w-3/4"></div>
                        </div>
                      </div>
                      <div className="p-4 bg-muted border border-border rounded-lg">
                        <div className="w-full h-20 bg-accent/50 rounded mb-2"></div>
                        <div className="space-y-2">
                          <div className="h-2 bg-background rounded"></div>
                          <div className="h-2 bg-background rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Security Settings</h3>
                  
                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={settings.twoFactor}
                      onChange={(e) => setSettings({ ...settings, twoFactor: e.target.checked })}
                    />
                  </div>

                  {/* Change Password */}
                  <div className="py-4 border-b border-border">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Password</h4>
                    <p className="text-sm text-muted-foreground mb-3">Last changed 30 days ago</p>
                    <Button variant="outline" icon={<Lock className="w-4 h-4" />}>
                      Change Password
                    </Button>
                  </div>

                  {/* Active Sessions */}
                  <div className="py-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Active Sessions</h4>
                    <p className="text-sm text-muted-foreground mb-3">Manage your active sessions across devices</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-foreground">Current Session</p>
                          <p className="text-xs text-muted-foreground">Chrome on macOS • Active now</p>
                        </div>
                        <span className="text-xs text-success font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <Button variant="primary" onClick={handleSave} icon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default SettingsPage;
