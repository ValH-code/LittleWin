import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../theme';

const HABIT_ICONS: (keyof typeof Ionicons.glyphMap)[] = [
  'fitness',
  'water',
  'book',
  'musical-notes',
  'walk',
  'bed',
  'restaurant',
  'heart',
  'leaf',
  'sunny',
  'moon',
  'bicycle',
  'basketball',
  'camera',
  'brush',
  'code-slash',
  'language',
  'calculator',
  'flower',
  'wine',
];

interface IconPickerProps {
  visible: boolean;
  selectedIcon: string;
  onSelect: (icon: string) => void;
  onClose: () => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  visible,
  selectedIcon,
  onSelect,
  onClose,
}) => {
  const renderIcon = ({ item }: { item: keyof typeof Ionicons.glyphMap }) => (
    <TouchableOpacity
      style={[
        styles.iconButton,
        selectedIcon === item && styles.selectedIconButton,
      ]}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <Ionicons
        name={item}
        size={24}
        color={selectedIcon === item ? lightTheme.colors.background : lightTheme.colors.text}
      />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Choisissez une icône</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={lightTheme.colors.text}
              />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={HABIT_ICONS}
            renderItem={renderIcon}
            numColumns={5}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.iconsContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: lightTheme.colors.background,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.lg,
    margin: lightTheme.spacing.lg,
    maxHeight: '80%',
    width: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.lg,
  },
  title: {
    fontSize: lightTheme.fontSize.lg,
    fontWeight: lightTheme.fontWeight.semibold,
    color: lightTheme.colors.text,
  },
  iconsContainer: {
    alignItems: 'center',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: lightTheme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    margin: lightTheme.spacing.sm,
    backgroundColor: lightTheme.colors.surface,
  },
  selectedIconButton: {
    backgroundColor: lightTheme.colors.primary,
  },
});
