import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Habit, HabitCompletion } from '../types';

interface HabitsState {
  habits: Habit[];
  loading: boolean;
  error: string | null;
}

const initialState: HabitsState = {
  habits: [],
  loading: false,
  error: null,
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setHabits: (state, action: PayloadAction<Habit[]>) => {
      state.habits = action.payload;
    },
    addHabit: (state, action: PayloadAction<Habit>) => {
      // Convertir les dates en chaînes pour éviter les problèmes de sérialisation
      const habitToAdd = {
        ...action.payload,
        createdAt: typeof action.payload.createdAt === 'string' 
          ? action.payload.createdAt 
          : action.payload.createdAt.toISOString(),
        completions: action.payload.completions.map(completion => ({
          ...completion,
          timestamp: typeof completion.timestamp === 'string'
            ? completion.timestamp
            : completion.timestamp.toISOString(),
        })),
      };
      state.habits.push(habitToAdd);
    },
    updateHabit: (state, action: PayloadAction<Habit>) => {
      const index = state.habits.findIndex(h => h.id === action.payload.id);
      if (index !== -1) {
        state.habits[index] = action.payload;
      }
    },
    deleteHabit: (state, action: PayloadAction<string>) => {
      state.habits = state.habits.filter(h => h.id !== action.payload);
    },
    addCompletion: (state, action: PayloadAction<{ habitId: string; completion: HabitCompletion }>) => {
      const habit = state.habits.find(h => h.id === action.payload.habitId);
      if (habit) {
        // Remove existing completion for the same date if any
        habit.completions = habit.completions.filter(
          c => c.date !== action.payload.completion.date
        );
        
        // Convertir timestamp en chaîne pour éviter les problèmes de sérialisation
        const completionToAdd = {
          ...action.payload.completion,
          timestamp: typeof action.payload.completion.timestamp === 'string'
            ? action.payload.completion.timestamp
            : action.payload.completion.timestamp.toISOString(),
        };
        
        habit.completions.push(completionToAdd);
      }
    },
    removeCompletion: (state, action: PayloadAction<{ habitId: string; date: string }>) => {
      const habit = state.habits.find(h => h.id === action.payload.habitId);
      if (habit) {
        habit.completions = habit.completions.filter(
          c => c.date !== action.payload.date
        );
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  addCompletion,
  removeCompletion,
} = habitsSlice.actions;

export default habitsSlice.reducer;
