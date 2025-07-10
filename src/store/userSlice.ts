import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Badge } from '../types';

interface UserState {
  user: User | null;
  theme: 'light' | 'dark' | 'auto';
}

const initialState: UserState = {
  user: {
    id: 'user-1',
    name: 'Utilisateur',
    level: 1,
    totalPoints: 0,
    badges: [],
  },
  theme: 'auto',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    updateUserPoints: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.totalPoints += action.payload;
        // Calculate level based on points (100 points per level)
        state.user.level = Math.floor(state.user.totalPoints / 100) + 1;
      }
    },
    addBadge: (state, action: PayloadAction<Badge>) => {
      if (state.user && !state.user.badges.find(b => b.id === action.payload.id)) {
        state.user.badges.push(action.payload);
      }
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.name = action.payload;
      }
    },
  },
});

export const {
  setUser,
  updateUserPoints,
  addBadge,
  setTheme,
  updateUserName,
} = userSlice.actions;

export default userSlice.reducer;
