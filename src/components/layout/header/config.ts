import { Home, HelpCircle, Mail, FileText } from 'lucide-react';

import { paths } from '@/config/paths';

export const navigationSections = {
  public: {
    title: 'Menu',
    links: [
      {
        href: paths.home.getHref(),
        icon: Home,
        label: 'Home',
      },
      {
        href: paths.about.getHref(),
        icon: HelpCircle,
        label: 'About',
      },
      {
        href: paths.contact.getHref(),
        icon: Mail,
        label: 'Contact Us',
      },
      {
        href: paths.blog.getHref(),
        icon: FileText,
        label: 'Blog',
      },
    ],
  },
};
