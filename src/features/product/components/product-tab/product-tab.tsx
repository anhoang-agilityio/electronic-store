import React from 'react';

import { NavLink } from '@/components/ui/nav-link';

import { TabValue, TABS_CONFIG } from './config';
import { ProductTabContent } from './product-tab-content';

export type ProductTabProps = {
  tab?: string | TabValue;
};

export function ProductTab({ tab }: ProductTabProps) {
  // Get current tab from prop, default to 'new-arrival'
  const currentTab = (tab as TabValue) || TabValue.NEW_ARRIVAL;

  return (
    <section className="w-full bg-white py-14">
      <div className="max-w-7xl mx-auto px-10">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          {TABS_CONFIG.map((tab) => (
            <NavLink
              key={tab.value}
              href={tab.href}
              className="cursor-pointer relative px-2 py-1 text-center text-base text-muted-foreground font-medium border-none rounded-md transition-colors hover:bg-accent hover:text-foreground"
              activeClassName="text-foreground hover:bg-transparent after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-current"
              activeSearchParam="tab"
              activeSearchValue={tab.value}
              defaultActiveValue={TabValue.NEW_ARRIVAL}
              scroll={false}
              replace={true}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-0">
          <ProductTabContent tabType={currentTab} />
        </div>
      </div>
    </section>
  );
}
