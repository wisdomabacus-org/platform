import { create } from 'zustand';

export interface QuestionOption {
  _id: string;
  text: string;
}
export interface Question {
  _id: string;
  questionText: string;
  options: QuestionOption[];
  correctOptionId: string;
}

type Draft = {
  questionText: string;
  options: string[];       // length 4
  correctIndex: number | null;
};

type State = {
  original: Question[];
  questions: Question[];
  activeId: string | null;
  isEditing: boolean;
  draft: Draft;

  load: (items: Question[]) => void;
  setActive: (id: string | null) => void;
  setDraft: (patch: Partial<Draft>) => void;
  add: () => void;
  update: () => void;
  remove: (id: string) => void;
  newDraft: () => void;

  hasChanges: () => boolean;
  discard: () => void;
};

const emptyDraft = (): Draft => ({
  questionText: '',
  options: ['', '', '', ''],
  correctIndex: null,
});

const genId = () => Math.random().toString(36).slice(2, 10);

export const useMockQStore = create<State>((set, get) => ({
  original: [],
  questions: [],
  activeId: null,
  isEditing: false,
  draft: emptyDraft(),

  load: (items) =>
    set({ original: items, questions: items, activeId: null, isEditing: false, draft: emptyDraft() }),

  setActive: (id) => {
    if (!id) {
      set({ activeId: null, isEditing: false, draft: emptyDraft() });
      return;
    }
    const q = get().questions.find((x) => x._id === id);
    if (!q) return;
    const idx = q.options.findIndex((o) => o._id === q.correctOptionId);
    set({
      activeId: id,
      isEditing: true,
      draft: {
        questionText: q.questionText,
        options: q.options.map((o) => o.text).slice(0, 4).concat(Array(4).fill('')).slice(0, 4),
        correctIndex: idx >= 0 ? idx : null,
      },
    });
  },

  setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),

  newDraft: () => set({ activeId: null, isEditing: false, draft: emptyDraft() }),

  add: () => {
    const { draft, questions } = get();
    const idx = draft.correctIndex ?? 0;
    const id = genId();
    const optIds = [genId(), genId(), genId(), genId()];
    const q = {
      _id: id,
      questionText: draft.questionText.trim(),
      options: draft.options.map((t, i) => ({ _id: optIds[i], text: t.trim() })),
      correctOptionId: optIds[idx],
    };
    set({ questions: [...questions, q], draft: emptyDraft(), isEditing: false, activeId: null });
  },

  update: () => {
    const { draft, questions, activeId } = get();
    if (!activeId) return;
    const idx = draft.correctIndex ?? 0;
    const i = questions.findIndex((q) => q._id === activeId);
    if (i < 0) return;
    const old = questions[i];
    const updatedOptions = old.options.map((opt, j) => ({ ...opt, text: draft.options[j] ?? '' }));
    const next = {
      ...old,
      questionText: draft.questionText.trim(),
      options: updatedOptions,
      correctOptionId: updatedOptions[idx]._id,
    };
    const copy = [...questions];
    copy[i] = next;
    set({ questions: copy });
  },

  remove: (id) =>
    set((s) => {
      const next = s.questions.filter((q) => q._id !== id);
      const activeGone = s.activeId === id;
      return {
        questions: next,
        ...(activeGone ? { activeId: null, isEditing: false, draft: emptyDraft() } : {}),
      };
    }),

  hasChanges: () => JSON.stringify(get().original) !== JSON.stringify(get().questions),

  discard: () =>
    set((s) => ({ questions: s.original, activeId: null, isEditing: false, draft: emptyDraft() })),
}));
