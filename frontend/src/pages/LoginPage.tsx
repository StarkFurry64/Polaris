import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Github, Star, Zap, Shield } from 'lucide-react';
import { useEffect } from 'react';

export default function LoginPage() {
    const { user, signInWithGitHub, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleGitHubLogin = async () => {
        try {
            await signInWithGitHub();
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Login failed:', error);
            alert('Login failed: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
            {/* Header */}
            <header className="p-6">
                <div className="flex items-center gap-2">
                    <Star className="h-8 w-8 text-blue-400" />
                    <span className="text-2xl font-bold text-white">Polaris</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    {/* Login Card */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                                <Star className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Welcome to Polaris</h1>
                            <p className="text-slate-400">
                                Sign in with GitHub to access your repositories and start analyzing your engineering metrics.
                            </p>
                        </div>

                        {/* Login Button */}
                        <Button
                            onClick={handleGitHubLogin}
                            className="w-full py-6 text-lg bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
                        >
                            <Github className="h-6 w-6" />
                            Continue with GitHub
                        </Button>

                        {/* Features */}
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Zap className="h-4 w-4 text-blue-400" />
                                </div>
                                <span className="text-sm">Access all your GitHub repositories</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Star className="h-4 w-4 text-purple-400" />
                                </div>
                                <span className="text-sm">AI-powered insights and analytics</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Shield className="h-4 w-4 text-green-400" />
                                </div>
                                <span className="text-sm">Chat history saved securely</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-slate-500 text-sm mt-6">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </main>
        </div>
    );
}
