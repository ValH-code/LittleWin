import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../hooks/redux';
import { lightTheme } from '../theme';
import { statsUtils } from '../utils/stats';

export const ProfileScreen: React.FC = () => {
  const { user } = useAppSelector(state => state.user);
  const { habits } = useAppSelector(state => state.habits);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Utilisateur non trouvé</Text>
      </View>
    );
  }

  const stats = statsUtils.calculateOverallStats(habits);
  const currentLevelProgress = ((user.totalPoints % 100) / 100) * 100;

  const badges = [
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
  ];

  const renderStatCard = (title: string, value: string | number, icon: keyof typeof Ionicons.glyphMap) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color={lightTheme.colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const renderBadge = (badge: any) => {
    const isUnlocked = statsUtils.shouldUnlockBadge(habits, badge.criteria.type, badge.criteria.value);
    
    return (
      <View key={badge.id} style={[styles.badge, !isUnlocked && styles.lockedBadge]}>
        <Ionicons
          name={badge.icon as keyof typeof Ionicons.glyphMap}
          size={24}
          color={isUnlocked ? lightTheme.colors.warning : lightTheme.colors.textSecondary}
        />
        <Text style={[styles.badgeName, !isUnlocked && styles.lockedText]}>
          {badge.name}
        </Text>
        <Text style={[styles.badgeDescription, !isUnlocked && styles.lockedText]}>
          {badge.description}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color={lightTheme.colors.background} />
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userLevel}>Niveau {user.level}</Text>
      </View>

      <View style={styles.levelContainer}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelTitle}>Progression vers le niveau {user.level + 1}</Text>
          <Text style={styles.levelPoints}>
            {user.totalPoints % 100} / 100 points
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${currentLevelProgress}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Statistiques</Text>
        <View style={styles.statsGrid}>
          {renderStatCard('Habitudes', stats.totalHabits, 'list')}
          {renderStatCard('Série actuelle', stats.currentStreak, 'flame')}
          {renderStatCard('Taux de réussite', `${stats.completionRate}%`, 'trending-up')}
          {renderStatCard('Total terminé', stats.totalCompletions, 'checkmark-circle')}
        </View>
      </View>

      <View style={styles.badgesContainer}>
        <Text style={styles.sectionTitle}>Badges</Text>
        <View style={styles.badgesGrid}>
          {badges.map(renderBadge)}
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings" size={20} color={lightTheme.colors.text} />
          <Text style={styles.actionButtonText}>Paramètres</Text>
          <Ionicons name="chevron-forward" size={16} color={lightTheme.colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="help-circle" size={20} color={lightTheme.colors.text} />
          <Text style={styles.actionButtonText}>Aide</Text>
          <Ionicons name="chevron-forward" size={16} color={lightTheme.colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="star" size={20} color={lightTheme.colors.text} />
          <Text style={styles.actionButtonText}>Noter l&apos;application</Text>
          <Ionicons name="chevron-forward" size={16} color={lightTheme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  errorText: {
    fontSize: lightTheme.fontSize.lg,
    color: lightTheme.colors.text,
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    alignItems: 'center',
    padding: lightTheme.spacing.xl,
    backgroundColor: lightTheme.colors.primary,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: lightTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.md,
  },
  userName: {
    fontSize: lightTheme.fontSize.xl,
    fontWeight: lightTheme.fontWeight.bold,
    color: lightTheme.colors.background,
    marginBottom: lightTheme.spacing.xs,
  },
  userLevel: {
    fontSize: lightTheme.fontSize.md,
    color: lightTheme.colors.background,
    opacity: 0.9,
  },
  levelContainer: {
    margin: lightTheme.spacing.lg,
    padding: lightTheme.spacing.lg,
    backgroundColor: lightTheme.colors.card,
    borderRadius: lightTheme.borderRadius.lg,
    ...lightTheme.shadows.sm,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.md,
  },
  levelTitle: {
    fontSize: lightTheme.fontSize.md,
    fontWeight: lightTheme.fontWeight.medium,
    color: lightTheme.colors.text,
  },
  levelPoints: {
    fontSize: lightTheme.fontSize.sm,
    color: lightTheme.colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: lightTheme.colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: lightTheme.colors.primary,
  },
  statsContainer: {
    margin: lightTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: lightTheme.fontSize.lg,
    fontWeight: lightTheme.fontWeight.semibold,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: lightTheme.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: lightTheme.colors.card,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.lg,
    alignItems: 'center',
    ...lightTheme.shadows.sm,
  },
  statValue: {
    fontSize: lightTheme.fontSize.xl,
    fontWeight: lightTheme.fontWeight.bold,
    color: lightTheme.colors.text,
    marginVertical: lightTheme.spacing.sm,
  },
  statTitle: {
    fontSize: lightTheme.fontSize.sm,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
  },
  badgesContainer: {
    margin: lightTheme.spacing.lg,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: lightTheme.spacing.md,
  },
  badge: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: lightTheme.colors.card,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.lg,
    alignItems: 'center',
    ...lightTheme.shadows.sm,
  },
  lockedBadge: {
    opacity: 0.6,
  },
  badgeName: {
    fontSize: lightTheme.fontSize.md,
    fontWeight: lightTheme.fontWeight.semibold,
    color: lightTheme.colors.text,
    marginTop: lightTheme.spacing.sm,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: lightTheme.fontSize.xs,
    color: lightTheme.colors.textSecondary,
    marginTop: lightTheme.spacing.xs,
    textAlign: 'center',
  },
  lockedText: {
    color: lightTheme.colors.textSecondary,
  },
  actionsContainer: {
    margin: lightTheme.spacing.lg,
    backgroundColor: lightTheme.colors.card,
    borderRadius: lightTheme.borderRadius.lg,
    overflow: 'hidden',
    ...lightTheme.shadows.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: lightTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
  },
  actionButtonText: {
    flex: 1,
    marginLeft: lightTheme.spacing.md,
    fontSize: lightTheme.fontSize.md,
    color: lightTheme.colors.text,
  },
});
