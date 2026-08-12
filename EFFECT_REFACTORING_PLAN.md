# Effect.ts Refactoring Plan

## Goal

Apply Effect.ts where it improves asynchronous workflows, runtime validation, typed error handling, dependency management, resilience, observability, and testability. Keep presentational React code and simple pure utilities conventional.

> Effect.ts is not currently installed in this project.

## Priority 1 — Foundations and API Boundaries

### 1. HTTP client

**Files:**

- `src/lib/api-client.ts`

**Applications:**

- Replace thrown `ApiError` values and generic `Promise<T>` results with typed `Effect` values.
- Model network, HTTP status, response parsing, timeout, and interruption failures explicitly.
- Add centralized retry, timeout, request logging, and cancellation policies.
- Keep conversion to `Promise` only at Next.js, React, and Auth.js boundaries.

### 2. Runtime validation of API responses

**Files:**

- `src/types/api.ts`
- `src/features/*/api/*.ts`

**Applications:**

- Define Effect Schema schemas for products, categories, brands, reviews, pagination, and search responses.
- Decode all backend responses instead of casting `response.json()` to TypeScript types.
- Report malformed backend data as typed decode errors.
- Reuse schemas to derive TypeScript types.

### 3. Typed application errors

**Files:**

- `src/lib/api-client.ts`
- `src/app/[category]/page.tsx`
- `src/app/[category]/[product]/page.tsx`
- `src/features/product/hooks/use-search-product.ts`
- Other asynchronous components and workflows

**Applications:**

- Introduce tagged errors such as:
  - `NetworkError`
  - `HttpError`
  - `NotFoundError`
  - `UnauthorizedError`
  - `ValidationError`
  - `DecodeError`
  - `StorageError`
  - `PaymentError`
- Replace broad `try/catch` blocks with typed recovery using `Effect.catchTag`, `Effect.catchTags`, or matching.
- Translate errors into `notFound()`, error UI, redirects, or user notifications only at framework boundaries.

### 4. API repositories and dependency injection

**Files:**

- `src/features/brand/api/*.ts`
- `src/features/category/api/*.ts`
- `src/features/product/api/*.ts`

**Applications:**

- Introduce `ProductRepository`, `CategoryRepository`, and `BrandRepository` services.
- Define production and test implementations with `Layer`.
- Move URL construction, HTTP calls, and response decoding behind repository interfaces.
- Consolidate duplicate product API functions currently contained in `src/features/product/api/get-new-arrivals.ts`.

### 5. Environment configuration

**Files:**

- `src/config/env.ts`
- `next.config.ts`

**Applications:**

- Replace eager Zod parsing and thrown configuration errors with Effect `Config` and typed configuration errors.
- Validate URLs and required values.
- Separate browser-safe public configuration from server-only secrets.
- Redact sensitive configuration from logs.
- Provide configuration layers for production and tests.

## Priority 2 — Application Workflows

### 6. Server Component data loading

**Files:**

- `src/app/[category]/page.tsx`
- `src/app/[category]/[product]/page.tsx`
- Homepage data-loading components under `src/features/category/components` and `src/features/product/components`

**Applications:**

- Compose page loading as Effect programs.
- Fetch independent resources concurrently with controlled concurrency.
- Apply consistent timeout, retry, caching, and recovery policies.
- Execute Effects at Server Component boundaries.
- Map typed `NotFoundError` values to Next.js `notFound()`.

### 7. Category page orchestration and query parsing

**Files:**

- `src/app/[category]/page.tsx`

**Applications:**

- Decode category IDs and search parameters with schemas.
- Validate page numbers, price ranges, brands, and sort values.
- Replace unchecked `parseInt` usage and prevent `NaN` or invalid ranges.
- Fetch brands and products concurrently after validating the category.

### 8. Product page orchestration

**Files:**

- `src/app/[category]/[product]/page.tsx`

**Applications:**

- Share product-loading logic between metadata generation and page rendering.
- Add typed 404 and decode-error handling.
- Cache or memoize repeated product requests when appropriate.

### 9. Homepage and product-section loading

**Files:**

- `src/features/category/components/category-list/category-list.tsx`
- `src/features/product/components/product-discount.tsx`
- `src/features/product/components/product-related.tsx`
- `src/features/product/components/product-tab/product-tab-content.tsx`

**Applications:**

