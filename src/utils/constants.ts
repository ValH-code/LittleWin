// Placeholder for push notifications setup
// This would be implemented with expo-notifications or react-native-push-notification

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    // Request notification permissions
    // Implementation would depend on the platform
    console.log('Requesting notification permissions...');
    return true;
  },

  async scheduleNotification(
    title: string,
    body: string,
    trigger: { hour: number; minute: number }
  ): Promise<string> {
    // Schedule a daily notification
    console.log(`Scheduling notification: ${title} - ${body} at ${trigger.hour}:${trigger.minute}`);
    return 'notification-id';
  },

  async cancelNotification(notificationId: string): Promise<void> {
    // Cancel a scheduled notification
    console.log(`Canceling notification: ${notificationId}`);
  },

  async cancelAllNotifications(): Promise<void> {
    // Cancel all scheduled notifications
    console.log('Canceling all notifications');
  },
};

// Badge criteria for gamification
export const badges = [
  {
    id: 'first-habit',
    name: 'Premier pas',
    description: 'Créer votre première habitude',
    icon: 'star',
    criteria: { type: 'habits_created', value: 1 },
  },
  {
    id: 'week-streak',
    name: 'Une semaine',
    description: 'Maintenir une série de 7 jours',
    icon: 'calendar',
    criteria: { type: 'streak', value: 7 },
  },
  {
    id: 'month-streak',
    name: 'Un mois',
    description: 'Maintenir une série de 30 jours',
    icon: 'trophy',
    criteria: { type: 'streak', value: 30 },
  },
  {
    id: 'hundred-completions',
    name: 'Centenaire',
    description: 'Compléter 100 habitudes',
    icon: 'medal',
    criteria: { type: 'total_completions', value: 100 },
  },
  {
    id: 'five-habits',
    name: 'Organisé',
    description: 'Créer 5 habitudes',
    icon: 'list',
    criteria: { type: 'habits_created', value: 5 },
  },
  {
    id: 'perfect-week',
    name: 'Semaine parfaite',
    description: 'Compléter toutes vos habitudes pendant une semaine',
    icon: 'checkmark-circle',
    criteria: { type: 'perfect_week', value: 1 },
  },
] as const;

// Colors for habit customization
export const HABIT_COLORS = [
  '#007AFF', // Blue
  '#5856D6', // Purple
  '#34C759', // Green
  '#FF9500', // Orange
  '#FF3B30', // Red
  '#FF6B6B', // Light Red
  '#4ECDC4', // Teal
  '#45B7D1', // Light Blue
  '#96CEB4', // Light Green
  '#FFEAA7', // Light Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#FFB6C1', // Light Pink
  '#F0E68C', // Khaki
  '#20B2AA', // Light Sea Green
  '#87CEEB', // Sky Blue
] as const;
