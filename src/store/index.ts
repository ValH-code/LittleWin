import { configureStore } from '@reduxjs/toolkit';
import habitsReducer from './habitsSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['habits/addHabit', 'habits/updateHabit', 'habits/addCompletion'],
        ignoredPaths: ['habits.habits.createdAt', 'habits.habits.completions.timestamp'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
