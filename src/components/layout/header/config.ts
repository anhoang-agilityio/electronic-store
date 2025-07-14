import {
  Home,
  HelpCircle,
  Mail,
  FileText,
  Heart,
  ShoppingCart,
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
  cart: {
    href: '/cart',
    icon: ShoppingCart,
    label: 'Cart',
  },
  favorites: {
    href: '/favorites',
    icon: Heart,
    label: 'Favorites',
    disabled: true,
  },
};
