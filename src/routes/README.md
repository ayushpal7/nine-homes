# Pages

This app is a plain Vite + React static SPA for Appwrite static hosting.

Each file exports a normal React component. `src/App.tsx` chooses which page to
render from `window.location.pathname`, so there is no server runtime, generated
route tree, or special Appwrite server setting involved in deployment.
