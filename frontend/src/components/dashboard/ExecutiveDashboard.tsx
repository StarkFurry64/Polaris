import { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Loader2, RefreshCw, FileQuestion, GitPullRequest, GitCommit, Users, Bug, CheckCircle, Circle } from 'lucide-react';
import { getCommits, getPullRequests, getContributors, getJiraIssues } from '@/api/github';

interface SelectedRepo {
    name: string;
    fullName: string;
    description?: string;
}

interface ExecutiveDashboardProps {
    selectedRepo?: SelectedRepo | null;
}

export function ExecutiveDashboard({ selectedRepo }: ExecutiveDashboardProps) {
    const [loading, setLoading] = useState(false);
    const [commits, setCommits] = useState<any[]>([]);
    const [prs, setPrs] = useState<any[]>([]);
    const [contributors, setContributors] = useState<any[]>([]);
    const [jiraIssues, setJiraIssues] = useState<any[]>([]);
    const [filteredJiraIssues, setFilteredJiraIssues] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!selectedRepo) return;

        setLoading(true);
        setError(null);

        try {
            // Fetch GitHub data for selected repo only
            const [commitsData, prsData, contribData, jiraData] = await Promise.all([
                getCommits(selectedRepo.name),
                getPullRequests(selectedRepo.name),
                getContributors(selectedRepo.name),
                getJiraIssues()
            ]);

            setCommits(commitsData);
            setPrs(prsData);
            setContributors(contribData);
            setJiraIssues(jiraData);

            // Step 5: Filter Jira issues by repo name in summary (correlation via naming convention)
            const repoNameLower = selectedRepo.name.toLowerCase();
            const filtered = jiraData.filter((issue: any) =>
                issue.summary?.toLowerCase().includes(repoNameLower) ||
                issue.key?.toLowerCase().includes(repoNameLower)
            );
            setFilteredJiraIssues(filtered.length > 0 ? filtered : jiraData); // Show all if no match

        } catch (err: any) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedRepo) {
            fetchData();
        }
    }, [selectedRepo]);

    // Calculate Jira metrics
    const jiraMetrics = {
        total: filteredJiraIssues.length,
        bugs: filteredJiraIssues.filter(i => i.type?.toLowerCase() === 'bug').length,
        done: filteredJiraIssues.filter(i => i.status?.toLowerCase() === 'done').length,
        open: filteredJiraIssues.filter(i => ['to do', 'in progress', 'open'].includes(i.status?.toLowerCase())).length,
    };

    // No repo selected state
    if (!selectedRepo) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                <FileQuestion className="size-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a Repository</h3>
                <p className="text-slate-600 max-w-md mx-auto">
                    Choose a repository from the dropdown above to view insights for that repo only.
                </p>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                <Loader2 className="size-12 text-blue-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Loading Data for {selectedRepo.name}...</h3>
                <p className="text-slate-600">Fetching commits, PRs, contributors, and Jira issues</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                <AlertTriangle className="size-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Unable to Load Data</h3>
                <p className="text-slate-600 mb-4">{error}</p>
                <button
                    onClick={fetchData}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <RefreshCw className="size-4" /> Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Dashboard: {selectedRepo.name}</h2>
                    <p className="text-slate-600 mt-1">Real data from GitHub & Jira (readingthroughlife/{selectedRepo.name})</p>
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200"
                >
                    <RefreshCw className="size-4" /> Refresh
                </button>
            </div>

            {/* GitHub Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <GitCommit className="size-4 text-blue-600" />
                        <span className="text-sm">Commits</span>
                    </div>
                    <p className="text-3xl font-semibold text-blue-600">{commits.length}</p>
                    <p className="text-xs text-slate-500 mt-1">Recent commits</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <GitPullRequest className="size-4 text-purple-600" />
                        <span className="text-sm">Pull Requests</span>
                    </div>
                    <p className="text-3xl font-semibold text-purple-600">{prs.length}</p>
                    <p className="text-xs text-slate-500 mt-1">{prs.filter((p: any) => p.state === 'open').length} open</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Users className="size-4 text-emerald-600" />
                        <span className="text-sm">Contributors</span>
                    </div>
                    <p className="text-3xl font-semibold text-emerald-600">{contributors.length}</p>
                    <p className="text-xs text-slate-500 mt-1">Active contributors</p>
                </div>
            </div>

            {/* Jira Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <TrendingUp className="size-4 text-indigo-600" />
                        <span className="text-sm">Jira Issues</span>
                    </div>
                    <p className="text-3xl font-semibold text-indigo-600">{jiraMetrics.total}</p>
                    <p className="text-xs text-slate-500 mt-1">Total issues</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Bug className="size-4 text-red-600" />
                        <span className="text-sm">Bugs</span>
                    </div>
                    <p className="text-3xl font-semibold text-red-600">{jiraMetrics.bugs}</p>
                    <p className="text-xs text-slate-500 mt-1">Bug count</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Circle className="size-4 text-amber-600" />
                        <span className="text-sm">Open</span>
                    </div>
                    <p className="text-3xl font-semibold text-amber-600">{jiraMetrics.open}</p>
                    <p className="text-xs text-slate-500 mt-1">In progress</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <CheckCircle className="size-4 text-emerald-600" />
                        <span className="text-sm">Done</span>
                    </div>
                    <p className="text-3xl font-semibold text-emerald-600">{jiraMetrics.done}</p>
                    <p className="text-xs text-slate-500 mt-1">Completed</p>
                </div>
            </div>

            {/* Recent Commits */}
            {commits.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <GitCommit className="size-5" />
                        Recent Commits ({Math.min(5, commits.length)} of {commits.length})
                    </h3>
                    <div className="space-y-3">
                        {commits.slice(0, 5).map((commit: any) => (
                            <div key={commit.sha} className="p-3 bg-slate-50 rounded-lg">
                                <p className="font-medium text-slate-900 truncate">{commit.commit?.message?.split('\n')[0]}</p>
                                <p className="text-sm text-slate-500">{commit.commit?.author?.name} • {new Date(commit.commit?.author?.date).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pull Requests */}
            {prs.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <GitPullRequest className="size-5" />
                        Pull Requests ({prs.length})
                    </h3>
                    <div className="space-y-3">
                        {prs.slice(0, 5).map((pr: any) => (
                            <div key={pr.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 truncate">{pr.title}</p>
                                    <p className="text-sm text-slate-500">#{pr.number} by {pr.user?.login}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ml-3 ${pr.state === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
                                    }`}>
                                    {pr.state}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Jira Issues */}
            {filteredJiraIssues.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="size-5" />
                        Jira Issues ({filteredJiraIssues.length})
                    </h3>
                    <div className="space-y-3">
                        {filteredJiraIssues.slice(0, 5).map((issue: any) => (
                            <div key={issue.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 truncate">{issue.summary}</p>
                                    <p className="text-sm text-slate-500">{issue.key} • {issue.type} • {issue.assignee}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ml-3 ${issue.status?.toLowerCase() === 'done' ? 'bg-emerald-100 text-emerald-700' :
                                        issue.status?.toLowerCase() === 'in progress' ? 'bg-blue-100 text-blue-700' :
                                            'bg-slate-100 text-slate-700'
                                    }`}>
                                    {issue.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Contributors */}
            {contributors.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Users className="size-5" />
                        Top Contributors
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {contributors.slice(0, 10).map((c: any) => (
                            <div key={c.id} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                                <img src={c.avatar_url} alt={c.login} className="size-6 rounded-full" />
                                <span className="font-medium text-slate-900">{c.login}</span>
                                <span className="text-xs text-slate-500">{c.contributions} commits</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
