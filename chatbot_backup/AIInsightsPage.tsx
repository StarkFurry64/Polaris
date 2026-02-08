import { useState, useRef, useEffect } from 'react';
import { Brain, Send, Lightbulb, Bot, User, Loader2, FileQuestion } from 'lucide-react';
import { askAI } from '@/api/github';

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
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
            // Send repo name to backend - backend will build context
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
                content: 'Sorry, I encountered an error. Please make sure the AI service is configured in the backend .env file.',
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
            </div>

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
