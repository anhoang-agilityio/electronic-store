import { Cause, Data, Duration, Effect, Fiber } from 'effect';
import * as React from 'react';

import type { Product } from '@/features/product/domain';
import {
  ProductService,
  type SearchParams,
} from '@/features/product/service/product-service';
import { appRuntime } from '@/lib/effect/runtime';

/** Distinct timeout error — kept in the failure channel. */
export class SearchTimeoutError extends Data.TaggedError('SearchTimeoutError')<{
  query: string;
  timeout: Duration.Duration;
}> {}

// ─── Discriminated state ─────────────────────────────────────────────────────

export type SearchState =
  | { _tag: 'Idle' }
  | { _tag: 'Loading'; query: string }
  | { _tag: 'Success'; query: string; products: Product[] }
  | { _tag: 'Failure'; query: string; error: unknown };

export type UseSearchProductOptions = {
  pageSize?: number;
  /** Debounce delay before the network request fires. Default 300 ms. */
  debounce?: Duration.DurationInput;
  /** Per-request abort timeout. Default 5 s. */
  timeout?: Duration.DurationInput;
  onError?: (error: unknown) => void;
};

export type UseSearchProductReturn = {
  /** Discriminated state — exhaustive switch in the UI. */
  state: SearchState;
  /** Back-compat: derived from state. Prefer `state` in new code. */
  searchResults: Product[];
  /** Back-compat: `state._tag === 'Loading'` */
  isPending: boolean;
  search: (query: string) => void;
  clear: () => void;
};

export function useSearchProduct(
  options: UseSearchProductOptions = {},
): UseSearchProductReturn {
  const {
    pageSize = 10,
    debounce: debounceInput = Duration.millis(300),
    timeout: timeoutInput = Duration.seconds(5),
    onError,
  } = options;

  // Normalize DurationInput once per options change
  const debounceDuration = React.useMemo(
    () => Duration.decode(debounceInput),
    [debounceInput],
  );
  const timeoutDuration = React.useMemo(
    () => Duration.decode(timeoutInput),
    [timeoutInput],
  );

  const [state, setState] = React.useState<SearchState>({ _tag: 'Idle' });

  // Fiber of the currently running search (sleep + fetch). Null when idle.
  const fiberRef = React.useRef<Fiber.RuntimeFiber<void, unknown> | null>(null);
  // Monotonic query — guards against a late commit after interrupt (defensive).
  const queryRef = React.useRef('');

  const interruptPrev = React.useCallback(() => {
    const fiber = fiberRef.current;
    if (fiber !== null) {
      // `Fiber.interrupt` is itself an Effect; run it on the same runtime.
      // Fire-and-forget — we don't need to await the Exit.
      appRuntime.runFork(Fiber.interrupt(fiber));
      fiberRef.current = null;
    }
  }, []);

  // Unmount → abort in-flight fetch (propagates AbortSignal via FetchHttpClient)
  React.useEffect(() => () => interruptPrev(), [interruptPrev]);

  const clear = React.useCallback(() => {
    queryRef.current = '';
    interruptPrev();
    setState({ _tag: 'Idle' });
  }, [interruptPrev]);

  const search = React.useCallback(
    (query: string) => {
      const q = query.trim();
      queryRef.current = q;

      // Empty → idle, no debounce/fetch, cancel prior fiber
      if (!q) {
        interruptPrev();
        setState({ _tag: 'Idle' });
        return;
      }

      // Latest-wins: cancel previous fiber before forking the next.
      // If the previous fiber was still in `Effect.sleep(debounce)` the sleep
      // is interrupted and its fetch never starts — this IS the debounce.
      interruptPrev();
      setState({ _tag: 'Loading', query: q });

      const searchParams: SearchParams = { q, page: 1, pageSize };

      const program = Effect.gen(function* () {
        // Debounce — interruptible. Rapid keystrokes interrupt the sleep and
        // reset the timer; only the last query survives to the fetch.
        yield* Effect.sleep(debounceDuration);

        const productService = yield* ProductService.Service;

        // Timeout is applied to the repository call only, not the debounce.
        // On expiry we fail with a tagged SearchTimeoutError so the UI can
        // distinguish timeout from repository errors.
        const response = yield* productService
          .searchProducts(searchParams)
          .pipe(
            Effect.timeoutFail({
              duration: timeoutDuration,
              onTimeout: () =>
                new SearchTimeoutError({ query: q, timeout: timeoutDuration }),
            }),
          );

        return response;
      }).pipe(
        // Success → commit only if still the latest query (defensive vs race
        // where interrupt happened between fetch resolve and this tap).
        Effect.tap((response) =>
          Effect.sync(() => {
            if (queryRef.current !== q) return;
            setState({
              _tag: 'Success',
              query: q,
              products: response.products,
            });
          }),
        ),
        // Failure → ignore pure interruption (stale debounce/fetch), surface
        // everything else as Failure so the UI can render it distinctly.
        Effect.catchAllCause((cause) =>
          Cause.isInterruptedOnly(cause)
            ? Effect.void
            : Effect.sync(() => {
                if (queryRef.current !== q) return;
                const error = Cause.failureOption(cause);
                // failureOption is Option<E> — unwrap or keep the full Cause
                const failure = error._tag === 'Some' ? error.value : cause;
                onError?.(failure);
                setState({ _tag: 'Failure', query: q, error: failure });
              }),
        ),
        // Defects (unexpected throw) → Failure as well
        Effect.catchAllDefect((defect) =>
          Effect.sync(() => {
            if (queryRef.current !== q) return;
            onError?.(defect);
            setState({ _tag: 'Failure', query: q, error: defect });
          }),
        ),
        Effect.asVoid,
      );

      fiberRef.current = appRuntime.runFork(program);
    },
    [pageSize, debounceDuration, timeoutDuration, onError, interruptPrev],
  );

  const searchResults = state._tag === 'Success' ? state.products : [];
  const isPending = state._tag === 'Loading';

  return { state, searchResults, isPending, search, clear };
}
