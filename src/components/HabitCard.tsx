import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../types';
import { ProgressBar } from './ProgressBar';
import { lightTheme } from '../theme';
import { statsUtils, dateUtils } from '../utils/stats';

interface HabitCardProps {
  habit: Habit;
  onPress: () => void;
  onComplete: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onPress,
  onComplete,
}) => {
  const today = dateUtils.formatDate(new Date());
  const isCompletedToday = habit.completions.some(
    c => c.date === today && c.completed
  );
  
  const streak = statsUtils.calculateStreak(habit.completions);
  const completionRate = statsUtils.calculateCompletionRate(habit);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={habit.icon as keyof typeof Ionicons.glyphMap}
              size={24}
              color={habit.color}
            />
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{habit.title}</Text>
            <Text style={styles.frequency}>
              {habit.frequency === 'daily' ? 'Quotidien' : 'Hebdomadaire'}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.checkButton,
              isCompletedToday && styles.completedButton,
            ]}
            onPress={onComplete}
          >
            <Ionicons
              name={isCompletedToday ? 'checkmark' : 'ellipse-outline'}
              size={20}
              color={isCompletedToday ? lightTheme.colors.background : lightTheme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <ProgressBar
            progress={completionRate}
            color={habit.color}
            height={6}
          />
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Série</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{completionRate}%</Text>
            <Text style={styles.statLabel}>Taux</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {habit.completions.filter(c => c.completed).length}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: lightTheme.colors.card,
    borderRadius: lightTheme.borderRadius.lg,
    marginHorizontal: lightTheme.spacing.md,
    marginVertical: lightTheme.spacing.sm,
    ...lightTheme.shadows.sm,
  },
  content: {
    padding: lightTheme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: lightTheme.borderRadius.md,
    backgroundColor: lightTheme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: lightTheme.spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: lightTheme.fontSize.md,
    fontWeight: lightTheme.fontWeight.semibold,
    color: lightTheme.colors.text,
    marginBottom: 2,
  },
  frequency: {
    fontSize: lightTheme.fontSize.sm,
    color: lightTheme.colors.textSecondary,
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.surface,
  },
  completedButton: {
    backgroundColor: lightTheme.colors.success,
  },
  progressContainer: {
    marginBottom: lightTheme.spacing.md,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: lightTheme.fontSize.md,
    fontWeight: lightTheme.fontWeight.semibold,
    color: lightTheme.colors.text,
  },
  statLabel: {
    fontSize: lightTheme.fontSize.xs,
    color: lightTheme.colors.textSecondary,
    marginTop: 2,
  },
});
