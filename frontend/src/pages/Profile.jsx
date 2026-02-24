import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';

export default function Profile() {
  const [profile, setProfile] = useState({ name: '', email: '', bio: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNew: '' });
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  const [passMsg, setPassMsg] = useState({ text: '', type: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/user/profile');
        setProfile({ name: data.name, email: data.email, bio: data.bio || '' });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ text: '', type: '' });
    setProfileLoading(true);
    try {
      const { data } = await API.put('/user/profile', {
        name: profile.name,
        bio: profile.bio,
      });
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, name: data.name, bio: data.bio }));
      setProfileMsg({ text: '✅ Profile updated successfully!', type: 'success' });
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || 'Update failed', type: 'error' });
    }
    setProfileLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMsg({ text: '', type: '' });

    if (passwords.newPassword !== passwords.confirmNew)
      return setPassMsg({ text: 'New passwords do not match', type: 'error' });

    if (passwords.newPassword.length < 6)
      return setPassMsg({ text: 'New password must be at least 6 characters', type: 'error' });

    setPassLoading(true);
    try {
      await API.put('/user/profile', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmNew: '' });
      setPassMsg({ text: '✅ Password changed successfully!', type: 'success' });
    } catch (err) {
      setPassMsg({ text: err.response?.data?.message || 'Password change failed', type: 'error' });
    }
    setPassLoading(false);
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="profile-main">
        <div className="profile-header">
          <div className="avatar-circle">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1>{profile.name}</h1>
            <p>{profile.email}</p>
          </div>
        </div>

        <div className="profile-grid">
          {/* Update Profile */}
          <div className="detail-card">
            <h3>👤 Edit Profile</h3>
            {profileMsg.text && (
              <div className={`alert alert-${profileMsg.type}`}>{profileMsg.text}</div>
            )}
            <form onSubmit={handleProfileSubmit} className="auth-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email (read-only)</label>
                <input type="email" value={profile.email} disabled className="input-disabled" />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us a bit about yourself..."
                  rows={3}
                  className="notes-textarea"
                />
              </div>
              <button type="submit" className="btn-primary" disabled={profileLoading}>
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="detail-card">
            <h3>🔒 Change Password</h3>
            {passMsg.text && (
              <div className={`alert alert-${passMsg.type}`}>{passMsg.text}</div>
            )}
            <form onSubmit={handlePasswordSubmit} className="auth-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  placeholder="Min 6 characters"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirmNew}
                  onChange={(e) => setPasswords({ ...passwords, confirmNew: e.target.value })}
                  placeholder="Repeat new password"
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={passLoading}>
                {passLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