- Replace inconsistent local `try/catch` behavior with reusable recovery policies.
- Distinguish empty results from failures.
- Provide consistent typed fallback UI.
- Apply shared caching and resilience policies.

### 10. Sitemap generation

**Files:**

- `src/app/sitemap.ts`

**Applications:**

- Model category and product pagination as an Effect workflow.
- Fetch categories with bounded concurrency.
- Add timeout and retry policies.
- Collect partial successes while retaining failure information for logging.
- Ensure pagination always terminates; the current loop can repeatedly retry the same page after a failure because `page` is not incremented in the error path.

### 11. Product search lifecycle

**Files:**

- `src/features/product/hooks/use-search-product.ts`

**Applications:**

- Interrupt stale requests when the query changes.
- Add Effect-based debounce and timeout behavior.
- Implement latest-request-wins semantics.
- Model idle, loading, success, empty, and failure states explicitly.
- Expose typed search errors to the UI.

### 12. Breadcrumb loading

**Files:**

- `src/components/layout/breadcrumb/use-generate-breadcrumb-items.ts`

**Applications:**

- Model route parsing and category/product lookup as an Effect.
- Cancel in-flight work when the pathname changes.
- Distinguish unsupported routes, missing entities, decode failures, and transport failures.

### 13. Authentication

**Files:**

- `src/auth.ts`
- `src/app/auth/signin/page.tsx`
- `src/middleware.ts`
- `src/components/utils/auth-store-syncer.tsx`

**Applications:**

- Introduce an `AuthService` abstraction.
- Validate credentials using schemas.
- Wrap Auth.js promise APIs with `Effect.tryPromise`.
- Represent invalid credentials, unauthorized access, and provider failures as tagged errors.
- Supply test authentication layers.
- Convert Effect results to Auth.js callbacks, redirects, and React state at the boundaries.

### 14. Checkout and payment workflow

**Files:**

- `src/features/checkout/**`
- `src/features/address/**`
- `src/features/shipment/**`

**Applications:**

- Model checkout as a validated workflow: products → address → shipment → payment.
- Prevent invalid transitions with domain-level validation.
- Replace simulated payment `setTimeout` with `Effect.sleep` and an interruptible payment Effect.
- Distinguish payment rejection, transport failure, cancellation, and success.
- Clear checkout/cart state only after confirmed success.

### 15. Client persistence and store boundaries

**Files:**

- `src/stores/user-store.ts`
- `src/types/store.ts`

**Applications:**

- Decode and validate persisted `localStorage` state.
- Add explicit schema versions and migrations.
- Represent read, write, quota, and decode failures as typed errors.
- Move cart, address, and checkout commands into testable domain functions or services.
- Keep Zustand as the React subscription adapter if desired.
- Do not persist credit-card details or other sensitive payment data.

## Priority 3 — Domain Safety, Resilience, and Quality

### 16. Form validation

**Files:**

- `src/app/auth/signin/page.tsx`
- `src/features/address/components/address-form.tsx`
- `src/features/checkout/components/checkout-payment-panel.tsx`
- `src/types/store.ts`

**Applications:**

- Migrate Zod schemas to Effect Schema where practical.
- Integrate schemas with React Hook Form through an appropriate resolver or adapter.
- Reuse the same schemas across forms, repositories, persisted state, and domain workflows.

### 17. Domain modeling and branded values

**Files:**

- `src/types/api.ts`
- `src/types/store.ts`
- New domain modules

**Applications:**

- Add branded or refined types for:
  - Product, category, brand, user, and address IDs
  - Positive cart quantities
  - Monetary amounts and discounts
  - Ratings
  - URLs
  - Phone numbers
  - Pagination values
  - Price ranges
  - Payment fields
- Make invalid domain states difficult to construct.

### 18. Cart and address commands

**Files:**

- `src/stores/user-store.ts`

**Applications:**

- Replace silent no-ops with explicit domain results or typed errors.
- Handle missing users, invalid quantities, unknown cart items, and unknown addresses explicitly.
- Separate pure state transitions from persistence and React bindings.

### 19. DTO transformations

**Files:**

- `src/features/product/utils/dto.ts`

**Applications:**

- Replace unchecked mapping with schema transformations.
- Validate discounts, prices, image availability, and required identifiers.
- Normalize monetary calculations in one domain module.

### 20. Routing and middleware validation

