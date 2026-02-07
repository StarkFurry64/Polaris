import { useState, useEffect } from 'react';
import { GitPullRequest, Loader2, AlertTriangle, RefreshCw, FileQuestion, GitMerge, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getPullRequests } from '@/api/github';

interface SelectedRepo {
    name: string;
}

interface PRAnalyticsPageProps {
    selectedRepo?: SelectedRepo | null;
}

export function PRAnalyticsPage({ selectedRepo }: PRAnalyticsPageProps) {
    const [loading, setLoading] = useState(false);
    const [prs, setPrs] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!selectedRepo) return;

        setLoading(true);
        setError(null);

        try {
            const data = await getPullRequests(selectedRepo.name);
            setPrs(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch PRs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedRepo) {
            fetchData();
        }
    }, [selectedRepo]);

    // Calculate metrics
    const openPRs = prs.filter(pr => pr.state === 'open');
    const closedPRs = prs.filter(pr => pr.state === 'closed');
    const mergedPRs = prs.filter(pr => pr.merged_at);

    // No repo selected
    if (!selectedRepo) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                <FileQuestion className="size-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a Repository</h3>
                <p className="text-slate-600">Choose a repository to view PR analytics.</p>
            </div>
        );
    }

    // Loading
    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                <Loader2 className="size-12 text-blue-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Loading PR Analytics...</h3>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                <AlertTriangle className="size-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Data</h3>
                <p className="text-slate-600 mb-4">{error}</p>
                <button onClick={fetchData} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
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
                    <h2 className="text-2xl font-semibold text-slate-900">PR Analytics</h2>
                    <p className="text-slate-600 mt-1">Real pull requests from {selectedRepo.name}</p>
                </div>
                <button onClick={fetchData} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200">
                    <RefreshCw className="size-4" /> Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 text-sm">Total PRs</span>
                        <GitPullRequest className="size-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-semibold text-slate-900">{prs.length}</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 text-sm">Open</span>
                        <Clock className="size-5 text-amber-600" />
                    </div>
                    <p className="text-3xl font-semibold text-amber-600">{openPRs.length}</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 text-sm">Merged</span>
                        <GitMerge className="size-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-semibold text-purple-600">{mergedPRs.length}</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 text-sm">Closed</span>
                        <XCircle className="size-5 text-slate-600" />
                    </div>
                    <p className="text-3xl font-semibold text-slate-600">{closedPRs.length - mergedPRs.length}</p>
                </div>
            </div>

            {/* Open PRs */}
            {openPRs.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Clock className="size-5 text-amber-600" />
                        Open Pull Requests ({openPRs.length})
                    </h3>
                    <div className="space-y-3">
                        {openPRs.map((pr: any) => (
                            <div key={pr.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 truncate">{pr.title}</p>
                                    <p className="text-sm text-slate-500">#{pr.number} by {pr.user?.login} • {new Date(pr.created_at).toLocaleDateString()}</p>
                                </div>
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium ml-3">
                                    Open
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Merged PRs */}
            {mergedPRs.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <GitMerge className="size-5 text-purple-600" />
                        Recently Merged ({mergedPRs.length})
                    </h3>
                    <div className="space-y-3">
                        {mergedPRs.slice(0, 10).map((pr: any) => (
                            <div key={pr.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 truncate">{pr.title}</p>
                                    <p className="text-sm text-slate-500">#{pr.number} by {pr.user?.login} • merged {new Date(pr.merged_at).toLocaleDateString()}</p>
                                </div>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium ml-3">
                                    Merged
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All PRs Table */}
            {prs.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">All Pull Requests</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">#</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Title</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Author</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Created</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prs.slice(0, 20).map((pr: any) => (
                                    <tr key={pr.id} className="border-b border-slate-50 hover:bg-slate-50">
                                        <td className="py-3 px-4 text-sm text-slate-600">#{pr.number}</td>
                                        <td className="py-3 px-4 text-sm font-medium text-slate-900 max-w-xs truncate">{pr.title}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <img src={pr.user?.avatar_url} alt={pr.user?.login} className="size-6 rounded-full" />
                                                <span className="text-sm text-slate-700">{pr.user?.login}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-600">{new Date(pr.created_at).toLocaleDateString()}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${pr.merged_at ? 'bg-purple-100 text-purple-700' :
                                                    pr.state === 'open' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-slate-100 text-slate-700'
                                                }`}>
                                                {pr.merged_at ? 'Merged' : pr.state}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {prs.length === 0 && (
                <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                    <GitPullRequest className="size-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No Pull Requests</h3>
                    <p className="text-slate-600">No pull requests found for this repository.</p>
                </div>
            )}
        </div>
    );
}
