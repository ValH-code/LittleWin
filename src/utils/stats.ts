import { Habit, Statistics } from '../types';

export const dateUtils = {
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  },

  isToday(dateString: string): boolean {
    const today = new Date();
    return dateString === this.formatDate(today);
  },

  isYesterday(dateString: string): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateString === this.formatDate(yesterday);
  },

  getWeekStart(date: Date = new Date()): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  },

  getWeekEnd(date: Date = new Date()): Date {
    const weekStart = this.getWeekStart(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  },

  getDaysInWeek(startDate: Date): string[] {
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(this.formatDate(day));
    }
    return days;
  },

  getDayName(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  },

  getMonthName(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { month: 'long' });
  },
};

export const statsUtils = {
  calculateStreak(completions: { date: string; completed: boolean }[]): number {
    const sortedCompletions = completions
      .filter(c => c.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sortedCompletions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    
    for (const completion of sortedCompletions) {
      const completionDate = new Date(completion.date);
      const diffDays = Math.floor((currentDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate = completionDate;
      } else if (diffDays === streak + 1 && streak === 0) {
        // Allow for yesterday if today is not completed yet
        streak++;
        currentDate = completionDate;
      } else {
        break;
      }
    }

    return streak;
  },

  calculateCompletionRate(habit: Habit): number {
    // Gérer le cas où createdAt peut être une chaîne ou un objet Date
    const createdDate = typeof habit.createdAt === 'string' 
      ? new Date(habit.createdAt)
      : habit.createdAt;
    
    const totalDays = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const completedDays = habit.completions.filter(c => c.completed).length;
    return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  },

  calculateOverallStats(habits: Habit[]): Statistics {
    const totalHabits = habits.length;
    const totalCompletions = habits.reduce((sum, habit) => 
      sum + habit.completions.filter(c => c.completed).length, 0
    );

    const streaks = habits.map(habit => this.calculateStreak(habit.completions));
    const currentStreak = Math.max(...streaks, 0);
    const longestStreak = currentStreak; // For now, same as current

    const completionRates = habits.map(habit => this.calculateCompletionRate(habit));
    const completionRate = completionRates.length > 0 
      ? Math.round(completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length)
      : 0;

    // Calculate weekly average (last 7 days)
    const lastWeek = dateUtils.getDaysInWeek(dateUtils.getWeekStart());
    const weeklyCompletions = habits.reduce((sum, habit) => {
      const weekCompletions = habit.completions.filter(c => 
        c.completed && lastWeek.includes(c.date)
      ).length;
      return sum + weekCompletions;
    }, 0);
    const weeklyAverage = Math.round((weeklyCompletions / 7) * 100) / 100;

    return {
      totalHabits,
      totalCompletions,
      currentStreak,
      longestStreak,
      completionRate,
      weeklyAverage,
    };
  },

  calculatePoints(completions: number, streak: number): number {
    const basePoints = completions * 10;
    const streakBonus = streak * 5;
    return basePoints + streakBonus;
  },

  shouldUnlockBadge(habits: Habit[], badgeType: string, value: number): boolean {
    switch (badgeType) {
      case 'streak':
        const maxStreak = Math.max(...habits.map(h => this.calculateStreak(h.completions)), 0);
        return maxStreak >= value;
      case 'total_completions':
        const total = habits.reduce((sum, h) => sum + h.completions.filter(c => c.completed).length, 0);
        return total >= value;
      case 'habits_created':
        return habits.length >= value;
      default:
        return false;
    }
  },

  calculateStats(habits: Habit[]): Statistics {
    return this.calculateOverallStats(habits);
  },
};
