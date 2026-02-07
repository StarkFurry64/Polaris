import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  GitPullRequest, 
  GitMerge, 
  Clock, 
  Users, 
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Github,
  ChevronDown
} from 'lucide-react';
import { fetchRepository, fetchContributors, fetchUserRepos } from '@/services/api';
import { Header } from '@/components/dashboard/Header';

interface RepoData {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
}

interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

interface RepoOption {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  language: string;
}

const GitAnalyticsPage = () => {
  const [owner] = useState('readingthroughlife');
  const [repo, setRepo] = useState('');
  const [repos, setRepos] = useState<RepoOption[]>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load repos on mount
  useEffect(() => {
    const loadRepos = async () => {
      setReposLoading(true);
      try {
        const data = await fetchUserRepos(owner);
        setRepos(data);
        if (data.length > 0 && !repo) {
          setRepo(data[0].name);
        }
      } catch (err) {
        console.error('Failed to load repos:', err);
      } finally {
        setReposLoading(false);
      }
    };
    loadRepos();
  }, [owner]);

  // Load repo data when repo changes
  useEffect(() => {
    if (repo) {
      fetchData();
    }
  }, [repo]);

  const fetchData = async () => {
    if (!repo) return;
    setLoading(true);
    setError(null);
    try {
      const [repoResult, contribResult] = await Promise.all([
        fetchRepository(owner, repo),
        fetchContributors(owner, repo)
      ]);
      setRepoData(repoResult);
      setContributors(contribResult.slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                  <Github className="h-6 w-6 text-white" />
                </div>
                Git Analytics
              </h1>
              <p className="text-slate-600 mt-1">Real-time insights from your GitHub repositories</p>
            </div>
          </div>

          {/* Repo Selector Card */}
          <Card className="border-0 shadow-xl bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                {/* Owner Display */}
                <div className="flex-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2 block">
                    GitHub Owner
                  </label>
                  <div className="bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-3 rounded-xl flex items-center gap-3 shadow-inner">
                    <div className="p-1.5 bg-white/20 rounded-lg">
                      <Github className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{owner}</span>
                    <Badge className="ml-auto bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      Connected
                    </Badge>
                  </div>
                </div>

                {/* Repo Selector */}
                <div className="flex-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2 block">
                    Select Repository
                  </label>
                  {reposLoading ? (
                    <Skeleton className="h-12 w-full rounded-xl" />
                  ) : (
                    <div className="relative">
                      <select
                        value={repo}
                        onChange={(e) => setRepo(e.target.value)}
                        className="w-full appearance-none bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent cursor-pointer font-medium pr-10 shadow-inner"
                      >
                        {repos.map((r) => (
                          <option key={r.name} value={r.name} className="bg-slate-800 text-white">
                            {r.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 pointer-events-none" />
                    </div>
                  )}
                </div>

                {/* Refresh Button */}
                <Button 
                  onClick={fetchData} 
                  disabled={loading || !repo} 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 px-6 py-3 h-auto rounded-xl font-semibold transition-all duration-200"
                >
                  {loading ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </>
                  )}
                </Button>
              </div>

              {/* Repos Count */}
              <div className="mt-4 flex items-center gap-2 text-slate-400 text-sm">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  {repos.length} repositories found
                </span>
              </div>
            </div>
          </Card>

      {error && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-red-500">{error}</span>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-12 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : repoData && (
        <>
          {/* Repository Info */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    {repoData.full_name}
                  </CardTitle>
                  <CardDescription className="mt-1">{repoData.description}</CardDescription>
                </div>
                <Badge variant="outline" className="text-cyan-600 border-cyan-600">
                  {repoData.default_branch}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Stars</p>
                    <p className="text-2xl font-bold">{repoData.stargazers_count.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
                    <GitMerge className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Forks</p>
                    <p className="text-2xl font-bold">{repoData.forks_count.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500">
                    <GitPullRequest className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Open Issues</p>
                    <p className="text-2xl font-bold">{repoData.open_issues_count.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Contributors</p>
                    <p className="text-2xl font-bold">{contributors.length}+</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Contributors */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {contributors.map((contributor) => (
                  <div key={contributor.login} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <img 
                      src={contributor.avatar_url} 
                      alt={contributor.login}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{contributor.login}</p>
                      <p className="text-xs text-slate-500">{contributor.contributions} commits</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
        </div>
      </main>
    </div>
  );
};

export default GitAnalyticsPage;
