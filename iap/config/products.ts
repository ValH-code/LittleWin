// In-App Purchase Product Configuration
export interface IAPProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  type: 'subscription' | 'consumable' | 'non_consumable';
  period?: 'monthly' | 'yearly';
}

export const IAP_PRODUCTS: IAPProduct[] = [
  {
    id: 'premium_monthly',
    title: 'Premium Mensuel',
    description: 'Accès aux fonctionnalités premium pour un mois',
    price: '2.99',
    type: 'subscription',
    period: 'monthly',
  },
  {
    id: 'premium_yearly',
    title: 'Premium Annuel',
    description: 'Accès aux fonctionnalités premium pour un an (économie 44%)',
    price: '19.99',
    type: 'subscription',
    period: 'yearly',
  },
  {
    id: 'lifetime',
    title: 'Accès à vie',
    description: 'Accès illimité à toutes les fonctionnalités',
    price: '49.99',
    type: 'non_consumable',
  },
  {
    id: 'extra_badges',
    title: 'Pack Badges Premium',
    description: 'Débloque 10 badges exclusifs',
    price: '1.99',
    type: 'consumable',
  },
];

export const PREMIUM_FEATURES = [
  'Nombre illimité d\'habitudes',
  'Statistiques avancées',
  'Exportation des données',
  'Synchronisation cloud',
  'Thèmes personnalisés',
  'Widgets avancés',
  'Rappels intelligents',
  'Analyses comportementales',
] as const;