**Files:**

- `src/middleware.ts`
- Dynamic route pages
- Product filters and sorting components

**Applications:**

- Decode route parameters and query strings through schemas.
- Model route authorization decisions as pure Effect programs where useful.
- Convert final decisions to `NextResponse`, redirects, or `notFound()` at Next.js boundaries.

### 21. Caching and request deduplication

**Files:**

- Repository and page-program layers

**Applications:**

- Cache categories, products, metadata, and breadcrumb lookups.
- Add request-scoped memoization for repeated Server Component requests.
- Use TTL caching where stale data is acceptable.
- Make cache policy explicit and testable.

### 22. Resilience policies

**Files:**

- HTTP and repository layers

**Applications:**

- Centralize timeout, retry, exponential backoff, and jitter policies.
- Retry only transient network and server failures.
- Avoid retrying validation/decode failures and most client errors.
- Apply bounded concurrency to bulk requests.

### 23. Observability

**Files:**

- HTTP client
- Repositories
- Authentication and checkout workflows
- Sitemap generation

**Applications:**

- Add structured logging and spans.
- Record request names, status codes, durations, retry counts, and typed failure causes.
- Attach correlation metadata where available.
- Redact credentials, API keys, tokens, and payment data.

### 24. Resource lifecycle and interruption

**Files:**

- Search and breadcrumb hooks
- `src/features/checkout/components/step-actions.tsx`
- Future subscriptions, streams, or WebSocket features

**Applications:**

- Use Effect scopes to guarantee cleanup.
- Interrupt requests and timers when components unmount or inputs change.
- Manage subscriptions and long-running resources safely.

### 25. Testing

**Current state:** No test files are present.

**Applications:**

- Test schemas and domain transformations.
- Test repository programs with in-memory layers.
- Test retry and timeout behavior with a deterministic clock.
- Test search interruption and latest-request-wins behavior.
- Test checkout transitions and payment outcomes.
- Test configuration failures without modifying real environment variables.
- Test storage migrations and corrupted persisted data.

## Suggested Folder Architecture

Retain the current feature-first organization. Each `features/*` directory acts as a self-contained feature module or vertical slice, comparable to a NestJS feature module. A feature may contain domain, service, infrastructure implementation, transport, and presentation concerns while exposing only a controlled public API.

### Feature module structure

Using the product feature as the reference:

```text
src/features/product/
├── index.ts
├── domain/
│   ├── product.ts
│   ├── product-id.ts
│   └── pricing.ts
├── service/
│   ├── product-service.ts
│   ├── product-repository.ts
│   ├── product-input.ts
│   └── product-errors.ts
├── transport/
│   ├── product-response.ts
│   ├── product-list-response.ts
│   ├── product-query.ts
│   └── product-mapper.ts
├── layer/
│   ├── product-repository-live.ts
│   ├── product-repository-test.ts
│   ├── product-service-live.ts
│   └── product-live.ts
└── presentation/
    ├── components/
    ├── hooks/
    ├── models/
    └── mappers/
```

Do not create empty folders merely for symmetry. Smaller features may keep files at their root and introduce these directories as their responsibilities grow.

### `domain/`

Contains only protocol-independent feature concepts and pure business rules:

- The canonical domain entity, such as `Product`
- Branded identifiers, such as `ProductId`
- Value objects and enums
- Effect Schemas that enforce domain invariants
- Pure rules such as discount and base-price calculations

The domain must not depend on React, Next.js, transport DTOs, HTTP, Zustand, storage, service implementations, or Effect Layers.

Pure pricing derived entirely from a product belongs here. Pricing that requires user status, promotions, coupons, region, currency conversion, time, or another injected capability belongs in `ProductService`.

### `service/`

Contains the feature's Effect service abstractions:

- `ProductService` is the public feature capability used by presentation code and other feature modules.
- `ProductRepository` is the outbound data-access abstraction used internally by `ProductService`.
- Protocol-independent service inputs and outputs belong here.
- Public application-level tagged errors belong here.

The intended dependency is:

```text
Consumer → ProductService → ProductRepository
```

Other modules should normally depend on `ProductService`, not `ProductRepository`.

A separate service and repository are justified when the service adds behavior such as validation, error translation, caching policy, authorization, domain decisions, aggregation, or orchestration. If the service merely forwards every call to the repository, use one public capability—such as `ProductCatalog`—until a second abstraction has a meaningful role.

