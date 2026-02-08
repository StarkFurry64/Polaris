import { useState, useRef } from 'react';
import { Header } from '@/components/dashboard/Header';
import { RepositorySelector } from '@/components/dashboard/RepositorySelector';
import { PRAnalyticsPage } from '@/components/dashboard/PRAnalyticsPage';
import { DeveloperMetricsPage } from '@/components/dashboard/DeveloperMetricsPage';
import { AIInsightsPage } from '@/components/dashboard/AIInsightsPage';
import { ExecutiveDashboard } from '@/components/dashboard/ExecutiveDashboard';
import { JiraPage } from '@/components/dashboard/JiraPage';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, FileDown, Loader2 } from 'lucide-react';
import { generateExecutiveReport } from '@/lib/pdfReport';
import { getCommits, getPullRequests, getContributors, getGitHubIssues } from '@/api/github';

const Dashboard = () => {
  const { user, githubToken, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('executive');
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleExportPDF = async () => {
    if (!selectedRepo) {
      alert('Please select a repository first');
      return;
    }

    setIsExporting(true);
    try {
      // Use the same API functions as ExecutiveDashboard
      const repoFullName = selectedRepo.fullName || `${selectedRepo.owner?.login}/${selectedRepo.name}`;

      const [commits, prs, contributors, issues] = await Promise.all([
        getCommits(repoFullName, githubToken),
        getPullRequests(repoFullName, githubToken),
        getContributors(repoFullName, githubToken),
        getGitHubIssues(repoFullName, githubToken)
      ]);

      console.log('PDF Report Data:', { commits: commits.length, prs: prs.length, contributors: contributors.length, issues: issues.length });

      // Calculate metrics
      const openPRs = Array.isArray(prs) ? prs.filter((pr: any) => pr.state === 'open').length : 0;
      const mergedPRs = Array.isArray(prs) ? prs.filter((pr: any) => pr.merged_at).length : 0;

      // Calculate issue metrics (filter out PRs which GitHub returns in issues endpoint)
      const actualIssues = Array.isArray(issues) ? issues.filter((i: any) => !i.pull_request) : [];
      const openIssues = actualIssues.filter((i: any) => i.state === 'open').length;
      const closedIssues = actualIssues.filter((i: any) => i.state === 'closed').length;

      // Identify risks
      const risks: any[] = [];

      // Stale PRs
      if (Array.isArray(prs)) {
        const stalePRs = prs.filter((pr: any) => {
          const updated = new Date(pr.updated_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return pr.state === 'open' && updated < weekAgo;
        });
        if (stalePRs.length > 0) {
          risks.push({
            title: 'Stale Pull Requests',
            severity: stalePRs.length > 3 ? 'high' : 'medium',
            description: `${stalePRs.length} pull requests have not been updated in over 7 days.`,
            impact: 'Delayed feature delivery'
          });
        }
      }

      // Bus Factor
      if (Array.isArray(contributors) && contributors.length > 0) {
        const topContrib = contributors[0];
        const totalContribs = contributors.reduce((sum: number, c: any) => sum + (c.contributions || 0), 0);
        const topPercent = totalContribs > 0 ? Math.round((topContrib.contributions / totalContribs) * 100) : 0;
        if (topPercent > 60) {
          risks.push({
            title: 'Knowledge Concentration Risk',
            severity: topPercent > 80 ? 'high' : 'medium',
            description: `${topContrib.login} owns ${topPercent}% of project contributions.`,
            impact: 'Single point of failure'
          });
        }
      }

      // Generate recommendations
      const recommendations = [
        'Schedule regular code review sessions to reduce PR review time',
        'Implement pair programming to distribute knowledge across the team',
        'Set up automated testing to catch issues early',
        'Create documentation for critical system components',
        'Establish clear ownership for priority issues'
      ];

      // Generate the PDF
      generateExecutiveReport({
        repoName: selectedRepo.name,
        repoOwner: selectedRepo.owner?.login || selectedRepo.fullName?.split('/')[0] || 'Unknown',
        generatedBy: user?.displayName || 'Unknown User',
        generatedAt: new Date(),
        metrics: {
          totalCommits: Array.isArray(commits) ? commits.length : 0,
          totalPRs: Array.isArray(prs) ? prs.length : 0,
          openPRs,
          mergedPRs,
          totalContributors: Array.isArray(contributors) ? contributors.length : 0,
          totalIssues: actualIssues.length,
          openIssues,
          closedIssues
        },
        contributors: Array.isArray(contributors) ? contributors.slice(0, 5).map((c: any) => ({
          name: c.login || 'Unknown',
          commits: c.contributions || 0,
          prs: Array.isArray(prs) ? prs.filter((pr: any) => pr.user?.login === c.login).length : 0
        })) : [],
        risks,
        recommendations
      });

    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsExporting(false);
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4 mr-2" />
              )}
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
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
      </div>

      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main ref={dashboardRef} className="max-w-7xl mx-auto px-6 py-6 space-y-6 relative z-10">
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
