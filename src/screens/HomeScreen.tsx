import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { HabitCard } from '../components/HabitCard';
import { FloatingButton } from '../components/FloatingButton';
import { RootStackParamList } from '../types';
import { lightTheme } from '../theme';
import { storageService } from '../utils/storage';
import { setHabits, addCompletion } from '../store/habitsSlice';
import { updateUserPoints } from '../store/userSlice';
import { dateUtils } from '../utils/stats';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { habits } = useAppSelector(state => state.habits);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedHabits = await storageService.loadHabits();
        dispatch(setHabits(savedHabits));
      } catch (error) {
        console.error('Error loading habits:', error);
      }
    };
    
    loadData();
  }, [dispatch]);

  const handleAddHabit = () => {
    navigation.navigate('AddHabit');
  };

  const handleHabitPress = (habitId: string) => {
    navigation.navigate('HabitDetail', { habitId });
  };

  const handleCompleteHabit = async (habitId: string) => {
    const today = dateUtils.formatDate(new Date());
    const habit = habits.find(h => h.id === habitId);
    
    if (!habit) return;

    const existingCompletion = habit.completions.find(c => c.date === today);
    
    if (existingCompletion?.completed) {
      Alert.alert(
        'Déjà fait !',
        'Vous avez déjà marqué cette habitude comme terminée aujourd&apos;hui.',
        [{ text: 'OK' }]
      );
      return;
    }

    const completion = {
      id: `${habitId}-${today}`,
      habitId,
      date: today,
      completed: true,
      timestamp: new Date().toISOString(),
    };

    dispatch(addCompletion({ habitId, completion }));
    dispatch(updateUserPoints(10)); // 10 points per completion

    try {
      const updatedHabits = habits.map(h =>
        h.id === habitId
          ? {
              ...h,
              completions: [
                ...h.completions.filter(c => c.date !== today),
                completion,
              ],
            }
          : h
      );
      await storageService.saveHabits(updatedHabits);
    } catch (error) {
      console.error('Error saving habit completion:', error);
    }
  };

  const renderHabit = ({ item }: { item: typeof habits[0] }) => (
    <HabitCard
      habit={item}
      onPress={() => handleHabitPress(item.id)}
      onComplete={() => handleCompleteHabit(item.id)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>Aucune habitude</Text>
      <Text style={styles.emptySubtitle}>
        Commencez votre parcours en ajoutant votre première habitude !
      </Text>
    </View>
  );

  const todayCompletions = habits.reduce((count, habit) => {
    const today = new Date().toISOString().split('T')[0];
    const completion = habit.completions.find(c => c.date === today);
    return count + (completion?.completed ? 1 : 0);
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Habitudes</Text>
        <Text style={styles.subtitle}>
          {habits.length} habitude{habits.length > 1 ? 's' : ''} en cours
        </Text>
        {habits.length > 0 && (
          <View style={styles.dailyProgress}>
            <Text style={styles.progressText}>
              Aujourd&apos;hui: {todayCompletions}/{habits.length}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: habits.length > 0 ? `${(todayCompletions / habits.length) * 100}%` : '0%' }
                ]} 
              />
            </View>
          </View>
        )}
      </View>

      <FlatList
        data={habits}
        renderItem={renderHabit}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          habits.length === 0 && styles.emptyListContainer,
        ]}
        ListEmptyComponent={renderEmptyState}
      />

      <FloatingButton onPress={handleAddHabit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  header: {
    padding: lightTheme.spacing.lg,
    paddingBottom: lightTheme.spacing.md,
  },
  title: {
    fontSize: lightTheme.fontSize.xxxl,
    fontWeight: lightTheme.fontWeight.bold,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.xs,
  },
  subtitle: {
    fontSize: lightTheme.fontSize.md,
    color: lightTheme.colors.textSecondary,
    marginBottom: lightTheme.spacing.md,
  },
  dailyProgress: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.md,
    marginTop: lightTheme.spacing.sm,
  },
  progressText: {
    fontSize: lightTheme.fontSize.md,
    fontWeight: lightTheme.fontWeight.medium,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: lightTheme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: lightTheme.colors.primary,
    borderRadius: 4,
  },
  listContainer: {
    paddingBottom: 100, // Space for floating button
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: lightTheme.spacing.xl,
  },
  emptyTitle: {
    fontSize: lightTheme.fontSize.xl,
    fontWeight: lightTheme.fontWeight.semibold,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: lightTheme.fontSize.md,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
