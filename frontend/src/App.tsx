import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DashboardPage } from './components/DashboardPage';
import { TeamsPage } from './components/TeamsPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { TechStackPage } from './components/TechStackPage';
import { AnalysisModal } from './components/AnalysisModal';
import { AnalysisDetailsPage } from './components/AnalysisDetailsPage';

export default function App() {
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
}