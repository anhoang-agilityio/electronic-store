import { useState, useEffect } from 'react';

// Tailwind CSS default breakpoints in rem units
const TAILWIND_BREAKPOINTS = {
  SM: 40, // 640px / 16px = 40rem
  MD: 48, // 768px / 16px = 48rem
  LG: 64, // 1024px / 16px = 64rem
} as const;

// Helper to get Tailwind breakpoints from CSS variables (fallback to defaults)
function getBreakpoints() {
  const styles = getComputedStyle(document.documentElement);
  const sm =
    parseInt(styles.getPropertyValue('--breakpoint-sm')) ||
    TAILWIND_BREAKPOINTS.SM;
  const md =
    parseInt(styles.getPropertyValue('--breakpoint-md')) ||
    TAILWIND_BREAKPOINTS.MD;
  const lg =
    parseInt(styles.getPropertyValue('--breakpoint-lg')) ||
    TAILWIND_BREAKPOINTS.LG;

  return { sm, md, lg };
}

export function useBreakpoints() {
  const [breakpoints, setBreakpoints] = useState({
    isSmScreen: true, // < sm (0 to sm-1)
    isMdScreen: false, // sm to md-1
    isLgScreen: false, // md to lg-1
    isXlScreen: false, // >= lg
  });

  useEffect(() => {
    const { sm, md, lg } = getBreakpoints();
    const controller = new AbortController();
    const { signal } = controller;

    // Create MediaQueryList for each breakpoint
    const smQuery = window.matchMedia(`(min-width: ${sm}rem)`);
    const mdQuery = window.matchMedia(`(min-width: ${md}rem)`);
    const lgQuery = window.matchMedia(`(min-width: ${lg}rem)`);

    // Initial state
    const updateBreakpoints = () => {
      setBreakpoints({
        isSmScreen: !smQuery.matches, // Below sm breakpoint
        isMdScreen: smQuery.matches && !mdQuery.matches, // Between sm and md
        isLgScreen: mdQuery.matches && !lgQuery.matches, // Between md and lg
        isXlScreen: lgQuery.matches, // Above lg breakpoint
      });
    };

    // Set initial state
    updateBreakpoints();

    // Add listeners for each breakpoint
    smQuery.addEventListener('change', updateBreakpoints, { signal });
    mdQuery.addEventListener('change', updateBreakpoints, { signal });
    lgQuery.addEventListener('change', updateBreakpoints, { signal });

    // Cleanup
    return () => controller.abort();
  }, []);

  return breakpoints;
}
