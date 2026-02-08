import { useState, useEffect } from 'react';
import { Folder, Loader2, RefreshCw, ChevronDown, Github } from 'lucide-react';

interface Repository {
    name: string;
    fullName: string;
    updatedAt: string;
    private: boolean;
}

interface RepositorySelectorProps {
    onRepositorySelect: (repo: Repository | null) => void;
    selectedRepo: Repository | null;
    githubToken?: string | null;
}

export function RepositorySelector({ onRepositorySelect, selectedRepo, githubToken }: RepositorySelectorProps) {
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const fetchRepos = async () => {
        setLoading(true);
        setError(null);
        try {
            let data: Repository[] = [];

            if (githubToken) {
                // Fetch repos using authenticated user's GitHub token
                const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
                    headers: {
                        Authorization: `Bearer ${githubToken}`,
                        Accept: 'application/vnd.github+json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch repositories');
                }

                const repos = await response.json();
                data = repos.map((repo: any) => ({
                    name: repo.name,
                    fullName: repo.full_name,
                    updatedAt: repo.updated_at,
                    private: repo.private
                }));
            } else {
                // Fallback to backend API (uses GITHUB_OWNER from .env)
                const response = await fetch('http://localhost:3001/api/github/repos');
                const result = await response.json();
                if (result.success) {
                    data = result.data;
                }
            }

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
    }, [githubToken]);

    const handleSelect = (repo: Repository) => {
        onRepositorySelect(repo);
        setIsOpen(false);
    };

    return (
        <div className="linear-card border-glow p-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Folder className="size-4" />
                    <span className="font-medium">Repository:</span>
                    {githubToken && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs">
                            <Github className="size-3" />
                            Your repos
                        </span>
                    )}
                </div>

                <div className="relative flex-1 max-w-md">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between gap-3 bg-secondary border border-border rounded-lg px-4 py-2.5 hover:bg-secondary/80 hover:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || repos.length === 0}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="size-4 animate-spin text-primary" />
                                <span className="text-muted-foreground">Loading repositories...</span>
                            </>
                        ) : repos.length === 0 ? (
                            <span className="text-muted-foreground text-sm">Select a repository to begin</span>
                        ) : selectedRepo ? (
                            <>
                                <span className="font-medium text-foreground">{selectedRepo.name}</span>
                                <ChevronDown className={`size-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </>
                        ) : (
                            <>
                                <span className="text-muted-foreground">Select Repository</span>
                                <ChevronDown className="size-4 text-muted-foreground" />
                            </>
                        )}
                    </button>

                    {isOpen && !loading && repos.length > 0 && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-card border border-border rounded-lg shadow-elevated max-h-[300px] overflow-y-auto z-50">
                            {repos.map((repo) => (
                                <button
                                    key={repo.name}
                                    onClick={() => handleSelect(repo)}
                                    className={`w-full text-left px-4 py-3 hover:bg-secondary border-b border-border/50 last:border-0 flex items-center justify-between transition-colors ${selectedRepo?.name === repo.name ? 'bg-primary/10 text-primary' : ''
                                        }`}
                                >
                                    <span className="font-medium text-foreground">{repo.name}</span>
                                    {repo.private && (
                                        <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded">Private</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={fetchRepos}
                    disabled={loading}
                    className="p-2 bg-secondary rounded-lg hover:bg-secondary/80 hover:text-primary transition-all disabled:opacity-50"
                    title="Refresh"
                >
                    <RefreshCw className={`size-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>
    );
}
