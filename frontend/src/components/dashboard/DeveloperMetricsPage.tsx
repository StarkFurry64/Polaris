import { useState, useEffect } from 'react';
import {
    Users, Code2, GitPullRequest, Loader2, AlertTriangle, RefreshCw, FileQuestion,
    AlertCircle, BarChart3, Zap, GitCommit, Clock, Bug, CheckCircle
} from 'lucide-react';
import { getContributors, getCommits, getPullRequests, getJiraIssues } from '@/api/github';

interface SelectedRepo {
    name: string;
    fullName?: string;
}

interface DeveloperMetricsPageProps {
    selectedRepo?: SelectedRepo | null;
    githubToken?: string | null;
}

export function DeveloperMetricsPage({ selectedRepo, githubToken }: DeveloperMetricsPageProps) {
    const [loading, setLoading] = useState(false);
    const [contributors, setContributors] = useState<any[]>([]);
    const [commits, setCommits] = useState<any[]>([]);
    const [prs, setPrs] = useState<any[]>([]);
    const [jiraIssues, setJiraIssues] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!selectedRepo) return;

        setLoading(true);
        setError(null);

        try {
            const repoFullName = selectedRepo.fullName || selectedRepo.name;
            const [contribData, commitsData, prsData, jiraData] = await Promise.all([
                getContributors(repoFullName, githubToken),
                getCommits(repoFullName, githubToken),
                getPullRequests(repoFullName, githubToken),
                getJiraIssues()
            ]);

            setContributors(contribData);
            setCommits(commitsData);
            setPrs(prsData);
            setJiraIssues(jiraData);
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

    // No repo selected
    if (!selectedRepo) {
        return (
            <div className="bg-card rounded-2xl p-12 border border-border text-center">
                <FileQuestion className="size-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Select a Repository</h3>
                <p className="text-muted-foreground">Choose a repository to view developer metrics.</p>
            </div>
        );
    }

    // Loading
    if (loading) {
        return (
            <div className="bg-card rounded-2xl p-12 border border-border text-center">
                <Loader2 className="size-12 text-primary mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Loading Developer Metrics...</h3>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="bg-card rounded-2xl p-12 border border-border text-center">
                <AlertTriangle className="size-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Error Loading Data</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <button onClick={fetchData} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
                    <RefreshCw className="size-4" /> Retry
                </button>
            </div>
        );
    }

    // Calculate commit authors
    const commitsByAuthor: Record<string, number> = {};
    commits.forEach((commit: any) => {
        const author = commit.commit?.author?.name || 'Unknown';
        commitsByAuthor[author] = (commitsByAuthor[author] || 0) + 1;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">Developer Metrics</h2>
                    <p className="text-muted-foreground mt-1">Real contributors from {selectedRepo.name}</p>
                </div>
                <button onClick={fetchData} className="flex items-center gap-2 bg-secondary text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200">
                    <RefreshCw className="size-4" /> Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl p-5 border border-border">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-sm">Total Contributors</span>
                        <Users className="size-5 text-primary" />
                    </div>
                    <p className="text-3xl font-semibold text-foreground">{contributors.length}</p>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-sm">Total Commits</span>
                        <Code2 className="size-5 text-emerald-600" />
                    </div>
                    <p className="text-3xl font-semibold text-foreground">{commits.length}</p>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-sm">Unique Authors</span>
                        <GitPullRequest className="size-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-semibold text-foreground">{Object.keys(commitsByAuthor).length}</p>
                </div>
            </div>

            {/* Contributors Table */}
            {contributors.length > 0 && (
                <div className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4">Contributors</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/50">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Developer</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Contributions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contributors.map((dev: any, idx: number) => (
                                    <tr key={dev.id || idx} className="border-b border-slate-50 hover:bg-secondary">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <img src={dev.avatar_url} alt={dev.login} className="size-10 rounded-full" />
                                                <div>
                                                    <p className="font-medium text-foreground">{dev.login}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="font-semibold text-foreground">{dev.contributions}</span>
                                            <span className="text-xs text-muted-foreground ml-1">commits</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Two Column: Knowledge Risk + Workload Distribution */}
            {contributors.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Knowledge Concentration Risk */}
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <AlertCircle className="size-5 text-amber-600" />
                            Knowledge Concentration
                            <span className="ml-auto text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
                                Bus Factor Analysis
                            </span>
                        </h3>
                        {(() => {
                            const sortedContribs = [...contributors].sort((a, b) => (b.contributions || 0) - (a.contributions || 0));
                            const topContributor = sortedContribs[0];
                            const totalContribs = sortedContribs.reduce((sum, c) => sum + (c.contributions || 0), 0);
                            const topPercent = topContributor && totalContribs > 0
                                ? Math.round(((topContributor.contributions || 0) / totalContribs) * 100)
                                : 0;
                            const riskLevel = topPercent > 70 ? 'high' : topPercent > 50 ? 'medium' : 'low';

                            return (
                                <div className="space-y-4">
                                    <div className={`p-4 rounded-lg ${riskLevel === 'high' ? 'bg-red-500/10 border border-red-500/30' :
                                        riskLevel === 'medium' ? 'bg-amber-500/10 border border-amber-500/30' :
                                            'bg-emerald-500/10 border border-emerald-500/30'
                                        }`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-foreground">Bus Factor Risk</span>
                                            <span className={`text-sm font-bold ${riskLevel === 'high' ? 'text-red-400' :
                                                riskLevel === 'medium' ? 'text-amber-400' :
                                                    'text-emerald-400'
                                                }`}>
                                                {riskLevel.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {topContributor?.login || 'Top contributor'} owns <strong>{topPercent}%</strong> of project activity
                                        </p>
                                        <div className="w-full bg-secondary rounded-full h-2 mt-2">
                                            <div
                                                className={`h-2 rounded-full ${riskLevel === 'high' ? 'bg-red-500' :
                                                    riskLevel === 'medium' ? 'bg-amber-500' :
                                                        'bg-emerald-500'
                                                    }`}
                                                style={{ width: `${topPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {riskLevel === 'high' ? (
                                            <p>⚠️ <strong>High risk:</strong> Consider cross-training team members and documenting key processes.</p>
                                        ) : riskLevel === 'medium' ? (
                                            <p>⚡ <strong>Moderate risk:</strong> Encourage pair programming and knowledge sharing sessions.</p>
                                        ) : (
                                            <p>✅ <strong>Low risk:</strong> Good distribution of knowledge across the team.</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Workload Distribution */}
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <BarChart3 className="size-5 text-purple-600" />
                            Workload Distribution
                        </h3>
                        <div className="space-y-3">
                            {(() => {
                                const sortedContribs = [...contributors].sort((a, b) => (b.contributions || 0) - (a.contributions || 0));
                                const maxContribs = sortedContribs[0]?.contributions || 1;

                                return sortedContribs.slice(0, 5).map((contributor, idx) => {
                                    const percentage = Math.round(((contributor.contributions || 0) / maxContribs) * 100);
                                    return (
                                        <div key={contributor.login} className="flex items-center gap-3">
                                            <div className="w-24 text-sm text-muted-foreground truncate">{contributor.login}</div>
                                            <div className="flex-1 bg-secondary rounded-full h-4 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${idx === 0 ? 'bg-purple-500' :
                                                        idx === 1 ? 'bg-purple-400' :
                                                            'bg-purple-300'
                                                        }`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <div className="w-12 text-sm font-medium text-muted-foreground text-right">{percentage}%</div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">Based on commits, PRs, and completed tasks</p>
                    </div>
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Zap className="size-5 text-amber-600" />
                    Quick Stats
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="text-center p-3 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold text-primary">{commits.length}</p>
                        <p className="text-xs text-muted-foreground">Total Commits</p>
                    </div>
                    <div className="text-center p-3 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{prs.length}</p>
                        <p className="text-xs text-muted-foreground">Pull Requests</p>
                    </div>
                    <div className="text-center p-3 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold text-emerald-600">{prs.filter((p: any) => p.merged_at).length}</p>
                        <p className="text-xs text-muted-foreground">PRs Merged</p>
                    </div>
                    <div className="text-center p-3 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold text-amber-600">{prs.filter((p: any) => p.state === 'open').length}</p>
                        <p className="text-xs text-muted-foreground">Open PRs</p>
                    </div>
                    <div className="text-center p-3 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold text-red-600">
                            {jiraIssues.filter((i: any) => i.type?.toLowerCase() === 'bug' && i.status?.toLowerCase() !== 'done').length}
                        </p>
                        <p className="text-xs text-muted-foreground">Open Bugs</p>
                    </div>
                    <div className="text-center p-3 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold text-teal-600">{contributors.length}</p>
                        <p className="text-xs text-muted-foreground">Contributors</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity Feed */}
            {commits.length > 0 && (
                <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <GitCommit className="size-5 text-muted-foreground" />
                        Recent Activity
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {commits.slice(0, 10).map((commit: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-3 p-2 hover:bg-secondary rounded-lg">
                                <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-muted-foreground text-xs font-semibold flex-shrink-0">
                                    {(commit.commit?.author?.name || commit.author?.login || 'U')[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-foreground truncate">
                                        {commit.commit?.message?.split('\n')[0] || 'No message'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {commit.commit?.author?.name || commit.author?.login} • {new Date(commit.commit?.author?.date || commit.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {contributors.length === 0 && commits.length === 0 && (
                <div className="bg-card rounded-2xl p-12 border border-border text-center">
                    <Users className="size-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Data Found</h3>
                    <p className="text-muted-foreground">No contributors or commits found for this repository.</p>
                </div>
            )}
        </div>
    );
}
