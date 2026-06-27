# Pages

This app is a plain Vite + React static SPA for Appwrite static hosting.

Each file exports a normal React component. `src/App.tsx` chooses which page to
render from `window.location.pathname`, so there is no SSR server, Nitro output,
TanStack Start runtime, or generated route tree involved in deployment.
