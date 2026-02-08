import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FolderKanban,
  Bug,
  CheckCircle2,
  Clock,
  RefreshCw,
  Circle,
  AlertCircle,
  Search,
  Filter,
  UserPlus,
  ChevronDown,
  X,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Users,
  Mail
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getContributors } from '@/api/github';
import { useToast } from '@/hooks/use-toast';

interface JiraIssue {
  key: string;
  summary: string;
  type: string;
  status: string;
  priority: string;
  assignee: string;
  labels: string[];
  updated: string;
  created: string;
}

interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

interface JiraPageProps {
  selectedRepo: any;
  githubToken?: string | null;
}

export function JiraPage({ selectedRepo, githubToken }: JiraPageProps) {
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const { toast } = useToast();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Assignment modal state
  const [assigningIssue, setAssigningIssue] = useState<string | null>(null);

  // Email input modal state
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailModalData, setEmailModalData] = useState<{ assignee: string; issue: JiraIssue | null }>({ assignee: '', issue: null });
  const [manualEmail, setManualEmail] = useState('');

  // LocalStorage key for persisting assignments
  const ASSIGNMENTS_STORAGE_KEY = 'polaris_jira_assignments';

  // Helper to get saved assignments from localStorage
  const getSavedAssignments = (): Record<string, string> => {
    try {
      const saved = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  // Helper to save assignment to localStorage
  const saveAssignment = (issueKey: string, assignee: string) => {
    try {
      const current = getSavedAssignments();
      current[issueKey] = assignee;
      localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(current));
    } catch (err) {
      console.error('Failed to save assignment:', err);
    }
  };

  const loadIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/jira/issues');
      const data = await response.json();
      if (data.success) {
        // Merge with saved assignments from localStorage
        const savedAssignments = getSavedAssignments();
        const issuesWithSavedAssignments = data.data.map((issue: JiraIssue) => ({
          ...issue,
          assignee: savedAssignments[issue.key] || issue.assignee
        }));
        setIssues(issuesWithSavedAssignments);
      } else {
        throw new Error(data.error || 'Failed to load issues');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const loadContributors = async () => {
    if (selectedRepo?.name) {
      try {
        const repoFullName = selectedRepo.fullName || selectedRepo.name;
        const contribData = await getContributors(repoFullName, githubToken);
        setContributors(contribData);
      } catch (err) {
        console.error('Failed to load contributors:', err);
      }
    }
  };

  useEffect(() => {
    loadIssues();
    loadContributors();
  }, [selectedRepo]);

  // Priority helpers
  const getPriorityIcon = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'highest':
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <ArrowRight className="h-4 w-4 text-amber-500" />;
      case 'low':
      case 'lowest':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      default:
        return <ArrowRight className="h-4 w-4 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'highest':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
      case 'lowest':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'done':
      case 'closed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'done':
      case 'closed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type?.toLowerCase() === 'bug') {
      return <Bug className="h-4 w-4 text-red-500" />;
    }
    return <FolderKanban className="h-4 w-4 text-blue-500" />;
  };

  // Filter issues
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = searchQuery === '' ||
      issue.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || issue.type?.toLowerCase() === typeFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'all' || issue.priority?.toLowerCase() === priorityFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  // Calculate stats
  const stats = {
    total: issues.length,
    bugs: issues.filter(i => i.type?.toLowerCase() === 'bug').length,
    stories: issues.filter(i => i.type?.toLowerCase() === 'story').length,
    tasks: issues.filter(i => i.type?.toLowerCase() === 'task').length,
    done: issues.filter(i => i.status?.toLowerCase() === 'done' || i.status?.toLowerCase() === 'closed').length,
    inProgress: issues.filter(i => i.status?.toLowerCase() === 'in progress').length,
    todo: issues.filter(i => i.status?.toLowerCase() === 'to do' || i.status?.toLowerCase() === 'open').length
  };

  // Chart data
  const typeDistribution = [
    { name: 'Bugs', value: stats.bugs, color: '#ef4444' },
    { name: 'Stories', value: stats.stories, color: '#3b82f6' },
    { name: 'Tasks', value: stats.tasks, color: '#10b981' },
  ].filter(d => d.value > 0);

  const statusDistribution = [
    { name: 'Done', value: stats.done, color: '#10b981' },
    { name: 'In Progress', value: stats.inProgress, color: '#3b82f6' },
    { name: 'To Do', value: stats.todo, color: '#94a3b8' },
  ].filter(d => d.value > 0);

  // Send email notification helper
  const sendEmailNotification = async (recipientEmail: string, assignee: string, issue: JiraIssue) => {
    try {
      const response = await fetch('http://localhost:3001/api/notifications/assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail,
          recipientName: assignee,
          issueKey: issue.key,
          issueSummary: issue.summary,
          priority: issue.priority,
          assignerName: 'Polaris Dashboard'
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "✅ Email Sent",
          description: `Notification sent to ${assignee} at ${recipientEmail}`,
        });
      } else {
        toast({
          title: "⚠️ Email Failed",
          description: data.error || 'Failed to send notification',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to send email notification:', error);
      toast({
        title: "⚠️ Error",
        description: 'Network error sending notification',
        variant: "destructive",
      });
    }
  };

  // Handle email modal submission
  const handleEmailSubmit = async () => {
    if (manualEmail && manualEmail.includes('@') && emailModalData.issue) {
      const issue = emailModalData.issue;
      const assignee = emailModalData.assignee;

      // Update local state with the assignee name from email (before @)
      const assigneeName = manualEmail.split('@')[0];
      setIssues(prev => prev.map(i =>
        i.key === issue.key ? { ...i, assignee: assigneeName } : i
      ));

      // Persist to localStorage
      saveAssignment(issue.key, assigneeName);

      setEmailModalOpen(false);
      await sendEmailNotification(manualEmail.trim(), assignee, issue);
      setManualEmail('');
      setEmailModalData({ assignee: '', issue: null });
    } else {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
    }
  };

  // Close email modal without sending
  const handleEmailCancel = () => {
    setEmailModalOpen(false);
    setManualEmail('');
    setEmailModalData({ assignee: '', issue: null });
    // Just close silently - no notification needed when skipping
  };

  // Assign issue handler with email notification
  const handleAssign = async (issueKey: string, assignee: string) => {
    const issue = issues.find(i => i.key === issueKey);

    // Update local state
    setIssues(prev => prev.map(i =>
      i.key === issueKey ? { ...i, assignee } : i
    ));
    setAssigningIssue(null);

    // Persist assignment to localStorage
    saveAssignment(issueKey, assignee);

    // Send email notification if assigning to someone (not unassigning)
    if (assignee && assignee !== 'Unassigned' && issue) {
      try {
        // Fetch real email from contributor's GitHub commits
        let recipientEmail = null;

        if (selectedRepo?.name) {
          const emailResponse = await fetch(
            `http://localhost:3001/api/github/repos/${selectedRepo.name}/contributors/${assignee}/email`
          );
          const emailData = await emailResponse.json();

          // Only use email if it's NOT a noreply GitHub email
          if (emailData.success && emailData.email && !emailData.email.includes('noreply.github.com')) {
            recipientEmail = emailData.email;
          }
        }

        // If valid email found, send notification directly
        if (recipientEmail) {
          await sendEmailNotification(recipientEmail, assignee, issue);
        } else {
          // Open email modal for manual entry
          setEmailModalData({ assignee, issue });
          setEmailModalOpen(true);
        }
      } catch (error) {
        console.error('Failed to fetch email:', error);
        // Open email modal as fallback
        setEmailModalData({ assignee, issue });
        setEmailModalOpen(true);
      }
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setPriorityFilter('all');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-blue-600" />
            Jira Dashboard
          </h2>
          <p className="text-slate-600 mt-1">Track issues and project progress</p>
        </div>
        <Button onClick={loadIssues} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <FolderKanban className="h-4 w-4" />
              <span className="text-sm">Total Issues</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-500 mb-1">
              <Bug className="h-4 w-4" />
              <span className="text-sm">Bugs</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.bugs}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Circle className="h-4 w-4" />
              <span className="text-sm">To Do</span>
            </div>
            <p className="text-2xl font-bold text-slate-600">{stats.todo}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-500 mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-500 mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Done</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.done}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Type Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bug className="h-5 w-5 text-red-500" />
              Issue Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {typeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search issues by key or summary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex gap-2 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="to do">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="bug">Bug</option>
                <option value="story">Story</option>
                <option value="task">Task</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="text-slate-600">
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active filter pills */}
          {hasActiveFilters && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-slate-500">Showing {filteredIssues.length} of {issues.length} issues</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Issues List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-blue-600" />
            All Issues ({filteredIssues.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <FolderKanban className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>{issues.length === 0 ? 'No issues found' : 'No issues match your filters'}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredIssues.map((issue) => (
                <div
                  key={issue.key}
                  className="flex items-start justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getTypeIcon(issue.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{issue.key}</span>
                        <Badge variant="outline" className={getStatusColor(issue.status)}>
                          {getStatusIcon(issue.status)}
                          <span className="ml-1">{issue.status}</span>
                        </Badge>
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                          {issue.type}
                        </Badge>
                        {/* Priority Badge */}
                        <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                          {getPriorityIcon(issue.priority)}
                          <span className="ml-1">{issue.priority || 'Medium'}</span>
                        </Badge>
                      </div>
                      <p className="text-base font-medium text-slate-900 mt-2">
                        {issue.summary}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        {/* Assignee with direct email input */}
                        <div className="relative">
                          <button
                            onClick={() => {
                              // Directly open email modal for this issue
                              setEmailModalData({ assignee: issue.assignee || 'Team Member', issue });
                              setEmailModalOpen(true);
                            }}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                          >
                            <Users className="h-3 w-3" />
                            <span>Assignee: <span className="font-medium text-slate-700">{issue.assignee || 'Unassigned'}</span></span>
                            <Mail className="h-3 w-3 ml-1 text-blue-500" />
                          </button>
                        </div>

                        {issue.labels && issue.labels.length > 0 && (
                          <div className="flex gap-1">
                            {issue.labels.slice(0, 2).map(label => (
                              <Badge key={label} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                                {label}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-500 whitespace-nowrap ml-4">
                    <p>Updated</p>
                    <p className="font-medium">{new Date(issue.updated).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Click outside to close dropdown */}
      {assigningIssue && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setAssigningIssue(null)}
        />
      )}

      {/* Email Input Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Enter Email Address</h3>
                <p className="text-sm text-slate-500">
                  GitHub privacy enabled for <span className="font-medium">{emailModalData.assignee}</span>
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email for notification:
              </label>
              <input
                type="email"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                placeholder="contributor@email.com"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleEmailCancel}
                variant="outline"
                className="flex-1"
              >
                Skip Notification
              </Button>
              <Button
                onClick={handleEmailSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
