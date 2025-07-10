import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, User } from '../types';

const STORAGE_KEYS = {
  HABITS: '@littlewin_habits',
  USER: '@littlewin_user',
  THEME: '@littlewin_theme',
};

export const storageService = {
  // Habits
  async saveHabits(habits: Habit[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(habits);
      await AsyncStorage.setItem(STORAGE_KEYS.HABITS, jsonValue);
    } catch (error) {
      console.error('Error saving habits:', error);
      throw error;
    }
  },

  async loadHabits(): Promise<Habit[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading habits:', error);
      return [];
    }
  },

  // User
  async saveUser(user: User): Promise<void> {
    try {
      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, jsonValue);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  async loadUser(): Promise<User | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading user:', error);
      return null;
    }
  },

  // Theme
  async saveTheme(theme: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
      throw error;
    }
  },

  async loadTheme(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    } catch (error) {
      console.error('Error loading theme:', error);
      return null;
    }
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.HABITS,
        STORAGE_KEYS.USER,
        STORAGE_KEYS.THEME,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};
