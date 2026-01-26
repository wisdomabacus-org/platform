import { create } from 'zustand';

interface WorksheetStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useWorksheetStore = create<WorksheetStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));