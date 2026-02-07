import { useState } from 'react';
import { Github, Lock, CheckCircle2, Loader2 } from 'lucide-react';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [step, setStep] = useState<'initial' | 'authenticating' | 'success'>('initial');

    const handleGitHubLogin = () => {
        setIsLoggingIn(true);
        setStep('authenticating');

        // Simulate OAuth flow
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onLoginSuccess();
            }, 800);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl">
                            <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Polaris</h1>
                    <p className="text-blue-200">Enterprise Delivery Intelligence Platform</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
                        <p className="text-blue-100">Sign in with your GitHub account to access enterprise analytics</p>
                    </div>

                    {step === 'initial' && (
                        <button
                            onClick={handleGitHubLogin}
                            disabled={isLoggingIn}
                            className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 text-white px-6 py-4 rounded-xl font-medium transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg"
                        >
                            <Github className="size-5" />
                            <span>Continue with GitHub</span>
                        </button>
                    )}

                    {step === 'authenticating' && (
                        <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-6">
                            <div className="flex items-center gap-4">
                                <Loader2 className="size-6 text-blue-300 animate-spin" />
                                <div>
                                    <p className="text-white font-medium">Authenticating...</p>
                                    <p className="text-blue-200 text-sm mt-1">Verifying your GitHub credentials</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-6">
                            <div className="flex items-center gap-4">
                                <CheckCircle2 className="size-6 text-emerald-300" />
                                <div>
                                    <p className="text-white font-medium">Success!</p>
                                    <p className="text-emerald-200 text-sm mt-1">Redirecting to dashboard...</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-blue-100 text-sm text-center">
                            <Lock className="size-3 inline mr-1" />
                            Simulated OAuth authentication for demo purposes
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    {[
                        { icon: '📊', label: 'DORA Metrics' },
                        { icon: '🤖', label: 'AI Insights' },
                        { icon: '💰', label: 'Cost Analysis' }
                    ].map((feature) => (
                        <div key={feature.label} className="bg-white/5 backdrop-blur rounded-xl p-4">
                            <div className="text-2xl mb-1">{feature.icon}</div>
                            <div className="text-xs text-blue-200">{feature.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
