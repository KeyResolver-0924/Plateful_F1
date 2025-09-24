import { create } from 'zustand';

export interface NutritionReport {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
}

export interface ReportingState {
  reports: NutritionReport[];
  selectedDateRange: { start: string; end: string };
  isLoading: boolean;
  error: string | null;
}

export interface ReportingActions {
  setReports: (reports: NutritionReport[]) => void;
  addReport: (report: NutritionReport) => void;
  setDateRange: (start: string, end: string) => void;
  getReportsByDateRange: (start: string, end: string) => NutritionReport[];
  calculateAverageNutrition: (start: string, end: string) => NutritionReport;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type ReportingStore = ReportingState & ReportingActions;

export const useReportingStore = create<ReportingStore>((set, get) => ({
  reports: [],
  selectedDateRange: { start: '', end: '' },
  isLoading: false,
  error: null,

  setReports: (reports) => set({ reports }),
  
  addReport: (report) => set((state) => ({ 
    reports: [...state.reports, report] 
  })),
  
  setDateRange: (start, end) => set({ 
    selectedDateRange: { start, end } 
  }),
  
  getReportsByDateRange: (start, end) => {
    const { reports } = get();
    return reports.filter(report => 
      report.date >= start && report.date <= end
    );
  },
  
  calculateAverageNutrition: (start, end) => {
    const reports = get().getReportsByDateRange(start, end);
    if (reports.length === 0) {
      return {
        date: start,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        vitamins: {},
        minerals: {},
      };
    }
    
    const totals = reports.reduce((acc, report) => ({
      calories: acc.calories + report.calories,
      protein: acc.protein + report.protein,
      carbs: acc.carbs + report.carbs,
      fat: acc.fat + report.fat,
      fiber: acc.fiber + report.fiber,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    
    return {
      date: start,
      calories: totals.calories / reports.length,
      protein: totals.protein / reports.length,
      carbs: totals.carbs / reports.length,
      fat: totals.fat / reports.length,
      fiber: totals.fiber / reports.length,
      vitamins: {},
      minerals: {},
    };
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
})); 