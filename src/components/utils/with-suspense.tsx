import React, { Suspense, ComponentType } from 'react';

// HOC: Wrap component with Suspense
export function withSuspense<P extends object>(
  WrappedComponent: ComponentType<P>,
) {
  const ComponentWithSuspense = (props: P) => {
    return (
      <Suspense>
        <WrappedComponent {...props} />
      </Suspense>
    );
  };
  return ComponentWithSuspense;
}
