import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Circle
} from 'lucide-react';
import { fetchJiraProjects, fetchJiraIssues } from '@/services/api';
import { Header } from '@/components/dashboard/Header';

interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  avatarUrls: { '48x48': string };
}

interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: { name: string; statusCategory: { key: string } };
    issuetype: { name: string; iconUrl: string };
    priority?: { name: string; iconUrl: string };
    assignee?: { displayName: string; avatarUrls: { '24x24': string } };
    created: string;
    updated: string;
  };
}

const JiraDashboard = () => {
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJiraProjects();
      setProjects(data);
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0].key);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const loadIssues = async (projectKey: string) => {
    setIssuesLoading(true);
    try {
      const data = await fetchJiraIssues(projectKey);
      setIssues(data);
    } catch (err) {
      console.error('Failed to load issues:', err);
      setIssues([]);
    } finally {
      setIssuesLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadIssues(selectedProject);
    }
  }, [selectedProject]);

  const getStatusColor = (statusCategory: string) => {
    switch (statusCategory) {
      case 'done': return 'bg-green-500';
      case 'indeterminate': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBadgeVariant = (statusCategory: string) => {
    switch (statusCategory) {
      case 'done': return 'bg-green-100 text-green-700 border-green-200';
      case 'indeterminate': return 'bg-primary/20 text-primary border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const stats = {
    total: issues.length,
    done: issues.filter(i => i.fields.status.statusCategory.key === 'done').length,
    inProgress: issues.filter(i => i.fields.status.statusCategory.key === 'indeterminate').length,
    todo: issues.filter(i => i.fields.status.statusCategory.key === 'new').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
      {/* Page Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FolderKanban className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Jira Dashboard</h1>
                <p className="text-blue-100">Track your project issues and sprints</p>
              </div>
            </div>
            <Button 
              onClick={loadProjects} 
              disabled={loading}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-500">{error}</span>
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          projects.map(project => (
            <Card 
              key={project.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedProject === project.key 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-0'
              }`}
              onClick={() => setSelectedProject(project.key)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <img 
                  src={project.avatarUrls['48x48']} 
                  alt={project.name}
                  className="w-10 h-10 rounded"
                />
                <div>
                  <p className="font-semibold">{project.name}</p>
                  <p className="text-sm text-slate-500">{project.key}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {selectedProject && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100">
                  <FolderKanban className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Issues</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Done</p>
                  <p className="text-2xl font-bold text-green-600">{stats.done}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">In Progress</p>
                  <p className="text-2xl font-bold text-primary">{stats.inProgress}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Circle className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">To Do</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.todo}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Issues List */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Issues in {selectedProject}</CardTitle>
              <CardDescription>Recent issues from your Jira project</CardDescription>
            </CardHeader>
            <CardContent>
              {issuesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : issues.length === 0 ? (
                <p className="text-center text-slate-500 py-8">No issues found in this project</p>
              ) : (
                <div className="space-y-2">
                  {issues.map(issue => (
                    <div 
                      key={issue.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={issue.fields.issuetype.iconUrl} 
                          alt={issue.fields.issuetype.name}
                          className="w-5 h-5"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-primary font-mono">{issue.key}</span>
                            <span className="font-medium">{issue.fields.summary}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className={getStatusBadgeVariant(issue.fields.status.statusCategory.key)}
                            >
                              {issue.fields.status.name}
                            </Badge>
                            {issue.fields.assignee && (
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <img 
                                  src={issue.fields.assignee.avatarUrls['24x24']}
                                  alt={issue.fields.assignee.displayName}
                                  className="w-4 h-4 rounded-full"
                                />
                                {issue.fields.assignee.displayName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <a 
                        href={`https://anjstanlikestostudy.atlassian.net/browse/${issue.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-blue-500"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
        </div>
      </main>
    </div>
  );
};

export default JiraDashboard;
