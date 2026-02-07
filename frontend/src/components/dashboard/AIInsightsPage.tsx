import { useState, useRef, useEffect } from 'react';
import { Brain, Send, Sparkles, Lightbulb, RefreshCw, Bot, User, Loader2, FileQuestion } from 'lucide-react';
import { askAI, getCommits, getPullRequests, getContributors, getJiraIssues } from '@/api/github';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface SelectedRepo {
    name: string;
}

interface AIInsightsPageProps {
    selectedRepo?: SelectedRepo | null;
}

const suggestedQuestions = [
    "What are the key metrics for this repository?",
    "Summarize the recent PR activity",
    "Who are the most active contributors?",
    "What patterns do you see in the commits?",
];

export function AIInsightsPage({ selectedRepo }: AIInsightsPageProps) {
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
            const [commits, prs, contributors, jiraData] = await Promise.all([
                getCommits(selectedRepo.name),
                getPullRequests(selectedRepo.name),
                getContributors(selectedRepo.name),
                getJiraIssues()
            ]);

            setContext({
                repo: selectedRepo.name,
                github: {
                    commits: commits.length,
                    prs: prs.length,
                    openPRs: prs.filter((p: any) => p.state === 'open').length,
                    contributors: contributors.length,
                    topContributors: contributors.slice(0, 5).map((c: any) => c.login)
                },
                jira: {
                    issues: jiraData.length,
                    bugs: jiraData.filter((i: any) => i.type?.toLowerCase() === 'bug').length,
                    done: jiraData.filter((i: any) => i.status?.toLowerCase() === 'done').length
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
            const response = await askAI(messageText, context);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.response || response.error || 'I could not generate a response. Please check if the AI service is configured.',
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
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                <FileQuestion className="size-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a Repository</h3>
                <p className="text-slate-600">Choose a repository to get AI-powered insights.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">AI Insights</h2>
                    <p className="text-slate-600 mt-1">Ask questions about {selectedRepo.name}</p>
                </div>
                <button
                    onClick={fetchContext}
                    className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200"
                >
                    <RefreshCw className="size-4" /> Refresh Context
                </button>
            </div>

            {/* Context Summary */}
            {context && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                            <Sparkles className="size-4 text-blue-600" />
                            <span className="text-sm">Commits</span>
                        </div>
                        <p className="text-2xl font-semibold text-slate-900">{context.github?.commits || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                            <Sparkles className="size-4 text-purple-600" />
                            <span className="text-sm">PRs</span>
                        </div>
                        <p className="text-2xl font-semibold text-slate-900">{context.github?.prs || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                            <Sparkles className="size-4 text-emerald-600" />
                            <span className="text-sm">Contributors</span>
                        </div>
                        <p className="text-2xl font-semibold text-slate-900">{context.github?.contributors || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                            <Sparkles className="size-4 text-indigo-600" />
                            <span className="text-sm">Jira Issues</span>
                        </div>
                        <p className="text-2xl font-semibold text-slate-900">{context.jira?.issues || 0}</p>
                    </div>
                </div>
            )}

            {/* Chat Area */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {/* Messages */}
                <div className="h-[400px] overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <Brain className="size-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Assistant</h3>
                            <p className="text-slate-600 mb-6">Ask me anything about {selectedRepo.name}</p>

                            <div className="flex flex-wrap justify-center gap-2">
                                {suggestedQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(q)}
                                        className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm transition-colors"
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
                                            : 'bg-slate-100 text-slate-900'
                                        }`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="size-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="size-4 text-slate-600" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <div className="size-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                                        <Bot className="size-4 text-white" />
                                    </div>
                                    <div className="bg-slate-100 rounded-2xl p-4">
                                        <Loader2 className="size-5 text-blue-600 animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="border-t border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about this repository..."
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
