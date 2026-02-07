import { useState, useEffect } from 'react';
import { Users, Code2, GitPullRequest, Loader2, AlertTriangle, RefreshCw, FileQuestion } from 'lucide-react';
import { getContributors, getCommits } from '@/api/github';

interface SelectedRepo {
    name: string;
}

interface DeveloperMetricsPageProps {
    selectedRepo?: SelectedRepo | null;
}

export function DeveloperMetricsPage({ selectedRepo }: DeveloperMetricsPageProps) {
    const [loading, setLoading] = useState(false);
    const [contributors, setContributors] = useState<any[]>([]);
    const [commits, setCommits] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!selectedRepo) return;

        setLoading(true);
        setError(null);

        try {
            const [contribData, commitsData] = await Promise.all([
                getContributors(selectedRepo.name),
                getCommits(selectedRepo.name)
            ]);

            setContributors(contribData);
            setCommits(commitsData);
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
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                <FileQuestion className="size-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a Repository</h3>
                <p className="text-slate-600">Choose a repository to view developer metrics.</p>
            </div>
        );
    }

    // Loading
    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                <Loader2 className="size-12 text-blue-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Loading Developer Metrics...</h3>
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
                    <h2 className="text-2xl font-semibold text-slate-900">Developer Metrics</h2>
                    <p className="text-slate-600 mt-1">Real contributors from {selectedRepo.name}</p>
                </div>
                <button onClick={fetchData} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200">
                    <RefreshCw className="size-4" /> Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 text-sm">Total Contributors</span>
                        <Users className="size-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-semibold text-slate-900">{contributors.length}</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 text-sm">Total Commits</span>
                        <Code2 className="size-5 text-emerald-600" />
                    </div>
                    <p className="text-3xl font-semibold text-slate-900">{commits.length}</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 text-sm">Unique Authors</span>
                        <GitPullRequest className="size-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-semibold text-slate-900">{Object.keys(commitsByAuthor).length}</p>
                </div>
            </div>

            {/* Contributors Table */}
            {contributors.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Contributors</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Developer</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Contributions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contributors.map((dev: any, idx: number) => (
                                    <tr key={dev.id || idx} className="border-b border-slate-50 hover:bg-slate-50">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <img src={dev.avatar_url} alt={dev.login} className="size-10 rounded-full" />
                                                <div>
                                                    <p className="font-medium text-slate-900">{dev.login}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="font-semibold text-slate-900">{dev.contributions}</span>
                                            <span className="text-xs text-slate-500 ml-1">commits</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Commits by Author */}
            {Object.keys(commitsByAuthor).length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Recent Commit Authors</h3>
                    <div className="space-y-3">
                        {Object.entries(commitsByAuthor)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 10)
                            .map(([author, count]) => (
                                <div key={author} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="font-medium text-slate-900">{author}</span>
                                    <span className="text-sm text-slate-600">{count} commits</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {contributors.length === 0 && commits.length === 0 && (
                <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                    <Users className="size-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No Data Found</h3>
                    <p className="text-slate-600">No contributors or commits found for this repository.</p>
                </div>
            )}
        </div>
    );
}
