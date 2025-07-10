# LittleWin - Guide de développement

## 🎯 Vue d'ensemble du projet

LittleWin est une application React Native TypeScript qui gamifie le suivi d'habitudes quotidiennes et hebdomadaires. Le projet utilise Expo pour un développement rapide et une configuration simplifiée.

## 🏗️ Architecture

### Stack technologique
- **Frontend**: React Native + TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Styling**: Thème personnalisé avec support du mode sombre
- **Animations**: React Native Reanimated
- **Stockage**: AsyncStorage
- **Icons**: Expo Vector Icons

### Structure des dossiers
```
src/
├── components/          # Composants réutilisables
├── screens/            # Écrans de l'application
├── navigation/         # Configuration React Navigation
├── store/              # Redux store et slices
├── types/              # Types TypeScript
├── utils/              # Utilitaires et helpers
├── theme/              # Configuration du thème
└── hooks/              # Hooks personnalisés
```

## 🚀 Démarrage rapide

### 1. Installation
```bash
cd LittleWin
npm install
```

### 2. Lancement
```bash
# Démarrer le serveur de développement
npm start

# Lancer sur plateforme spécifique
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Navigateur web
```

### 3. VS Code
Utilisez les tâches VS Code prédéfinies :
- `Cmd+Shift+P` → "Tasks: Run Task"
- Sélectionnez "Start Expo" pour démarrer le serveur

## 🎮 Fonctionnalités implémentées

### ✅ Core Features
- [x] Création et gestion d'habitudes
- [x] Suivi quotidien/hebdomadaire
- [x] Système de progression avec barres animées
- [x] Calendrier d'historique visuel
- [x] Gamification (points, niveaux, badges)
- [x] Thème clair/sombre automatique
- [x] Animations de récompense

### ✅ Écrans
- [x] **HomeScreen**: Liste des habitudes avec actions rapides
- [x] **AddHabitScreen**: Formulaire de création avec sélecteur d'icônes
- [x] **HabitDetailScreen**: Historique détaillé et statistiques
- [x] **ProfileScreen**: Niveau utilisateur et badges

### ✅ Composants
- [x] **HabitCard**: Carte d'habitude avec progression
- [x] **ProgressBar**: Barre de progression animée
- [x] **IconPicker**: Sélecteur d'icônes modal
- [x] **CalendarHistory**: Calendrier d'historique visuel
- [x] **FloatingButton**: Bouton d'action flottant

## 📱 Navigation

L'application utilise une navigation hybride :
- **Stack Navigator** pour la navigation principale
- **Bottom Tab Navigator** pour les sections (Accueil, Profil, À propos)

```typescript
Main (Tab Navigator)
├── Home
├── Profile
└── About

Stack Navigator
├── Main
├── AddHabit (Modal)
├── HabitDetail
└── EditHabit (Modal)
```

## 💾 State Management

### Redux Store Structure
```typescript
{
  habits: {
    habits: Habit[],
    loading: boolean,
    error: string | null
  },
  user: {
    user: User | null,
    theme: 'light' | 'dark' | 'auto'
  }
}
```

### Actions principales
- `addHabit`: Ajouter une nouvelle habitude
- `updateHabit`: Modifier une habitude existante
- `addCompletion`: Marquer une habitude comme complétée
- `updateUserPoints`: Mettre à jour les points utilisateur

## 🎨 Thèmes et styling

### Système de thème
```typescript
const lightTheme = {
  colors: { /* couleurs mode clair */ },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  borderRadius: { sm: 4, md: 8, lg: 12, xl: 16 },
  fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
  shadows: { /* ombres pour iOS/Android */ }
}
```

### Couleurs d'habitudes
16 couleurs prédéfinies pour personnaliser les habitudes.

## 📊 Gamification

### Système de points
- **10 points** par complétion d'habitude
- **Bonus de série** : 5 points × nombre de jours consécutifs
- **Niveaux** : 1 niveau par tranche de 100 points

### Badges
- Premier pas (1 habitude créée)
- Une semaine (7 jours de série)
- Un mois (30 jours de série)
- Centenaire (100 complétions)
- Et plus...

## 🔔 Notifications (Préparé)

Structure prête pour l'implémentation :
```typescript
notificationService.scheduleNotification(
  "Rappel d'habitude",
  "Il est temps de faire votre exercice !",
  { hour: 8, minute: 0 }
);
```

## 💰 In-App Purchases (Préparé)

### Produits configurés
- **Premium Mensuel** : 2.99€/mois
- **Premium Annuel** : 19.99€/an (économie 44%)
- **Accès à vie** : 49.99€

### Fichiers de configuration
- `iap/ios/LittleWin.storekit` : Configuration App Store
- `iap/android/billing.json` : Configuration Google Play
- `iap/config/products.ts` : Définition des produits

## 🧪 Tests et qualité

### Linting
```bash
npm run lint
```

### Structure de test recommandée
```
__tests__/
├── components/
├── screens/
├── utils/
└── store/
```

## 📦 Build et déploiement

### Développement
```bash
npm start          # Serveur de développement
npm run ios        # iOS Simulator
npm run android    # Android Emulator
```

### Production (avec EAS)
```bash
eas build --platform ios
eas build --platform android
eas submit
```

## 🔧 Configuration avancée

### AsyncStorage
Stockage local automatique pour :
- Habitudes et historique
- Préférences utilisateur
- Thème sélectionné

### Animations
React Native Reanimated pour :
- Barres de progression animées
- Animations de récompense
- Transitions fluides

## 🚧 Prochaines étapes

### Version 1.1
- [ ] Notifications push fonctionnelles
- [ ] Widgets iOS/Android
- [ ] Synchronisation cloud

### Version 1.2
- [ ] Statistiques avancées
- [ ] Exportation de données
- [ ] Mode équipe/défis

### IAP Implementation
- [ ] Intégration react-native-purchases
- [ ] Écrans de souscription
- [ ] Gestion des fonctionnalités premium

## 🐛 Résolution de problèmes

### Erreurs communes
1. **Metro bundler** : `npx react-native start --reset-cache`
2. **Dépendances iOS** : `cd ios && pod install`
3. **Cache Expo** : `expo start -c`

### Performance
- Utiliser `React.memo` pour les composants lourds
- Optimiser les images avec `expo-image`
- Lazy loading pour les écrans non critiques

## 📞 Support

- GitHub Issues pour les bugs
- Discussions pour les questions
- Wiki pour la documentation étendue

---

Développé avec ❤️ pour transformer les habitudes en réussites !
