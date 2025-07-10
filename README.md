# LittleWin - Habit Tracker Gamifié

LittleWin est une application React Native TypeScript qui transforme le suivi de vos habitudes en une expérience gamifiée amusante et motivante.

## 🚀 Fonctionnalités

### ✨ Core Features
- **Suivi d'habitudes quotidiennes et hebdomadaires**
- **Système de gamification avec points, niveaux et badges**
- **Rappels push configurables**
- **Historique visuel avec calendrier**
- **Mode sombre/clair automatique**
- **Animations de récompenses**

### 📱 Écrans
- **Accueil** : Liste des habitudes avec barre de progression
- **Ajouter une habitude** : Formulaire complet avec sélecteur d'icônes
- **Détail d'habitude** : Historique, statistiques et actions
- **Profil** : Niveau utilisateur, badges et statistiques globales

### 🎮 Système de gamification
- Points par complétion d'habitude
- Niveaux basés sur les points totaux
- Badges débloquables (première habitude, séries, etc.)
- Animations de récompense

## 🛠️ Technologies

### Frontend
- **React Native** avec TypeScript
- **Expo** pour le développement rapide
- **React Navigation** (Stack + Bottom Tab)
- **Redux Toolkit** pour le state management
- **React Native Reanimated** pour les animations
- **AsyncStorage** pour le stockage local
- **Styled Components** pour le styling

### Dépendances principales
```json
{
  "@reduxjs/toolkit": "^2.8.2",
  "react-redux": "^9.1.2",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "react-native-reanimated": "~3.17.4",
  "@react-navigation/native": "^7.1.14",
  "@react-navigation/stack": "^7.4.2",
  "@react-navigation/bottom-tabs": "^7.4.2",
  "react-native-vector-icons": "^10.2.0",
  "@expo/vector-icons": "^14.1.0"
}
```

## 📦 Installation

### Prérequis
- Node.js (version 18+)
- npm ou yarn
- Expo CLI
- iOS Simulator ou Android Emulator (pour le développement)

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd LittleWin
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Lancer l'application**
```bash
# Démarrer le serveur de développement
npm start
# ou
yarn start

# Lancer sur iOS
npm run ios
# ou
yarn ios

# Lancer sur Android
npm run android
# ou
yarn android

# Lancer sur le web
npm run web
# ou
yarn web
```

## 🏗️ Structure du projet

```
src/
├── components/           # Composants réutilisables
│   ├── HabitCard.tsx    # Carte d'habitude
│   ├── ProgressBar.tsx  # Barre de progression animée
│   ├── IconPicker.tsx   # Sélecteur d'icônes
│   ├── CalendarHistory.tsx # Calendrier d'historique
│   └── FloatingButton.tsx # Bouton flottant
├── screens/             # Écrans de l'application
│   ├── HomeScreen.tsx   # Écran d'accueil
│   ├── AddHabitScreen.tsx # Formulaire d'ajout
│   ├── HabitDetailScreen.tsx # Détail d'habitude
│   └── ProfileScreen.tsx # Profil utilisateur
├── navigation/          # Configuration de navigation
│   └── AppNavigator.tsx
├── store/               # Redux store et slices
│   ├── index.ts
│   ├── habitsSlice.ts
│   └── userSlice.ts
├── types/               # Types TypeScript
│   └── index.ts
├── utils/               # Utilitaires
│   ├── storage.ts       # AsyncStorage helpers
│   └── stats.ts         # Calculs statistiques
├── theme/               # Thème et couleurs
│   └── index.ts
└── hooks/               # Hooks personnalisés
    └── redux.ts
```

## 🎨 Styling et Thèmes

L'application utilise un système de thème personnalisé avec support automatique du mode sombre/clair :

```typescript
// Thème clair
export const lightTheme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    // ...
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  borderRadius: { sm: 4, md: 8, lg: 12, xl: 16, round: 50 },
  // ...
};
```

## 📱 Notifications Push

### Configuration iOS
1. Configurer les notifications dans `app.json` :
```json
{
  "expo": {
    "ios": {
      "icon": "./assets/icon.png",
      "supportsTablet": true
    }
  }
}
```

### Configuration Android
1. Ajouter les permissions dans `app.json` :
```json
{
  "android": {
    "permissions": [
      "RECEIVE_BOOT_COMPLETED",
      "VIBRATE"
    ]
  }
}
```

## 💰 In-App Purchases (Préparation)

### Structure pour IAP
```
iap/
├── ios/
│   └── LittleWin.storekit # Configuration App Store
├── android/
│   └── billing.json       # Configuration Google Play
└── config/
    ├── products.ts        # Définition des produits
    └── subscriptions.ts   # Définition des abonnements
```

### Produits plannifiés
- **Premium Monthly** : 2.99€/mois - Fonctionnalités avancées
- **Premium Yearly** : 19.99€/an - Économie de 44%
- **Lifetime** : 49.99€ - Accès à vie

## 🧪 Tests

```bash
# Lancer les tests
npm test
# ou
yarn test

# Tests avec couverture
npm run test:coverage
# ou
yarn test:coverage
```

## 🚀 Déploiement

### Build de production
```bash
# iOS
expo build:ios

# Android
expo build:android

# Web
npm run build:web
```

### Publication
```bash
# App Store & Google Play (avec EAS)
expo publish
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

## 📞 Support

- Email : support@littlewin.app
- GitHub Issues : [Issues](https://github.com/username/littlewin/issues)
- Documentation : [Wiki](https://github.com/username/littlewin/wiki)

## 🎯 Roadmap

### Version 1.1
- [ ] Widgets iOS/Android
- [ ] Synchronisation cloud
- [ ] Partage social des achievements

### Version 1.2
- [ ] Habitudes avec conditions météo
- [ ] Rappels intelligents basés sur l'IA
- [ ] Mode équipe/défis

### Version 2.0
- [ ] Watch App (Apple Watch)
- [ ] Analytics avancées
- [ ] Personnalisation complète de l'interface

---

Développé avec ❤️ par l'équipe LittleWin
