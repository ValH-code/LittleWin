import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { CalendarHistory } from '../components/CalendarHistory';
import { ProgressBar } from '../components/ProgressBar';
import { RootStackParamList } from '../types';
import { lightTheme } from '../theme';
import { addCompletion, deleteHabit } from '../store/habitsSlice';
import { updateUserPoints } from '../store/userSlice';
import { storageService } from '../utils/storage';
import { statsUtils, dateUtils } from '../utils/stats';

type HabitDetailScreenRouteProp = RouteProp<RootStackParamList, 'HabitDetail'>;

export const HabitDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<HabitDetailScreenRouteProp>();
  const dispatch = useAppDispatch();
  const { habits } = useAppSelector(state => state.habits);
  
  const [showReward, setShowReward] = useState(false);
  const rewardScale = useSharedValue(0);
  const rewardOpacity = useSharedValue(0);

  const rewardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: rewardScale.value }],
      opacity: rewardOpacity.value,
    };
  });
  
  const { habitId } = route.params;
  const habit = habits.find(h => h.id === habitId);

  if (!habit) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Habitude non trouvée</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const today = dateUtils.formatDate(new Date());
  const isCompletedToday = habit.completions.some(
    c => c.date === today && c.completed
  );
  
  const streak = statsUtils.calculateStreak(habit.completions);
  const completionRate = statsUtils.calculateCompletionRate(habit);
  const totalCompletions = habit.completions.filter(c => c.completed).length;

  const showRewardAnimation = () => {
    setShowReward(true);
    rewardScale.value = withSequence(
      withSpring(1.2),
      withSpring(1),
      withTiming(0, { duration: 500 })
    );
    rewardOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(1, { duration: 1000 }),
      withTiming(0, { duration: 300 })
    );

    setTimeout(() => {
      setShowReward(false);
    }, 1700);
  };

  const handleComplete = async () => {
    if (isCompletedToday) {
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
      timestamp: new Date(),
    };

    dispatch(addCompletion({ habitId, completion }));
    dispatch(updateUserPoints(10));

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
      showRewardAnimation();
    } catch (error) {
      console.error('Error saving habit completion:', error);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditHabit', { habitId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer l&apos;habitude',
      'Êtes-vous sûr de vouloir supprimer cette habitude ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            dispatch(deleteHabit(habitId));
            try {
              const updatedHabits = habits.filter(h => h.id !== habitId);
              await storageService.saveHabits(updatedHabits);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting habit:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={habit.icon as keyof typeof Ionicons.glyphMap}
                size={32}
                color={habit.color}
              />
            </View>
            <View style={styles.titleTextContainer}>
              <Text style={styles.title}>{habit.title}</Text>
              <Text style={styles.frequency}>
                {habit.frequency === 'daily' ? 'Quotidien' : 'Hebdomadaire'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="pencil" size={20} color={lightTheme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Série actuelle</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalCompletions}</Text>
              <Text style={styles.statLabel}>Total terminé</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{completionRate}%</Text>
              <Text style={styles.statLabel}>Taux de réussite</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progression</Text>
          <ProgressBar
            progress={completionRate}
            color={habit.color}
            height={12}
          />
        </View>

        <CalendarHistory habit={habit} />

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash" size={20} color={lightTheme.colors.error} />
          <Text style={styles.deleteButtonText}>Supprimer l&apos;habitude</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            {
              backgroundColor: isCompletedToday ? lightTheme.colors.success : habit.color,
            },
          ]}
          onPress={handleComplete}
          disabled={isCompletedToday}
        >
          <Ionicons
            name={isCompletedToday ? 'checkmark' : 'add'}
            size={24}
            color={lightTheme.colors.background}
          />
          <Text style={styles.completeButtonText}>
            {isCompletedToday ? 'Terminé aujourd&apos;hui !' : 'Marquer comme fait'}
          </Text>
        </TouchableOpacity>
      </View>

      {showReward && (
        <Animated.View style={[styles.rewardContainer, rewardAnimatedStyle]}>
          <View style={styles.rewardContent}>
            <Text style={styles.rewardText}>🎉</Text>
            <Text style={styles.rewardTitle}>Bravo !</Text>
            <Text style={styles.rewardSubtitle}>+10 points</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.background,
  },
  errorText: {
    fontSize: lightTheme.fontSize.lg,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.md,
  },
  backText: {
    fontSize: lightTheme.fontSize.md,
    color: lightTheme.colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: lightTheme.spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: lightTheme.borderRadius.lg,
    backgroundColor: lightTheme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: lightTheme.spacing.md,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: lightTheme.fontSize.xl,
    fontWeight: lightTheme.fontWeight.bold,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.xs,
  },
  frequency: {
    fontSize: lightTheme.fontSize.md,
    color: lightTheme.colors.textSecondary,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: lightTheme.borderRadius.md,
    backgroundColor: lightTheme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    marginHorizontal: lightTheme.spacing.lg,
    marginBottom: lightTheme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: lightTheme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: lightTheme.colors.card,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.md,
    alignItems: 'center',
    ...lightTheme.shadows.sm,
  },
  statValue: {
    fontSize: lightTheme.fontSize.xl,
    fontWeight: lightTheme.fontWeight.bold,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.xs,
  },
  statLabel: {
    fontSize: lightTheme.fontSize.sm,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
  },
  progressSection: {
    marginHorizontal: lightTheme.spacing.lg,
    marginBottom: lightTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: lightTheme.fontSize.lg,
    fontWeight: lightTheme.fontWeight.semibold,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.md,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: lightTheme.spacing.lg,
    marginVertical: lightTheme.spacing.xl,
    padding: lightTheme.spacing.md,
    borderRadius: lightTheme.borderRadius.md,
    backgroundColor: lightTheme.colors.surface,
  },
  deleteButtonText: {
    marginLeft: lightTheme.spacing.sm,
    fontSize: lightTheme.fontSize.md,
    color: lightTheme.colors.error,
  },
  bottomAction: {
    padding: lightTheme.spacing.lg,
    paddingBottom: lightTheme.spacing.xl,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.md,
    ...lightTheme.shadows.md,
  },
  completeButtonText: {
    marginLeft: lightTheme.spacing.sm,
    fontSize: lightTheme.fontSize.md,
    fontWeight: lightTheme.fontWeight.semibold,
    color: lightTheme.colors.background,
  },
  rewardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  rewardContent: {
    backgroundColor: lightTheme.colors.background,
    borderRadius: lightTheme.borderRadius.xl,
    padding: lightTheme.spacing.xl,
    alignItems: 'center',
    ...lightTheme.shadows.lg,
  },
  rewardText: {
    fontSize: 48,
    marginBottom: lightTheme.spacing.md,
  },
  rewardTitle: {
    fontSize: lightTheme.fontSize.xl,
    fontWeight: lightTheme.fontWeight.bold,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.sm,
  },
  rewardSubtitle: {
    fontSize: lightTheme.fontSize.md,
    color: lightTheme.colors.primary,
    fontWeight: lightTheme.fontWeight.medium,
  },
});