Individual operations such as getting, listing, and searching products may be methods on the injected `ProductService`. Complex methods may still delegate to private, independently testable functions without exposing each function as a separate public service.

### `transport/`

Contains representations and mapping logic controlled by an external transport contract. `transport` is preferred over `api` because “API” could also mean the feature's public TypeScript API exposed through `index.ts`.

For the current HTTP backend, this folder contains:

- Request and query DTOs
- Response DTOs
- Effect Schemas for decoding unknown API data
- DTO-to-domain mappers
- Serialization between protocol-independent service inputs and HTTP query parameters

Keep the representations distinct:

```text
Backend JSON → decoded transport DTO → domain entity → presentation model
```

Backend pagination fields and query parameter names belong here rather than in `domain/`. Presentation models such as `ProductCardModel` do not belong here; they remain under `presentation/`.

If the feature later supports multiple transports, split it further:

```text
transport/
├── http/
├── websocket/
└── storage/
```

### `layer/`

Contains concrete Effect implementations and their dependency wiring:

- Live HTTP-backed `ProductRepository` implementation
- Live `ProductService` implementation
- Test implementations
- The composed feature `ProductLive` Layer

The repository implementation may depend on shared `HttpClient`, configuration, logging, and caching services. It owns product endpoint paths, transport DTO decoding, query serialization, and mapping infrastructure failures into product application errors.

Because `Layer` has a specific meaning in Effect, files in this directory should export actual Effect Layers. If implementation bodies become large, move their constructor functions into a separate internal implementation module and leave only Layer construction and composition here.

### `presentation/`

Contains React-facing code:

- Components
- Hooks
- Forms
- View models
- Domain-to-view-model mappers
- Loading, empty, success, and typed error states

Presentation code consumes `ProductService`; it should not invoke `ProductRepository` or reconstruct HTTP behavior. View mappers should target explicit presentation models rather than derive their target type from component props.

### `index.ts`

Defines the feature's public API, analogous to the `exports` declaration of a NestJS module. It should expose only the domain values, public service contract, feature Layer, and presentation components intentionally available to consumers.

Do not publicly expose repository implementations, transport DTOs, endpoint details, or internal mappers. Cross-feature imports should use the owning feature's public entry point rather than deep-import its internals.

### Shared infrastructure and runtimes

Capabilities that are genuinely generic across features remain outside feature modules:

```text
src/
├── features/
│   ├── product/
│   ├── category/
│   ├── brand/
│   ├── cart/
│   ├── address/
│   ├── shipment/
│   ├── checkout/
│   └── auth/
├── lib/
│   └── effect/
│       ├── http/
│       ├── config/
│       └── storage/
└── runtime/
    ├── server.ts
    └── client.ts
```

Shared infrastructure owns generic mechanics such as HTTP execution, headers, timeouts, interruption, retry mechanics, logging, configuration loading, and storage access. Each feature owns its endpoint paths, transport schemas, transport mapping, and feature-specific errors.

The server and client runtimes compose shared infrastructure with feature Layers and execute Effects at Next.js, React, and Auth.js boundaries.

### Dependency rules

```text
domain
  → shared domain primitives only

service
  → domain

transport
  → transport schemas and domain

layer
  → service contracts, domain, transport, and shared infrastructure

presentation
  → public service contract, domain, and presentation models

other features
  → owning feature's public index.ts only
```

Avoid these dependency directions:

```text
domain       → transport, Layer, React, Next.js, HTTP, or storage
service      → concrete Layer implementations or transport-shaped DTOs
presentation → repository implementations or raw HTTP client
feature A    → feature B internals
shared UI    → feature modules
```

Cross-feature dependencies are allowed when they target narrow public service contracts, remain directional and acyclic, and represent a genuine business dependency. Effect dependency injection changes how implementations are supplied; it does not remove the architectural dependency. Cross-feature workflows with no clear owning feature should be orchestrated at a higher application or route boundary.

## Rollout Stages

### Stage 1 — Install and establish conventions

- Install `effect` and any required Effect platform packages.
- Decide module naming, error conventions, service definitions, and runtime boundaries.
- Add server and browser runtimes/layers.
- Document the rule that Effects are executed only at framework boundaries.
- Add a minimal test setup before substantial migration.

