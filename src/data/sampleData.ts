import { Habit } from '../types';

export const sampleHabits: Habit[] = [
  {
    id: 'habit-1',
    title: 'Boire 8 verres d\'eau',
    icon: 'water',
    frequency: 'daily',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours plus tôt
    completions: [
      {
        id: 'completion-1-1',
        habitId: 'habit-1',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: true,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'completion-1-2',
        habitId: 'habit-1',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: true,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    color: '#007AFF',
  },
  {
    id: 'habit-2',
    title: 'Faire de l\'exercice',
    icon: 'fitness',
    frequency: 'daily',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 jours plus tôt
    completions: [
      {
        id: 'completion-2-1',
        habitId: 'habit-2',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: true,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    color: '#34C759',
  },
  {
    id: 'habit-3',
    title: 'Méditer',
    icon: 'leaf',
    frequency: 'daily',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 jours plus tôt
    completions: [],
    color: '#5856D6',
  },
];

export const initializeSampleData = async () => {
  try {
    const { storageService } = await import('../utils/storage');
    
    // Vérifier s'il y a déjà des données
    const existingHabits = await storageService.loadHabits();
    
    if (existingHabits.length === 0) {
      await storageService.saveHabits(sampleHabits);
      console.log('Données d\'exemple initialisées');
      return sampleHabits;
    }
    
    return existingHabits;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des données:', error);
    return [];
  }
};
