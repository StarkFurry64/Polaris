import { useState, useEffect } from 'react';
import { Folder, Loader2, RefreshCw, ChevronDown, AlertCircle } from 'lucide-react';
import { getRepositories } from '@/api/github';

interface Repository {
    name: string;
    fullName: string;
    updatedAt: string;
    private: boolean;
}

interface RepositorySelectorProps {
    onRepositorySelect: (repo: Repository | null) => void;
    selectedRepo: Repository | null;
}

export function RepositorySelector({ onRepositorySelect, selectedRepo }: RepositorySelectorProps) {
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const fetchRepos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getRepositories();
            if (data.length > 0) {
                setRepos(data);
            } else {
                setError('No repositories found');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch repositories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRepos();
    }, []);

    const handleSelect = (repo: Repository) => {
        onRepositorySelect(repo);
        setIsOpen(false);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Folder className="size-4" />
                    <span className="font-medium">Repository:</span>
                </div>

                <div className="relative flex-1 max-w-md">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || repos.length === 0}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="size-4 animate-spin text-blue-600" />
                                <span className="text-slate-600">Loading repositories...</span>
                            </>
                        ) : repos.length === 0 ? (
                            <span className="text-slate-500 text-sm">Select a repository to begin</span>
                        ) : selectedRepo ? (
                            <>
                                <span className="font-medium text-slate-900">{selectedRepo.name}</span>
                                <ChevronDown className={`size-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </>
                        ) : (
                            <>
                                <span className="text-slate-500">Select Repository</span>
                                <ChevronDown className="size-4 text-slate-400" />
                            </>
                        )}
                    </button>

                    {isOpen && !loading && repos.length > 0 && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-[300px] overflow-y-auto z-50">
                            {repos.map((repo) => (
                                <button
                                    key={repo.name}
                                    onClick={() => handleSelect(repo)}
                                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 ${selectedRepo?.name === repo.name ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <span className="font-medium text-slate-900">{repo.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={fetchRepos}
                    disabled={loading}
                    className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50"
                    title="Refresh"
                >
                    <RefreshCw className={`size-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>
    );
}
