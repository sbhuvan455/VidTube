import { create } from 'zustand'
import { persist } from 'zustand/middleware';

interface User {
    _id: string;
    username: string;
    email: string;
    fullname: string;
    avatar: string;
    coverImage: string;
    watchHistory: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    refreshTokens: string;
}

interface Error {
    message: string;
    success: boolean;
    statusCode: number;
}

type userStore = {
    currentUser: User | null;
    loading: boolean;
    error: Error | null;
    isSignedIn: boolean;
    
    signInStart: () => void;
    signInSuccess: (user: User) => void;
    signInFailure: (error: Error) => void;
    signOut: () => void;
}

export const useUserStore = create<userStore>()(persist((set) => ({
    currentUser: null,
    loading: false,
    error: null,
    isSignedIn: false,

    signInStart: () => set({
        loading: true,
    }),
    signInSuccess: (user) => set({
        currentUser: user,
        loading: false,
        isSignedIn: true,
        error: null,
    }),
    signInFailure: (error) => set({
        currentUser: null,
        loading: false,
        error: error,
    }),
    signOut: () => set({
        currentUser: null,
        loading: false,
        isSignedIn: false,
        error: null
    })
}), {
    name: 'user store',
}))