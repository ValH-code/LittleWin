import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../hooks/redux';
import { lightTheme } from '../theme';
import { Badge } from '../types';

interface BadgeCardProps {
  badge: Badge;
  unlocked: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, unlocked }) => (
  <TouchableOpacity 
    style={[styles.badgeCard, !unlocked && styles.lockedBadge]}
    disabled={!unlocked}
  >
    <View style={[styles.badgeIcon, !unlocked && styles.lockedIcon]}>
      <Ionicons 
        name={badge.icon as keyof typeof Ionicons.glyphMap} 
        size={32} 
        color={unlocked ? lightTheme.colors.warning : lightTheme.colors.textSecondary} 
      />
    </View>
    <Text style={[styles.badgeName, !unlocked && styles.lockedText]}>
      {badge.name}
    </Text>
    <Text style={[styles.badgeDescription, !unlocked && styles.lockedText]}>
      {badge.description}
    </Text>
    {unlocked && badge.unlockedAt && (
      <Text style={styles.unlockedDate}>
        Débloqué le {new Date(badge.unlockedAt).toLocaleDateString('fr-FR')}
      </Text>
    )}
    {!unlocked && (
      <Text style={styles.criteria}>
        {badge.criteria.type === 'streak' && `${badge.criteria.value} jours consécutifs`}
        {badge.criteria.type === 'total_completions' && `${badge.criteria.value} habitudes terminées`}
        {badge.criteria.type === 'habits_created' && `${badge.criteria.value} habitudes créées`}
      </Text>
    )}
  </TouchableOpacity>
);

export const BadgesScreen: React.FC = () => {
  const { habits } = useAppSelector(state => state.habits);
  const { user } = useAppSelector(state => state.user);

  // Badges prédéfinis
  const allBadges: Badge[] = [
    {
      id: 'first-habit',
      name: 'Premier pas',
      description: 'Créez votre première habitude',
      icon: 'flag',
      criteria: { type: 'habits_created', value: 1 },
    },
    {
      id: 'habit-master',
      name: 'Maître des habitudes',
      description: 'Créez 5 habitudes',
      icon: 'star',
      criteria: { type: 'habits_created', value: 5 },
    },
    {
      id: 'week-streak',
      name: 'Une semaine forte',
      description: 'Maintenez une série de 7 jours',
      icon: 'flame',
      criteria: { type: 'streak', value: 7 },
    },
    {
      id: 'month-streak',
      name: 'Persévérance',
      description: 'Maintenez une série de 30 jours',
      icon: 'trophy',
      criteria: { type: 'streak', value: 30 },
    },
    {
      id: 'century',
      name: 'Centurion',
      description: 'Terminez 100 habitudes',
      icon: 'medal',
      criteria: { type: 'total_completions', value: 100 },
    },
    {
      id: 'dedicated',
      name: 'Dévoué',
      description: 'Terminez 500 habitudes',
      icon: 'diamond',
      criteria: { type: 'total_completions', value: 500 },
    },
  ];

  const getUserBadges = () => {
    const userBadges = user?.badges || [];
    const totalCompletions = habits.reduce(
      (sum, habit) => sum + habit.completions.filter(c => c.completed).length, 
      0
    );
    
    return allBadges.map(badge => {
      const unlocked = userBadges.some(ub => ub.id === badge.id) || 
        checkBadgeCriteria(badge, habits.length, totalCompletions);
      
      return {
        ...badge,
        unlocked,
        unlockedAt: userBadges.find(ub => ub.id === badge.id)?.unlockedAt,
      };
    });
  };

  const checkBadgeCriteria = (badge: Badge, habitCount: number, totalCompletions: number): boolean => {
    switch (badge.criteria.type) {
      case 'habits_created':
        return habitCount >= badge.criteria.value;
      case 'total_completions':
        return totalCompletions >= badge.criteria.value;
      case 'streak':
        // Pour simplifier, on considère qu'une série de 7+ jours est atteinte si on a assez de completions
        return totalCompletions >= badge.criteria.value;
      default:
        return false;
    }
  };

  const badgesWithStatus = getUserBadges();
  const unlockedCount = badgesWithStatus.filter(b => b.unlocked).length;

  const renderBadge = ({ item }: { item: typeof badgesWithStatus[0] }) => (
    <BadgeCard badge={item} unlocked={item.unlocked} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Badges</Text>
        <Text style={styles.subtitle}>
          {unlockedCount}/{badgesWithStatus.length} badges débloqués
        </Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(unlockedCount / badgesWithStatus.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      <FlatList
        data={badgesWithStatus}
        renderItem={renderBadge}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  progressContainer: {
    marginTop: lightTheme.spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: lightTheme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: lightTheme.colors.warning,
    borderRadius: 4,
  },
  listContainer: {
    paddingHorizontal: lightTheme.spacing.lg,
    paddingBottom: lightTheme.spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
  },
  badgeCard: {
    flex: 0.48,
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.lg,
    marginBottom: lightTheme.spacing.md,
    alignItems: 'center',
    minHeight: 180,
  },
  lockedBadge: {
    opacity: 0.6,
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: lightTheme.colors.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: lightTheme.spacing.md,
  },
  lockedIcon: {
    backgroundColor: lightTheme.colors.border,
  },
  badgeName: {
    fontSize: lightTheme.fontSize.md,
    fontWeight: lightTheme.fontWeight.semibold,
    color: lightTheme.colors.text,
    textAlign: 'center',
    marginBottom: lightTheme.spacing.xs,
  },
  badgeDescription: {
    fontSize: lightTheme.fontSize.sm,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: lightTheme.spacing.sm,
  },
  lockedText: {
    color: lightTheme.colors.textSecondary,
  },
  unlockedDate: {
    fontSize: lightTheme.fontSize.xs,
    color: lightTheme.colors.success,
    textAlign: 'center',
    fontWeight: lightTheme.fontWeight.medium,
  },
  criteria: {
    fontSize: lightTheme.fontSize.xs,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 'auto',
  },
});
