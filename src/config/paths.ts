export const paths = {
  home: {
    getHref: () => '/',
  },
  about: {
    getHref: () => '/about',
  },
  contact: {
    getHref: () => '/contact',
  },
  blog: {
    getHref: () => '/blog',
  },
  cart: {
    getHref: () => '/cart',
  },
  checkout: {
    step1: {
      getHref: () => '/checkout/step-1',
    },
    step2: {
      getHref: () => '/checkout/step-2',
    },
    step3: {
      getHref: () => '/checkout/step-3',
    },
    step: (step: 1 | 2 | 3) => ({
      getHref: () => `/checkout/step-${step}`,
    }),
  },
  profile: {
    getHref: () => '/profile',
  },
  auth: {
    signin: {
      getHref: () => '/auth/signin',
    },
  },
  category: (categoryId: string) => ({
    getHref: () => `/${categoryId}`,
    product: (productId: string) => ({
      getHref: () => `/${categoryId}/${productId}`,
    }),
  }),
} as const;
