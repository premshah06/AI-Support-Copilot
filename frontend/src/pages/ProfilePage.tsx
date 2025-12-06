import { useState } from 'react';
import { DashboardLayout, PageTransition } from '../components/layouts';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Avatar } from '../components/atoms/Avatar';
import { User, Mail, Building, Save, Camera } from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Support Agent',
    company: 'Acme Inc.',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced support agent specializing in technical issues and customer success.',
  });

  const handleSave = () => {
    // Save profile logic here
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <PageTransition>
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account information and preferences
          </p>
        </header>

        {/* Profile Content */}
        <div className="max-w-4xl">
          {/* Profile Card */}
          <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            {/* Header with Avatar */}
            <div className="bg-accent/5 px-6 py-8 border-b border-border">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar name={profile.name} size="xl" />
                  <button className="absolute bottom-0 right-0 p-2 bg-accent text-accent-foreground rounded-full shadow-lg hover:bg-accent/90 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.role}</p>
                  <p className="text-sm text-muted-foreground mt-1">{profile.company}</p>
                </div>
                <Button
                  variant={isEditing ? 'outline' : 'primary'}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </div>

            {/* Profile Form */}
            <div className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                    fullWidth
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                    fullWidth
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Company
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                    fullWidth
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                  fullWidth
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSave} icon={<Save className="w-4 h-4" />}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Stats */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tickets Resolved</span>
                  <span className="font-semibold text-foreground">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Response Time</span>
                  <span className="font-semibold text-foreground">2.5 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer Rating</span>
                  <span className="font-semibold text-success">4.8/5.0</span>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Account Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-semibold text-foreground">Jan 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="font-semibold text-foreground">Pro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-success">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default ProfilePage;
