import { create } from 'zustand';
import type { LiveClassInfo } from '../types/live-class.types';

type ModalMode = 'create' | 'edit';

interface LiveClassUiState {
  modalOpen: boolean;
  mode: ModalMode;
  editing?: LiveClassInfo | null;

  openCreate: () => void;
  openEdit: (lc: LiveClassInfo) => void;
  close: () => void;
}

export const useLiveClassUiStore = create<LiveClassUiState>((set) => ({
  modalOpen: false,
  mode: 'create',
  editing: null,
  openCreate: () => set({ modalOpen: true, mode: 'create', editing: null }),
  openEdit: (lc) => set({ modalOpen: true, mode: 'edit', editing: lc }),
  close: () => set({ modalOpen: false, editing: null }),
}));
