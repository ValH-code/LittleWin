import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { IconPicker } from '../components/IconPicker';
import { Habit } from '../types';
import { lightTheme } from '../theme';
import { addHabit } from '../store/habitsSlice';
import { storageService } from '../utils/storage';

const HABIT_COLORS = [
  '#007AFF',
  '#5856D6',
  '#34C759',
  '#FF9500',
  '#FF3B30',
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
];

export const AddHabitScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { habits } = useAppSelector(state => state.habits);

  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('fitness');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [reminderTime, setReminderTime] = useState('');
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre pour votre habitude.');
      return;
    }

    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      title: title.trim(),
      icon,
      frequency,
      reminderTime: reminderTime || undefined,
      createdAt: new Date().toISOString(),
      completions: [],
      color: selectedColor,
    };

    try {
      dispatch(addHabit(newHabit));
      const updatedHabits = [...habits, newHabit];
      await storageService.saveHabits(updatedHabits);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving habit:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder l&apos;habitude.');
    }
  };

  const renderColorPicker = () => (
    <View style={styles.colorContainer}>
      <Text style={styles.label}>Couleur</Text>
      <View style={styles.colorGrid}>
        {HABIT_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorButton,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColorButton,
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>
    </View>
  );

  const renderFrequencySelector = () => (
    <View style={styles.section}>
      <Text style={styles.label}>Fréquence</Text>
      <View style={styles.frequencyContainer}>
        <TouchableOpacity
          style={[
            styles.frequencyButton,
            frequency === 'daily' && styles.selectedFrequencyButton,
          ]}
          onPress={() => setFrequency('daily')}
        >
          <Text
            style={[
              styles.frequencyText,
              frequency === 'daily' && styles.selectedFrequencyText,
            ]}
          >
            Quotidien
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.frequencyButton,
            frequency === 'weekly' && styles.selectedFrequencyButton,
          ]}
          onPress={() => setFrequency('weekly')}
        >
          <Text
            style={[
              styles.frequencyText,
              frequency === 'weekly' && styles.selectedFrequencyText,
            ]}
          >
            Hebdomadaire
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Titre</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Boire 2L d'eau"
            placeholderTextColor={lightTheme.colors.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Icône</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowIconPicker(true)}
          >
            <Ionicons
              name={icon as keyof typeof Ionicons.glyphMap}
              size={24}
              color={selectedColor}
            />
            <Text style={styles.iconButtonText}>Choisir une icône</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={lightTheme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {renderFrequencySelector()}

        <View style={styles.section}>
          <Text style={styles.label}>Heure de rappel (optionnel)</Text>
          <TextInput
            style={styles.input}
            value={reminderTime}
            onChangeText={setReminderTime}
            placeholder="Ex: 08:00"
            placeholderTextColor={lightTheme.colors.textSecondary}
          />
        </View>

        {renderColorPicker()}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Créer l&apos;habitude</Text>
        </TouchableOpacity>
      </View>

      <IconPicker
        visible={showIconPicker}
        selectedIcon={icon}
        onSelect={setIcon}
        onClose={() => setShowIconPicker(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  content: {
    padding: lightTheme.spacing.lg,
  },
  section: {
    marginBottom: lightTheme.spacing.xl,
  },
  label: {
    fontSize: lightTheme.fontSize.md,
    fontWeight: lightTheme.fontWeight.medium,
    color: lightTheme.colors.text,
    marginBottom: lightTheme.spacing.sm,
  },
  input: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius.md,
    padding: lightTheme.spacing.md,
    fontSize: lightTheme.fontSize.md,
    color: lightTheme.colors.text,
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
  },
  iconButton: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius.md,
    padding: lightTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
  },
  iconButtonText: {
    flex: 1,
    marginLeft: lightTheme.spacing.md,
    fontSize: lightTheme.fontSize.md,
    color: lightTheme.colors.text,
  },
  frequencyContainer: {
    flexDirection: 'row',
    gap: lightTheme.spacing.md,
  },
  frequencyButton: {
    flex: 1,
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius.md,
    padding: lightTheme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
  },
  selectedFrequencyButton: {
    backgroundColor: lightTheme.colors.primary,
    borderColor: lightTheme.colors.primary,
  },
  frequencyText: {
    fontSize: lightTheme.fontSize.md,
    color: lightTheme.colors.text,
  },
  selectedFrequencyText: {
    color: lightTheme.colors.background,
  },
  colorContainer: {},
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: lightTheme.spacing.md,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColorButton: {
    borderColor: lightTheme.colors.text,
  },
  saveButton: {
    backgroundColor: lightTheme.colors.primary,
    borderRadius: lightTheme.borderRadius.md,
    padding: lightTheme.spacing.md,
    alignItems: 'center',
    marginTop: lightTheme.spacing.xl,
  },
  saveButtonText: {
    fontSize: lightTheme.fontSize.md,
    fontWeight: lightTheme.fontWeight.semibold,
    color: lightTheme.colors.background,
  },
});
