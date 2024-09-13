import { create } from 'zustand'
import { persist } from 'zustand/middleware';

type userStore = {
    currentUser: any | null;
    loading: Boolean;
    error: any | null;
    isSignedIn: boolean;
    
    signInStart: () => void;
    signInSuccess: (user: any) => void;
    signInFailure: (error: any) => void;
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