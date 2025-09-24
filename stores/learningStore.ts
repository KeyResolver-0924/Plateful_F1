import { create } from 'zustand';

export interface LearningContent {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'quiz';
  category: 'nutrition' | 'cooking' | 'health';
  isCompleted: boolean;
  progress: number;
}

export interface LearningState {
  content: LearningContent[];
  currentContent: LearningContent | null;
  isLoading: boolean;
  error: string | null;
}

export interface LearningActions {
  setContent: (content: LearningContent[]) => void;
  completeContent: (contentId: string) => void;
  updateProgress: (contentId: string, progress: number) => void;
  setCurrentContent: (content: LearningContent | null) => void;
  getCompletedContent: () => LearningContent[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type LearningStore = LearningState & LearningActions;

export const useLearningStore = create<LearningStore>((set, get) => ({
  content: [],
  currentContent: null,
  isLoading: false,
  error: null,

  setContent: (content) => set({ content }),
  
  completeContent: (contentId) => {
    const { content } = get();
    const updatedContent = content.map(item =>
      item.id === contentId
        ? { ...item, isCompleted: true, progress: 100 }
        : item
    );
    set({ content: updatedContent });
  },
  
  updateProgress: (contentId, progress) => {
    const { content } = get();
    const updatedContent = content.map(item =>
      item.id === contentId
        ? { ...item, progress: Math.min(100, Math.max(0, progress)) }
        : item
    );
    set({ content: updatedContent });
  },
  
  setCurrentContent: (content) => set({ currentContent: content }),
  
  getCompletedContent: () => {
    return get().content.filter(item => item.isCompleted);
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
})); 