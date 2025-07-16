import React, { Suspense, ComponentType, ReactNode } from 'react';

// HOC: Wrap component with Suspense
export function withSuspense<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallback?: ReactNode,
) {
  const ComponentWithSuspense = (props: P) => {
    return (
      <Suspense fallback={fallback}>
        <WrappedComponent {...props} />
      </Suspense>
    );
  };
  return ComponentWithSuspense;
}
