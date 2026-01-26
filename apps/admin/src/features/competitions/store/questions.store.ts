import { create } from 'zustand';

export interface QuestionOption {
  _id: string;
  text: string;
}
export interface Question {
  _id: string;
  questionText: string;
  imageUrl?: string;
  options: QuestionOption[];
  correctOptionId: string;
}

type FormDraft = {
  questionText: string;
  options: string[];
  correctIndex: number | null;
};

type QuestionsState = {
  original: Question[];
  questions: Question[];
  activeId: string | null;
  draft: FormDraft;
  isEditing: boolean;

  // actions
  load: (items: Question[]) => void;
  setActive: (id: string | null) => void;
  clearDraft: () => void;
  setDraft: (patch: Partial<FormDraft>) => void;
  newQuestion: () => void;
  addQuestion: () => void;
  updateQuestion: () => void;
  deleteQuestion: (id: string) => void;

  hasChanges: () => boolean;
  discardChanges: () => void;
};

const emptyDraft = (): FormDraft => ({
  questionText: '',
  options: ['', '', '', ''],
  correctIndex: null,
});

const genId = () => Math.random().toString(36).slice(2, 10);

export const useQuestionsStore = create<QuestionsState>((set, get) => ({
  original: [],
  questions: [],
  activeId: null,
  draft: emptyDraft(),
  isEditing: false,

  load: (items) =>
    set({
      original: items,
      questions: items,
      activeId: null,
      draft: emptyDraft(),
      isEditing: false,
    }),

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
        options: q.options
          .map((o) => o.text)
          .slice(0, 4)
          .concat(Array(4).fill(''))
          .slice(0, 4),
        correctIndex: idx >= 0 ? idx : null,
      },
    });
  },

  clearDraft: () => set({ draft: emptyDraft(), isEditing: false, activeId: null }),

  setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),

  newQuestion: () => set({ isEditing: false, activeId: null, draft: emptyDraft() }),

  addQuestion: () => {
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
    set({
      questions: [...questions, q],
      draft: emptyDraft(),
      isEditing: false,
      activeId: null,
    });
  },

  updateQuestion: () => {
    const { draft, questions, activeId } = get();
    if (!activeId) return;
    const idx = draft.correctIndex ?? 0;
    const qIdx = questions.findIndex((q) => q._id === activeId);
    if (qIdx < 0) return;

    const old = questions[qIdx];
    const updatedOptions = old.options.map((opt, i) => ({
      ...opt,
      text: (draft.options[i] ?? '').trim(),
    }));
    const next = {
      ...old,
      questionText: draft.questionText.trim(),
      options: updatedOptions,
      correctOptionId: updatedOptions[idx]._id,
    };
    const copy = [...questions];
    copy[qIdx] = next;
    set({ questions: copy });
  },

  deleteQuestion: (id) => {
    set((s) => {
      const next = s.questions.filter((q) => q._id !== id);
      const activeGone = s.activeId === id;
      return {
        questions: next,
        ...(activeGone ? { activeId: null, draft: emptyDraft(), isEditing: false } : {}),
      };
    });
  },

  hasChanges: () => {
    const a = get().original;
    const b = get().questions;
    return JSON.stringify(a) !== JSON.stringify(b);
  },

  discardChanges: () =>
    set((s) => ({
      questions: s.original,
      activeId: null,
      draft: emptyDraft(),
      isEditing: false,
    })),
}));
