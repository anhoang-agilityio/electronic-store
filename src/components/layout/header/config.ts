import {
  Home,
  HelpCircle,
  Mail,
  FileText,
  Heart,
  ShoppingCart,
  User,
} from 'lucide-react';

export const navigationSections = {
  public: {
    title: 'Menu',
    links: [
      {
        href: '/',
        icon: Home,
        label: 'Home',
      },
      {
        href: '/about',
        icon: HelpCircle,
        label: 'About',
      },
      {
        href: '/contact',
        icon: Mail,
        label: 'Contact Us',
      },
      {
        href: '/blog',
        icon: FileText,
        label: 'Blog',
      },
    ],
  },
  user: {
    title: 'Account',
    links: [
      {
        href: '/favorites',
        icon: Heart,
        label: 'Favorites',
      },
      {
        href: '/cart',
        icon: ShoppingCart,
        label: 'Cart',
      },
      {
        href: '/profile',
        icon: User,
        label: 'Profile',
      },
    ],
  },
} as const;
