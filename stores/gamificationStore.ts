import { create } from 'zustand';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface GamificationState {
  badges: Badge[];
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  isLoading: boolean;
  error: string | null;
}

export interface GamificationActions {
  unlockBadge: (badgeId: string) => void;
  updateBadgeProgress: (badgeId: string, progress: number) => void;
  addPoints: (points: number) => void;
  updateStreak: (increment: boolean) => void;
  resetStreak: () => void;
  setBadges: (badges: Badge[]) => void;
  setTotalPoints: (points: number) => void;
  setCurrentStreak: (streak: number) => void;
  setLongestStreak: (streak: number) => void;
  setLevel: (level: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type GamificationStore = GamificationState & GamificationActions;

export const useGamificationStore = create<GamificationStore>((set, get) => ({
  badges: [],
  totalPoints: 0,
  currentStreak: 0,
  longestStreak: 0,
  level: 1,
  isLoading: false,
  error: null,

  unlockBadge: (badgeId) => {
    const { badges } = get();
    const updatedBadges = badges.map(badge =>
      badge.id === badgeId
        ? { ...badge, isUnlocked: true }
        : badge
    );
    
    const unlockedBadge = updatedBadges.find(badge => badge.id === badgeId);
    if (unlockedBadge) {
      set({ 
        badges: updatedBadges,
        totalPoints: get().totalPoints + unlockedBadge.points
      });
    }
  },

  updateBadgeProgress: (badgeId, progress) => {
    const { badges } = get();
    const updatedBadges = badges.map(badge =>
      badge.id === badgeId
        ? { ...badge, progress: Math.min(progress, badge.maxProgress) }
        : badge
    );
    set({ badges: updatedBadges });
  },

  addPoints: (points) => {
    const { totalPoints } = get();
    set({ totalPoints: totalPoints + points });
  },

  updateStreak: (increment) => {
    const { currentStreak, longestStreak } = get();
    const newStreak = increment ? currentStreak + 1 : 0;
    const newLongestStreak = Math.max(longestStreak, newStreak);
    
    set({
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
    });
  },

  resetStreak: () => {
    set({ currentStreak: 0 });
  },

  setBadges: (badges) => set({ badges }),
  setTotalPoints: (points) => set({ totalPoints: points }),
  setCurrentStreak: (streak) => set({ currentStreak: streak }),
  setLongestStreak: (streak) => set({ longestStreak: streak }),
  setLevel: (level) => set({ level }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));