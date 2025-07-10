export interface Habit {
  id: string;
  title: string;
  icon: string;
  frequency: 'daily' | 'weekly';
  reminderTime?: string;
  createdAt: Date | string;
  completions: HabitCompletion[];
  color: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string; // Format: YYYY-MM-DD
  completed: boolean;
  timestamp: Date | string;
}

export interface User {
  id: string;
  name: string;
  level: number;
  totalPoints: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  criteria: {
    type: 'streak' | 'total_completions' | 'habits_created';
    value: number;
  };
}

export interface Statistics {
  totalHabits: number;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  weeklyAverage: number;
}

export type RootStackParamList = {
  Main: undefined;
  AddHabit: undefined;
  HabitDetail: { habitId: string };
  EditHabit: { habitId: string };
};

export type TabParamList = {
  Home: undefined;
  Stats: undefined;
  Badges: undefined;
  Profile: undefined;
};
