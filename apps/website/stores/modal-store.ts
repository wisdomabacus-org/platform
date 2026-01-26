import { create } from 'zustand';

type AuthView = 'login' | 'register';

interface AuthModalStore {
    isOpen: boolean;
    view: AuthView;
    onOpen: (view?: AuthView) => void;
    onClose: () => void;
    setView: (view: AuthView) => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
    isOpen: false,
    view: 'login',
    onOpen: (view = 'login') => set({ isOpen: true, view }),
    onClose: () => set({ isOpen: false }),
    setView: (view) => set({ view }),
}));

interface ProfileModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useProfileModal = create<ProfileModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
