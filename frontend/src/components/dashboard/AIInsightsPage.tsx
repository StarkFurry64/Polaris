import { useState, useRef, useEffect } from 'react';
import { Brain, Send, Sparkles, Lightbulb, RefreshCw, Bot, User, Loader2, FileQuestion } from 'lucide-react';
import { askAI, getCommits, getPullRequests, getContributors, getJiraIssues, getGitHubIssues } from '@/api/github';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface SelectedRepo {
    name: string;
    fullName?: string;
}

interface AIInsightsPageProps {
    selectedRepo?: SelectedRepo | null;
    githubToken?: string | null;
}

const suggestedQuestions = [
    "What are the key metrics for this repository?",
    "Summarize the recent PR activity",
    "Who are the most active contributors?",
    "What patterns do you see in the commits?",
];

export function AIInsightsPage({ selectedRepo, githubToken }: AIInsightsPageProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [context, setContext] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch real context when repo changes
    useEffect(() => {
        if (selectedRepo) {
            fetchContext();
        }
    }, [selectedRepo]);

    const fetchContext = async () => {
        if (!selectedRepo) return;

        try {
            const repoFullName = selectedRepo.fullName || selectedRepo.name;
            const [commits, prs, contributors, issuesData] = await Promise.all([
                getCommits(repoFullName, githubToken),
                getPullRequests(repoFullName, githubToken),
                getContributors(repoFullName, githubToken),
                getGitHubIssues(repoFullName, githubToken)
            ]);

            // Count bugs based on 'bug' label
            const bugs = (issuesData || []).filter((i: any) =>
                i.labels?.some((l: any) => l.name?.toLowerCase().includes('bug'))
            );
            const openIssues = (issuesData || []).filter((i: any) => i.state === 'open');

            setContext({
                repo: selectedRepo.name,
                github: {
                    commits: commits.length,
                    prs: prs.length,
                    openPRs: prs.filter((p: any) => p.state === 'open').length,
                    contributors: contributors.length,
                    topContributors: contributors.slice(0, 5).map((c: any) => c.login)
                },
                issues: {
                    total: (issuesData || []).length,
                    bugs: bugs.length,
                    open: openIssues.length,
                    closed: (issuesData || []).length - openIssues.length
                }
            });
        } catch (err) {
            console.error('Failed to fetch context:', err);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (question?: string) => {
        const messageText = question || input;
        if (!messageText.trim() || isLoading || !selectedRepo) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await askAI(messageText, selectedRepo.name);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.data?.answer || response.error || 'I could not generate a response. Please check if the AI service is configured.',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please make sure the Featherless AI API key is configured in the backend .env file.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // No repo selected
    if (!selectedRepo) {
        return (
            <div className="bg-card rounded-2xl p-12 border border-border text-center">
                <FileQuestion className="size-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Select a Repository</h3>
                <p className="text-muted-foreground">Choose a repository to get AI-powered insights.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">AI Insights</h2>
                    <p className="text-muted-foreground mt-1">Ask questions about {selectedRepo.name}</p>
                </div>
                <button
                    onClick={fetchContext}
                    className="flex items-center gap-2 bg-secondary text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200"
                >
                    <RefreshCw className="size-4" /> Refresh Context
                </button>
            </div>

            {/* Context Summary */}
            {context && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-card rounded-xl p-4 border border-border">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Sparkles className="size-4 text-primary" />
                            <span className="text-sm">Commits</span>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">{context.github?.commits || 0}</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Sparkles className="size-4 text-purple-600" />
                            <span className="text-sm">PRs</span>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">{context.github?.prs || 0}</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Sparkles className="size-4 text-emerald-600" />
                            <span className="text-sm">Contributors</span>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">{context.github?.contributors || 0}</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 border border-border">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Sparkles className="size-4 text-indigo-600" />
                            <span className="text-sm">Issues</span>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">{context.issues?.total || 0}</p>
                    </div>
                </div>
            )}

            {/* Chat Area */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
                {/* Messages */}
                <div className="h-[400px] overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <Brain className="size-12 text-primary mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">AI Assistant</h3>
                            <p className="text-muted-foreground mb-6">Ask me anything about {selectedRepo.name}</p>

                            <div className="flex flex-wrap justify-center gap-2">
                                {suggestedQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(q)}
                                        className="flex items-center gap-1.5 bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg text-sm transition-colors border border-border hover:border-primary/30"
                                    >
                                        <Lightbulb className="size-4 text-amber-500" />
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="size-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Bot className="size-4 text-white" />
                                        </div>
                                    )}
                                    <div className={`max-w-[70%] rounded-2xl p-4 ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                                        : 'bg-secondary text-foreground'
                                        }`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="size-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="size-4 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <div className="size-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                                        <Bot className="size-4 text-white" />
                                    </div>
                                    <div className="bg-secondary rounded-2xl p-4">
                                        <Loader2 className="size-5 text-primary animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="border-t border-border p-4">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about this repository..."
                            className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="size-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
