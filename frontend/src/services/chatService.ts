import {
    ref,
    push,
    set,
    get,
    update,
    query,
    orderByChild,
    serverTimestamp
} from 'firebase/database';
import { database } from '@/lib/firebase';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface Chat {
    id: string;
    repo: string;
    createdAt: number;
    updatedAt: number;
    messages: ChatMessage[];
    title?: string;
}

// Get all chats for a user
export async function getUserChats(userId: string): Promise<Chat[]> {
    const chatsRef = ref(database, `users/${userId}/chats`);
    const snapshot = await get(chatsRef);

    if (!snapshot.exists()) {
        return [];
    }

    const chatsData = snapshot.val();
    const chats: Chat[] = [];

    for (const [id, data] of Object.entries(chatsData) as [string, any][]) {
        chats.push({
            id,
            repo: data.repo,
            createdAt: data.createdAt || Date.now(),
            updatedAt: data.updatedAt || Date.now(),
            messages: data.messages ? Object.values(data.messages) : [],
            title: data.title
        });
    }

    // Sort by updatedAt descending
    return chats.sort((a, b) => b.updatedAt - a.updatedAt);
}

// Create a new chat
export async function createChat(userId: string, repo: string): Promise<string> {
    const chatsRef = ref(database, `users/${userId}/chats`);
    const newChatRef = push(chatsRef);

    await set(newChatRef, {
        repo,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [],
        title: `Chat about ${repo}`
    });

    return newChatRef.key!;
}

// Add a message to a chat
export async function addMessageToChat(
    userId: string,
    chatId: string,
    message: Omit<ChatMessage, 'timestamp'>
): Promise<void> {
    const messagesRef = ref(database, `users/${userId}/chats/${chatId}/messages`);
    const newMessageRef = push(messagesRef);

    await set(newMessageRef, {
        ...message,
        timestamp: Date.now()
    });

    // Update the chat's updatedAt timestamp
    const chatRef = ref(database, `users/${userId}/chats/${chatId}`);
    await update(chatRef, {
        updatedAt: Date.now()
    });
}

// Get a specific chat
export async function getChat(userId: string, chatId: string): Promise<Chat | null> {
    const chatRef = ref(database, `users/${userId}/chats/${chatId}`);
    const snapshot = await get(chatRef);

    if (!snapshot.exists()) {
        return null;
    }

    const data = snapshot.val();
    return {
        id: chatId,
        repo: data.repo,
        createdAt: data.createdAt || Date.now(),
        updatedAt: data.updatedAt || Date.now(),
        messages: data.messages ? Object.values(data.messages) : [],
        title: data.title
    };
}

// Save user profile
export async function saveUserProfile(userId: string, profile: {
    displayName: string | null;
    email: string | null;
    avatarUrl: string | null;
    githubUsername: string | null;
}): Promise<void> {
    const userRef = ref(database, `users/${userId}/profile`);
    await set(userRef, {
        ...profile,
        updatedAt: Date.now()
    });
}
