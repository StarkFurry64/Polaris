import { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { RepositorySelector } from '@/components/dashboard/RepositorySelector';
import { PRAnalyticsPage } from '@/components/dashboard/PRAnalyticsPage';
import { DeveloperMetricsPage } from '@/components/dashboard/DeveloperMetricsPage';
import { AIInsightsPage } from '@/components/dashboard/AIInsightsPage';
import { ExecutiveDashboard } from '@/components/dashboard/ExecutiveDashboard';
import { JiraPage } from '@/components/dashboard/JiraPage';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, githubToken, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('executive');
  const [selectedRepo, setSelectedRepo] = useState(null);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'executive':
        return <ExecutiveDashboard selectedRepo={selectedRepo} githubToken={githubToken} />;
      case 'prs':
        return <PRAnalyticsPage selectedRepo={selectedRepo} githubToken={githubToken} />;
      case 'developers':
        return <DeveloperMetricsPage selectedRepo={selectedRepo} githubToken={githubToken} />;
      case 'jira':
        return <JiraPage selectedRepo={selectedRepo} githubToken={githubToken} />;
      case 'ai':
        return <AIInsightsPage selectedRepo={selectedRepo} githubToken={githubToken} />;
      default:
        return <ExecutiveDashboard selectedRepo={selectedRepo} githubToken={githubToken} />;
    }
  };

  return (
    <div className="min-h-screen bg-background animated-gradient">
      {/* Gradient glow overlay */}
      <div className="fixed inset-0 bg-gradient-glow pointer-events-none" />

      {/* User Profile Bar */}
      <div className="glass border-b border-border/30 px-6 py-2 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-8 h-8 rounded-full ring-2 ring-primary/30"
              />
            )}
            <span className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{user?.displayName || 'User'}</span>
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6 relative z-10">
        <RepositorySelector
          selectedRepo={selectedRepo}
          onRepositorySelect={setSelectedRepo}
          githubToken={githubToken}
        />
        {renderPage()}
      </main>
    </div>
  );
};

export default Dashboard;
