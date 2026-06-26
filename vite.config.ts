// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv, type Plugin } from "vite";

function exposeSupabaseEnvForStaticClient(): Plugin {
  return {
    name: "zero9home-expose-supabase-env-for-client",
    config(_, { mode }) {
      const env = loadEnv(mode, process.cwd(), "");
      const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
      const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY;

      return {
        define: {
          ...(supabaseUrl ? { "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl) } : {}),
          ...(supabaseKey ? { "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(supabaseKey) } : {}),
        },
      };
    },
  };
}

function appwriteStaticFallbackPlugin(): Plugin {
  return {
    name: "zero9home-appwrite-static-fallback",
    apply: "build",
    closeBundle() {
      const indexHtml = join(process.cwd(), "dist", "index.html");
      const notFoundHtml = join(process.cwd(), "dist", "404.html");

      // Appwrite Static Sites can use this as the SPA fallback file. A 404.html
      // copy also protects hosts that automatically fallback to /404.html.
      if (existsSync(indexHtml)) {
        copyFileSync(indexHtml, notFoundHtml);
      }
    },
  };
}

export default defineConfig({
  // Appwrite was serving the project as a static site, while the previous config
  // emitted a Nitro SSR bundle. Build a real static SPA instead: dist/index.html
  // + dist/404.html + prerendered route folders.
  nitro: false,
  tanstackStart: {
    spa: {
      enabled: true,
      maskPath: "/",
      prerender: { outputPath: "/index" },
    },
    prerender: {
      enabled: true,
      crawlLinks: false,
      failOnError: false,
    },
    pages: [
      { path: "/explore" },
      { path: "/list" },
      { path: "/admin" },
    ],
  },
  vite: {
    environments: {
      client: { build: { outDir: "dist" } },
      ssr: { build: { outDir: ".tanstack/server" } },
    },
    plugins: [exposeSupabaseEnvForStaticClient(), appwriteStaticFallbackPlugin()],
  },
});