**Outcome:** The project has a consistent Effect foundation without changing user-facing behavior.

### Stage 2 — Add schemas and domain errors

- Create schemas for API responses, configuration, route/query inputs, and persisted state.
- Derive TypeScript types from schemas where possible.
- Introduce the shared tagged-error model.
- Add branded/refined domain values for IDs, money, quantities, ratings, and pagination.

**Outcome:** External and persisted data can be validated, and failure channels are explicitly typed.

### Stage 3 — Refactor the HTTP client

- Replace the Promise/throwing API client with an Effect-based client.
- Add response decoding, timeouts, interruption, and structured errors.
- Define retry policies for transient failures.
- Add request logging with sensitive-field redaction.

**Outcome:** All network behavior is centralized, typed, observable, and resilient.

### Stage 4 — Introduce repository services and layers

- Create product, category, and brand repository services.
- Move endpoint construction and decoding into live layers.
- Create test layers with deterministic data and failures.
- Remove duplicate API implementations.
- Temporarily provide Promise adapters if needed for incremental migration.

**Outcome:** Features depend on interfaces rather than direct `fetch` calls.

### Stage 5 — Migrate server-rendered data flows

- Refactor category and product pages.
- Refactor metadata generation and homepage product/category sections.
- Run independent operations concurrently.
- Map typed missing-resource errors to `notFound()`.
- Add request deduplication or caching where beneficial.

**Outcome:** Primary storefront pages use Effect end to end up to their Next.js rendering boundaries.

### Stage 6 — Refactor sitemap and background-style workflows

- Reimplement sitemap pagination using Effect iteration.
- Add bounded concurrency, retries, timeouts, and partial-failure logging.
- Guarantee termination after request failures.

**Outcome:** Bulk data workflows are safe, bounded, and diagnosable.

### Stage 7 — Migrate client asynchronous workflows

- Refactor product search with debounce, cancellation, and latest-request-wins semantics.
- Refactor breadcrumb loading with interruption on route changes.
- Introduce client runtime hooks/adapters for safely executing Effects.

**Outcome:** Client-side asynchronous behavior handles cancellation and race conditions correctly.

### Stage 8 — Migrate authentication

- Introduce `AuthService` and credential schemas.
- Wrap Auth.js APIs and callbacks at Effect boundaries.
- Add tagged authentication errors and test layers.
- Keep middleware and NextAuth callback return types framework-native.

**Outcome:** Authentication logic is validated, testable, and separated from Auth.js integration details.

### Stage 9 — Migrate cart, storage, and checkout

- Extract pure cart/address/checkout domain transitions from Zustand.
- Validate persisted data and add versioned migrations.
- Remove payment-card data from persistence.
- Model checkout and payment as Effect workflows.
- Replace simulated timers with interruptible Effect operations.

**Outcome:** Store and checkout behavior is domain-safe, recoverable, and testable.

### Stage 10 — Complete validation migration

- Replace remaining Zod schemas with Effect Schema where the migration provides reuse or consistency.
- Integrate Effect Schema with React Hook Form.
- Reuse schemas across forms, domain logic, storage, and transport boundaries.

**Outcome:** Validation uses one shared schema system across the application.

### Stage 11 — Add caching, observability, and production policies

- Finalize caching and request-deduplication policies.
- Add structured logs and tracing around repositories and major workflows.
- Tune retries, backoff, timeouts, and concurrency limits.
- Verify that secrets and payment information cannot appear in logs.

**Outcome:** The Effect-based architecture is production-ready and observable.

### Stage 12 — Expand test coverage and remove migration adapters

- Add tests for services, layers, schemas, workflows, timing, retries, and failures.
- Remove temporary Promise wrappers and duplicated legacy paths.
- Review bundles to ensure server-only Effect modules do not leak into browser code.
- Measure behavior and performance against the pre-refactoring implementation.

**Outcome:** Migration is complete, legacy abstractions are removed, and critical behavior is covered by deterministic tests.

## Areas to Keep Conventional

Effect should generally not replace:

- Presentational components under `src/components/ui`
- Static banners and layouts
- Tailwind styling and Radix UI composition
- Simple deterministic utility functions
- Basic local React state with no asynchronous or fallible behavior
- Next.js control-flow APIs such as `notFound()` and `NextResponse`; typed Effect results should be translated into these at framework boundaries
