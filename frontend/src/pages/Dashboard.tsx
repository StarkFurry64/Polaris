import { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { RepositorySelector } from '@/components/dashboard/RepositorySelector';
import { LoginPage } from '@/components/auth/LoginPage';
import { PRAnalyticsPage } from '@/components/dashboard/PRAnalyticsPage';
import { DeveloperMetricsPage } from '@/components/dashboard/DeveloperMetricsPage';
import { AIInsightsPage } from '@/components/dashboard/AIInsightsPage';
import { ExecutiveDashboard } from '@/components/dashboard/ExecutiveDashboard';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('executive');
  const [selectedRepo, setSelectedRepo] = useState(null);

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'executive':
        return <ExecutiveDashboard selectedRepo={selectedRepo} />;
      case 'prs':
        return <PRAnalyticsPage selectedRepo={selectedRepo} />;
      case 'developers':
        return <DeveloperMetricsPage selectedRepo={selectedRepo} />;
      case 'ai':
        return <AIInsightsPage selectedRepo={selectedRepo} />;
      default:
        return <ExecutiveDashboard selectedRepo={selectedRepo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <RepositorySelector
          selectedRepo={selectedRepo}
          onRepositorySelect={setSelectedRepo}
        />
        {renderPage()}
      </main>
    </div>
  );
};

export default Dashboard;
