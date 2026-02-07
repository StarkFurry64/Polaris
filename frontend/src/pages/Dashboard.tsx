import { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { Hero } from '@/components/dashboard/Hero';
import { DashboardPage } from '@/components/dashboard/DashboardPage';
import { TeamsPage } from '@/components/dashboard/TeamsPage';
import { AnalyticsPage } from '@/components/dashboard/AnalyticsPage';
import { TechStackPage } from '@/components/dashboard/TechStackPage';
import { AnalysisModal } from '@/components/dashboard/AnalysisModal';
import { AnalysisDetailsPage } from '@/components/dashboard/AnalysisDetailsPage';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showDetailsPage, setShowDetailsPage] = useState(false);

  const handleViewDetails = () => {
    setShowAnalysisModal(false);
    setShowDetailsPage(true);
  };

  const handleBackToDashboard = () => {
    setShowDetailsPage(false);
    setActiveTab('dashboard');
  };

  const renderPage = () => {
    if (showDetailsPage) {
      return <AnalysisDetailsPage onBack={handleBackToDashboard} />;
    }

    switch (activeTab) {
      case 'teams':
        return <TeamsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'stack':
        return <TechStackPage />;
      default:
        return <DashboardPage onGenerateAnalysis={() => setShowAnalysisModal(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {activeTab === 'dashboard' && !showDetailsPage && <Hero onGenerateAnalysis={() => setShowAnalysisModal(true)} />}
        {renderPage()}
      </main>

      <AnalysisModal 
        isOpen={showAnalysisModal} 
        onClose={() => setShowAnalysisModal(false)}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default Dashboard;
