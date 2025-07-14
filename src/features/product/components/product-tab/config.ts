export enum TabValue {
  NEW_ARRIVAL = 'new-arrival',
  BESTSELLER = 'bestseller',
  FEATURED = 'featured',
}

type TabConfig = {
  value: TabValue;
  label: string;
  href: string;
};

export const TABS_CONFIG: TabConfig[] = [
  {
    value: TabValue.NEW_ARRIVAL,
    label: 'New Arrival',
    href: `/?tab=${TabValue.NEW_ARRIVAL}`,
  },
  {
    value: TabValue.BESTSELLER,
    label: 'Bestseller',
    href: `/?tab=${TabValue.BESTSELLER}`,
  },
  {
    value: TabValue.FEATURED,
    label: 'Featured Products',
    href: `/?tab=${TabValue.FEATURED}`,
  },
];
