import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Habit } from '../types';
import { lightTheme } from '../theme';
import { dateUtils } from '../utils/stats';

interface CalendarHistoryProps {
  habit: Habit;
  startDate?: Date;
  numWeeks?: number;
}

export const CalendarHistory: React.FC<CalendarHistoryProps> = ({
  habit,
  startDate = new Date(),
  numWeeks = 12,
}) => {
  const generateCalendarData = () => {
    const weeks = [];
    const today = new Date();
    
    for (let week = numWeeks - 1; week >= 0; week--) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() - (week * 7));
      const weekStartMonday = dateUtils.getWeekStart(weekStart);
      
      const days = dateUtils.getDaysInWeek(weekStartMonday).map(dateStr => {
        const completion = habit.completions.find(c => c.date === dateStr);
        const date = new Date(dateStr);
        const isToday = dateUtils.isToday(dateStr);
        const isFuture = date > today;
        
        return {
          date: dateStr,
          completed: completion?.completed || false,
          isToday,
          isFuture,
        };
      });
      
      weeks.push(days);
    }
    
    return weeks;
  };

  const weeks = generateCalendarData();
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const getSquareColor = (day: any) => {
    if (day.isFuture) return lightTheme.colors.surface;
    if (day.completed) return habit.color;
    if (day.isToday) return lightTheme.colors.primary;
    return lightTheme.colors.border;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des {numWeeks} dernières semaines</Text>
      
      <View style={styles.weekDaysHeader}>
        {weekDays.map((day, index) => (
          <Text key={index} style={styles.weekDayLabel}>
            {day}
          </Text>
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.calendarContainer}
      >
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.week}>
            {week.map((day, dayIndex) => (
              <View
                key={dayIndex}
                style={[
                  styles.daySquare,
                  {
                    backgroundColor: getSquareColor(day),
                  },
                  day.isToday && styles.todaySquare,
                ]}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSquare, { backgroundColor: lightTheme.colors.border }]} />
          <Text style={styles.legendText}>Non fait</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSquare, { backgroundColor: habit.color }]} />
          <Text style={styles.legendText}>Fait</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSquare, { backgroundColor: lightTheme.colors.primary }]} />
          <Text style={styles.legendText}>Aujourd&apos;hui</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: lightTheme.colors.card,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.md,
    margin: lightTheme.spacing.md,
  },
  title: {
    fontSize: lightTheme.fontSize.md,
    fontWeight: lightTheme.fontWeight.semibold,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.md,
    textAlign: 'center',
  },
  weekDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: lightTheme.spacing.sm,
  },
  weekDayLabel: {
    fontSize: lightTheme.fontSize.xs,
    color: lightTheme.colors.textSecondary,
    fontWeight: lightTheme.fontWeight.medium,
    width: 12,
    textAlign: 'center',
  },
  calendarContainer: {
    flexDirection: 'row',
    paddingHorizontal: lightTheme.spacing.sm,
  },
  week: {
    marginRight: lightTheme.spacing.xs,
  },
  daySquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginBottom: 2,
  },
  todaySquare: {
    borderWidth: 1,
    borderColor: lightTheme.colors.text,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: lightTheme.spacing.md,
    paddingTop: lightTheme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: lightTheme.colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSquare: {
    width: 8,
    height: 8,
    borderRadius: 1,
    marginRight: lightTheme.spacing.xs,
  },
  legendText: {
    fontSize: lightTheme.fontSize.xs,
    color: lightTheme.colors.textSecondary,
  },
});
