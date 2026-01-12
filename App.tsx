
import React, { useState, useEffect } from 'react';
import { mockService } from './services/mockService';
import { User, UserRole } from './types';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { FundraiserDashboard } from './pages/FundraiserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { DonorDashboard } from './pages/DonorDashboard';
import { LandingPage } from './pages/LandingPage';
import { CampaignDetails } from './pages/CampaignDetails';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session on load
    const currentUser = mockService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setShowAuth(false);
  };

  const handleLogout = () => {
    mockService.logout();
    setUser(null);
    setShowAuth(false); 
    setSelectedCampaignId(null);
  };
  
  const refreshUser = () => {
      const u = mockService.getCurrentUser();
      setUser(u);
  }

  // Router logic
  const renderContent = () => {
    // 1. If detailed view is active, show it (Overlay logic)
    if (selectedCampaignId) {
        return (
            <CampaignDetails 
                campaignId={selectedCampaignId} 
                user={user} 
                onBack={() => setSelectedCampaignId(null)}
                onRefreshUser={refreshUser}
            />
        );
    }

    // 2. If user is logged in, show their dashboard
    if (user) {
      switch (user.role) {
        case UserRole.FUNDRAISER:
          return (
            <FundraiserDashboard 
                user={user} 
                onViewCampaign={(id) => setSelectedCampaignId(id)}
            />
          );
        case UserRole.ADMIN:
          return (
            <AdminDashboard 
                user={user} 
                onViewCampaign={(id) => setSelectedCampaignId(id)}
            />
          );
        case UserRole.DONOR:
          return (
            <DonorDashboard 
                user={user} 
                onRefreshUser={refreshUser} 
                onViewCampaign={(id) => setSelectedCampaignId(id)}
            />
          );
        default:
          return <div>Unknown Role</div>;
      }
    }

    // 3. If no user, check if we should show Auth screen
    if (showAuth) {
        return <Auth onLoginSuccess={handleLoginSuccess} onBack={() => setShowAuth(false)} />;
    }

    // 4. Default: Show Landing Page
    return (
        <LandingPage 
            onNavigateToAuth={() => setShowAuth(true)} 
            onViewCampaign={(id) => setSelectedCampaignId(id)}
        />
    );
  };

  return (
    <Layout 
        user={user} 
        onLogout={handleLogout}
        onLoginClick={() => setShowAuth(true)}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
