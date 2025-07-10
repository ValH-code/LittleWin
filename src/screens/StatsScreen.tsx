import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../hooks/redux';
import { lightTheme } from '../theme';
import { statsUtils } from '../utils/stats';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={styles.statHeader}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.statTitle}>{title}</Text>
    </View>
    <Text style={styles.statValue}>{value}</Text>
    {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
  </View>
);

interface ProgressRingProps {
  progress: number;
  size: number;
  color: string;
  children?: React.ReactNode;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ progress, color, children }) => {
  return (
    <View style={styles.progressRing}>
      <View style={[styles.progressCircle, { borderColor: color, borderWidth: progress > 0 ? 8 : 2 }]}>
        <View style={styles.progressContent}>
          {children}
        </View>
      </View>
    </View>
  );
};

export const StatsScreen: React.FC = () => {
  const { habits } = useAppSelector(state => state.habits);
  const { user } = useAppSelector(state => state.user);

  const stats = statsUtils.calculateStats(habits);
  
  const level = user?.level || 1;
  const totalPoints = user?.totalPoints || 0;
  
  const todayCompletions = habits.reduce((count, habit) => {
    const today = new Date().toISOString().split('T')[0];
    const completion = habit.completions.find(c => c.date === today);
    return count + (completion?.completed ? 1 : 0);
  }, 0);

  const todayProgress = habits.length > 0 ? (todayCompletions / habits.length) * 100 : 0;
  const pointsToNextLevel = (level + 1) * 100 - totalPoints;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistiques</Text>
        <Text style={styles.subtitle}>Votre progression en un coup d&apos;œil</Text>
      </View>

      {/* Progression du jour */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aujourd&apos;hui</Text>
        <View style={styles.progressSection}>
          <ProgressRing 
            progress={todayProgress} 
            size={120} 
            color={lightTheme.colors.primary}
          >
            <Text style={styles.progressValue}>{Math.round(todayProgress)}%</Text>
            <Text style={styles.progressLabel}>Terminé</Text>
          </ProgressRing>
          <View style={styles.todayStats}>
            <Text style={styles.todayTitle}>{todayCompletions}/{habits.length}</Text>
            <Text style={styles.todaySubtitle}>Habitudes terminées</Text>
          </View>
        </View>
      </View>

      {/* Niveau et points */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Niveau et récompenses</Text>
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Ionicons name="trophy" size={32} color={lightTheme.colors.warning} />
            <View style={styles.levelInfo}>
              <Text style={styles.levelTitle}>Niveau {level}</Text>
              <Text style={styles.levelSubtitle}>{totalPoints} points au total</Text>
            </View>
          </View>
          <View style={styles.levelProgress}>
            <Text style={styles.levelProgressText}>
              {pointsToNextLevel} points pour le niveau {level + 1}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(totalPoints % 100)}%` }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>

      {/* Statistiques générales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistiques générales</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="flame"
            title="Série actuelle"
            value={stats.currentStreak}
            subtitle="jours consécutifs"
            color={lightTheme.colors.error}
          />
          <StatCard
            icon="trending-up"
            title="Meilleure série"
            value={stats.longestStreak}
            subtitle="jours au maximum"
            color={lightTheme.colors.success}
          />
          <StatCard
            icon="checkmark-circle"
            title="Taux de réussite"
            value={`${Math.round(stats.completionRate)}%`}
            subtitle="de vos objectifs"
            color={lightTheme.colors.primary}
          />
          <StatCard
            icon="calendar"
            title="Total terminé"
            value={stats.totalCompletions}
            subtitle="habitudes réalisées"
            color={lightTheme.colors.secondary}
          />
        </View>
      </View>

      {/* Moyenne hebdomadaire */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance hebdomadaire</Text>
        <StatCard
          icon="bar-chart"
          title="Moyenne cette semaine"
          value={`${stats.weeklyAverage.toFixed(1)}/7`}
          subtitle="habitudes par jour"
          color={lightTheme.colors.info}
        />
      </View>
    </ScrollView>
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
  },
  section: {
    paddingHorizontal: lightTheme.spacing.lg,
    marginBottom: lightTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: lightTheme.fontSize.lg,
    fontWeight: lightTheme.fontWeight.semibold,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.md,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.lg,
  },
  progressRing: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: lightTheme.colors.border,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  svg: {
    position: 'absolute',
  },
  progressContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressValue: {
    fontSize: lightTheme.fontSize.xl,
    fontWeight: lightTheme.fontWeight.bold,
    color: lightTheme.colors.text,
  },
  progressLabel: {
    fontSize: lightTheme.fontSize.sm,
    color: lightTheme.colors.textSecondary,
  },
  todayStats: {
    flex: 1,
    marginLeft: lightTheme.spacing.xl,
  },
  todayTitle: {
    fontSize: lightTheme.fontSize.xxl,
    fontWeight: lightTheme.fontWeight.bold,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.xs,
  },
  todaySubtitle: {
    fontSize: lightTheme.fontSize.md,
    color: lightTheme.colors.textSecondary,
  },
  levelCard: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.lg,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.md,
  },
  levelInfo: {
    marginLeft: lightTheme.spacing.md,
  },
  levelTitle: {
    fontSize: lightTheme.fontSize.lg,
    fontWeight: lightTheme.fontWeight.semibold,
    color: lightTheme.colors.text,
  },
  levelSubtitle: {
    fontSize: lightTheme.fontSize.sm,
    color: lightTheme.colors.textSecondary,
  },
  levelProgress: {
    marginTop: lightTheme.spacing.sm,
  },
  levelProgressText: {
    fontSize: lightTheme.fontSize.sm,
    color: lightTheme.colors.textSecondary,
    marginBottom: lightTheme.spacing.xs,
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
  statsGrid: {
    gap: lightTheme.spacing.md,
  },
  statCard: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.lg,
    borderLeftWidth: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.sm,
  },
  statTitle: {
    fontSize: lightTheme.fontSize.md,
    fontWeight: lightTheme.fontWeight.medium,
    color: lightTheme.colors.text,
    marginLeft: lightTheme.spacing.sm,
  },
  statValue: {
    fontSize: lightTheme.fontSize.xxl,
    fontWeight: lightTheme.fontWeight.bold,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.xs,
  },
  statSubtitle: {
    fontSize: lightTheme.fontSize.sm,
    color: lightTheme.colors.textSecondary,
  },
});
