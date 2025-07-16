# Electronic Store

A modern, full-featured e-commerce web application for electronics, built with Next.js 15, ReactJS 19 and TypeScript.

## Features

- 🛒 Product catalog with categories, filters, and search
- 📦 Shopping cart and multi-step checkout flow
- 🔐 Authentication (NextAuth.js)
- 🧑 User profile and address management
- 💳 Payment and shipment method selection
- 📱 Responsive design for all devices
- ⚡ Fast, accessible, and SEO-friendly

## Tech Stack

- [Next.js 15](https://nextjs.org/)
- [Reactjs 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Configuration:**

   - Environment variables can be set in `.env.local`.
   - The app expects a running API backend (see `electronic-store-api` repo).

   **Required Environment Variables:**

   | Key                    | Description                                              | Example Value                  |
   |------------------------|----------------------------------------------------------|--------------------------------|
   | `NEXT_PUBLIC_BASE_URL` | The base URL of your frontend application                | `http://localhost:3000`        |
   | `NEXT_PUBLIC_API_KEY`  | API key for accessing backend services  | `your-public-api-key`          |
   | `NEXT_PUBLIC_API_URL`  | The base URL of the backend API                         | `http://localhost:4000/api`    |
   | `AUTH_SECRET`          | Secret key for NextAuth.js authentication                | `your-random-secret`           |
   | `AUTH_TRUST_HOST`      | Set to `true` to trust the host for NextAuth.js          | `true`                         |

   **Example `.env.local`:**
   ```
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_API_KEY=your-public-api-key
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   AUTH_SECRET=your-random-secret
   AUTH_TRUST_HOST=true
   ```

## API Integration

This frontend application relies on a separate backend API, typically provided by the [`electronic-store-api`](https://github.com/anhoang-agilityio/electronic-store-api) project.

- **Running the API:**  
  Make sure the backend API is running and accessible at the URL you provide.  
  See the [`electronic-store-api`](https://github.com/anhoang-agilityio/electronic-store-api) repository for setup instructions.

## Project Structure

Follow the structure of [`bullet-proof-react`](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md) repository


```
src/
  api/         # API client utilities
  app/         # Next.js app directory (routing, pages, layouts)
  components/  # Reusable UI and layout components
  config/      # App configuration (env, paths)
  features/    # Feature modules (cart, checkout, product, etc.)
  hooks/       # Custom React hooks
  lib/         # Shared utilities
  stores/      # State management
  styles/      # Global styles and fonts
  types/       # TypeScript types
  utils/       # Utility functions
```

## Scripts

- `dev` – Start development server
- `build` – Build for production
- `start` – Start production server
- `lint` – Run ESLint

