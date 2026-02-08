import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    UserCredential
} from 'firebase/auth';
import { auth, githubProvider } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    githubToken: string | null;
    loading: boolean;
    signInWithGitHub: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [githubToken, setGithubToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);

            // Try to get cached token
            const cachedToken = localStorage.getItem('github_token');
            if (cachedToken && user) {
                setGithubToken(cachedToken);
            }
        });

        return () => unsubscribe();
    }, []);

    const signInWithGitHub = async () => {
        try {
            const result: UserCredential = await signInWithPopup(auth, githubProvider);

            // Get the GitHub OAuth access token
            const credential = await (await import('firebase/auth')).GithubAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;

            if (token) {
                setGithubToken(token);
                localStorage.setItem('github_token', token);
            }

            setUser(result.user);
        } catch (error: any) {
            console.error('GitHub sign-in error:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
            setGithubToken(null);
            localStorage.removeItem('github_token');
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    };

    const value = {
        user,
        githubToken,
        loading,
        signInWithGitHub,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
