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
  AlertCircle
} from 'lucide-react';

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

interface JiraPageProps {
  selectedRepo: string | null;
}

export function JiraPage({ selectedRepo }: JiraPageProps) {
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/jira/issues');
      const data = await response.json();
      if (data.success) {
        setIssues(data.data);
      } else {
        throw new Error(data.error || 'Failed to load issues');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

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

  // Calculate stats
  const stats = {
    total: issues.length,
    bugs: issues.filter(i => i.type?.toLowerCase() === 'bug').length,
    done: issues.filter(i => i.status?.toLowerCase() === 'done' || i.status?.toLowerCase() === 'closed').length,
    inProgress: issues.filter(i => i.status?.toLowerCase() === 'in progress').length,
    todo: issues.filter(i => i.status?.toLowerCase() === 'to do' || i.status?.toLowerCase() === 'open').length
  };

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

      {/* Issues List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-blue-600" />
            All Issues ({issues.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : issues.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <FolderKanban className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>No issues found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {issues.map((issue) => (
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
                      </div>
                      <p className="text-base font-medium text-slate-900 mt-2">
                        {issue.summary}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span>Assignee: <span className="font-medium text-slate-700">{issue.assignee}</span></span>
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
    </div>
  );
}
