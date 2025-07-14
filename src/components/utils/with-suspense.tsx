import React, { Suspense, ComponentType, ReactNode } from 'react';

type WithSuspenseProps = {
  fallback?: ReactNode;
};

// HOC: Wrap component with Suspense
export function withSuspense<P extends object>(
  WrappedComponent: ComponentType<P>,
) {
  const ComponentWithSuspense = (props: P & WithSuspenseProps) => {
    const { fallback = null, ...rest } = props;
    return (
      <Suspense fallback={fallback}>
        <WrappedComponent {...(rest as P)} />
      </Suspense>
    );
  };
  return ComponentWithSuspense;
}
